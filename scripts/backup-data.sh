#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-all}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_ROOT="${ROOT_DIR}/backups/${STAMP}"
LOCAL_ROOT="${BACKUP_ROOT}/local"
DOCKER_ROOT="${BACKUP_ROOT}/docker"

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
Usage: bash scripts/backup-data.sh [local|docker|all]

Modes:
  local   Backup local app data and secret inputs
  docker  Backup Docker volumes
  all     Backup both local and docker data (default)
EOF
}

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is required for docker-volume backups." >&2
    exit 1
  fi
}

safe_copy_file() {
  local source="$1"
  local target="$2"
  if [[ ! -f "${source}" ]]; then
    return 0
  fi
  mkdir -p "$(dirname "${target}")"
  cp "${source}" "${target}"
  echo "[BACKUP] ${source} -> ${target}"
}

backup_local() {
  print_section "Local Data"
  mkdir -p "${LOCAL_ROOT}"

  if [[ -f "${DB_PATH}" ]]; then
    safe_copy_file "${DB_PATH}" "${LOCAL_ROOT}/backend/fodr.sqlite"
  else
    echo "[SKIP] SQLite database not found at ${DB_PATH}"
  fi

  if [[ -f "${ROOT_ENV_PATH}" ]]; then
    safe_copy_file "${ROOT_ENV_PATH}" "${LOCAL_ROOT}/root/.env"
  else
    echo "[SKIP] Root .env not present"
  fi

  if [[ -d "${K8S_SECRETS_DIR}" ]]; then
    mkdir -p "${LOCAL_ROOT}/k8s-secrets"
    find "${K8S_SECRETS_DIR}" -maxdepth 1 -type f -name '*.env' -print0 | while IFS= read -r -d '' file; do
      safe_copy_file "${file}" "${LOCAL_ROOT}/k8s-secrets/$(basename "${file}")"
    done
  else
    echo "[SKIP] Local Kubernetes secret env directory not present"
  fi
}

backup_docker() {
  print_section "Docker Volumes"
  require_docker
  mkdir -p "${DOCKER_ROOT}"

  for volume in "${DOCKER_VOLUMES[@]}"; do
    if ! docker volume inspect "${volume}" >/dev/null 2>&1; then
      echo "[SKIP] Docker volume ${volume} does not exist"
      continue
    fi

    local archive="${DOCKER_ROOT}/${volume}.tar.gz"
    docker run --rm \
      -v "${volume}:/source:ro" \
      -v "${DOCKER_ROOT}:/backup" \
      busybox sh -c "tar -czf /backup/$(basename "${archive}") -C /source ."
    echo "[BACKUP] Docker volume ${volume} -> ${archive}"
  done
}

write_manifest() {
  cat > "${BACKUP_ROOT}/manifest.txt" <<EOF
created_at=${STAMP}
mode=${MODE}
db_path=${DB_PATH}
root_env_present=$([[ -f "${ROOT_ENV_PATH}" ]] && echo true || echo false)
k8s_secrets_present=$([[ -d "${K8S_SECRETS_DIR}" ]] && echo true || echo false)
docker_volumes=${DOCKER_VOLUMES[*]}
EOF
}

case "${MODE}" in
  local)
    mkdir -p "${BACKUP_ROOT}"
    backup_local
    ;;
  docker)
    mkdir -p "${BACKUP_ROOT}"
    backup_docker
    ;;
  all)
    mkdir -p "${BACKUP_ROOT}"
    backup_local
    backup_docker
    ;;
  *)
    usage
    exit 1
    ;;
esac

write_manifest

echo
echo "Backup created at:"
echo "  ${BACKUP_ROOT}"
