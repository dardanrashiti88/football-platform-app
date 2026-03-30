#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OVERLAY="${1:-local}"
TARGET="${ROOT_DIR}/k8s/overlays/${OVERLAY}"

if [[ ! -d "${TARGET}" ]]; then
  echo "Unknown Kubernetes overlay: ${OVERLAY}" >&2
  echo "Use one of: local, production" >&2
  exit 1
fi

if [[ "${OVERLAY}" == "local" && "${SKIP_IMAGE_BUILD:-0}" != "1" ]]; then
  bash "${ROOT_DIR}/scripts/k8s-build-images.sh"
fi

echo "Applying Kubernetes overlay: ${OVERLAY}"
kubectl apply -k "${TARGET}"

echo
kubectl get pods -n football-platform
