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

echo "Applying Kubernetes overlay: ${OVERLAY}"
kubectl apply -k "${TARGET}"

echo
kubectl get pods -n football-platform
