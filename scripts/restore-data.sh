#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_PATH="${1:-}"
MODE="${2:-all}"

DEFAULT_DB_PATH="${ROOT_DIR}/backend/database/fodr.sqlite"
DB_PATH="${FODR_DB_PATH:-${DEFAULT_DB_PATH}}"
ROOT_ENV_PATH="${ROOT_DIR}/.env"
K8S_SECRETS_DIR="${ROOT_DIR}/k8s/secrets/local"

DOCKER_VOLUMES=(
  "fod-backend-data"
  "prometheus-data"
  "grafana-data"
  "alertmanager-data"
)

print_section() {
  echo
  echo "$1"
  echo "--------------------------------"
}

usage() {
  cat <<EOF
Usage: bash scripts/restore-data.sh <backup-dir> [local|docker|all]

Examples:
  bash scripts/restore-data.sh backups/20260331-160000
  bash scripts/restore-data.sh backups/20260331-160000 docker
EOF
}

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is required for docker-volume restores." >&2
    exit 1
  fi
}

restore_file_if_present() {
  local source="$1"
  local target="$2"
  if [[ ! -f "${source}" ]]; then
    return 0
  fi
  mkdir -p "$(dirname "${target}")"
  cp "${source}" "${target}"
  echo "[RESTORE] ${source} -> ${target}"
}

restore_local() {
  local source_root="${BACKUP_PATH}/local"
  print_section "Restore Local Data"

  if [[ ! -d "${source_root}" ]]; then
    echo "[SKIP] No local backup data in ${source_root}"
    return 0
  fi

  restore_file_if_present "${source_root}/backend/fodr.sqlite" "${DB_PATH}"
  restore_file_if_present "${source_root}/root/.env" "${ROOT_ENV_PATH}"

  if [[ -d "${source_root}/k8s-secrets" ]]; then
    mkdir -p "${K8S_SECRETS_DIR}"
    find "${source_root}/k8s-secrets" -maxdepth 1 -type f -name '*.env' -print0 | while IFS= read -r -d '' file; do
      restore_file_if_present "${file}" "${K8S_SECRETS_DIR}/$(basename "${file}")"
    done
  else
    echo "[SKIP] No Kubernetes secret env backups found"
  fi
}

restore_docker() {
  local source_root="${BACKUP_PATH}/docker"
  print_section "Restore Docker Volumes"
  require_docker

  if [[ ! -d "${source_root}" ]]; then
    echo "[SKIP] No docker backup data in ${source_root}"
    return 0
  fi

  for volume in "${DOCKER_VOLUMES[@]}"; do
    local archive="${source_root}/${volume}.tar.gz"
    if [[ ! -f "${archive}" ]]; then
      echo "[SKIP] No archive for ${volume}"
      continue
    fi

    docker volume create "${volume}" >/dev/null
    docker run --rm \
      -v "${volume}:/target" \
      -v "${source_root}:/backup:ro" \
      busybox sh -c "rm -rf /target/* /target/.[!.]* /target/..?* 2>/dev/null || true; tar -xzf /backup/$(basename "${archive}") -C /target"
    echo "[RESTORE] Docker volume ${volume} <- ${archive}"
  done
}

if [[ -z "${BACKUP_PATH}" || ! -d "${BACKUP_PATH}" ]]; then
  usage
  exit 1
fi

case "${MODE}" in
  local)
    restore_local
    ;;
  docker)
    restore_docker
    ;;
  all)
    restore_local
    restore_docker
    ;;
  *)
    usage
    exit 1
    ;;
esac

echo
echo "Restore completed from:"
echo "  ${BACKUP_PATH}"
