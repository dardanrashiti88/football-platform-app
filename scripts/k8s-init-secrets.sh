#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENVIRONMENT="${1:-local}"
SECRETS_DIR="${ROOT_DIR}/k8s/secrets/${ENVIRONMENT}"
EXAMPLES_DIR="${ROOT_DIR}/k8s/secrets/examples"

mkdir -p "${SECRETS_DIR}"

copy_if_missing() {
  local source="$1"
  local target="$2"
  if [[ -f "${target}" ]]; then
    echo "[SKIP] ${target} already exists"
    return 0
  fi

  cp "${source}" "${target}"
  echo "[CREATE] ${target}"
}

copy_if_missing "${EXAMPLES_DIR}/grafana.env.example" "${SECRETS_DIR}/grafana.env"
copy_if_missing "${EXAMPLES_DIR}/alertmanager.env.example" "${SECRETS_DIR}/alertmanager.env"

echo
echo "Secret env files are ready in ${SECRETS_DIR}"
echo "Fill them with real values, then run:"
echo "  npm run k8s:apply-secrets -- ${ENVIRONMENT}"
