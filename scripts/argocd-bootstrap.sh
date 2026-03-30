#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARGO_OVERLAY="${1:-local}"
ARGO_TARGET="${ROOT_DIR}/k8s/argocd/overlays/${ARGO_OVERLAY}"
ARGO_NAMESPACE="argocd"
APP_NAMESPACE="football-platform"
ARGO_INSTALL_URL="https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml"

if [[ ! -d "${ARGO_TARGET}" ]]; then
  echo "Unknown Argo CD overlay: ${ARGO_OVERLAY}" >&2
  echo "Use one of: local, production" >&2
  exit 1
fi

if ! command -v kubectl >/dev/null 2>&1; then
  echo "kubectl is required." >&2
  exit 1
fi

if [[ "${ARGO_OVERLAY}" == "local" && "${SKIP_IMAGE_BUILD:-0}" != "1" ]]; then
  bash "${ROOT_DIR}/scripts/k8s-build-images.sh"
fi

echo "Creating namespaces if needed..."
kubectl create namespace "${ARGO_NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace "${APP_NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

echo "Installing Argo CD from the official manifest..."
kubectl apply -n "${ARGO_NAMESPACE}" --server-side --force-conflicts -f "${ARGO_INSTALL_URL}"

echo "Waiting for Argo CD core deployments..."
kubectl rollout status deployment/argocd-server -n "${ARGO_NAMESPACE}" --timeout=300s
kubectl rollout status deployment/argocd-repo-server -n "${ARGO_NAMESPACE}" --timeout=300s
kubectl rollout status deployment/argocd-applicationset-controller -n "${ARGO_NAMESPACE}" --timeout=300s
kubectl rollout status deployment/argocd-dex-server -n "${ARGO_NAMESPACE}" --timeout=300s || true
kubectl rollout status statefulset/argocd-application-controller -n "${ARGO_NAMESPACE}" --timeout=300s || true

echo "Applying Argo CD project + application manifests from ${ARGO_OVERLAY}..."
kubectl apply -k "${ARGO_TARGET}"

echo "Waiting for Argo CD application to appear..."
APP_NAME="football-platform-${ARGO_OVERLAY}"
kubectl wait --for=jsonpath='{.status.health.status}'=Healthy application/${APP_NAME} -n "${ARGO_NAMESPACE}" --timeout=300s || true
kubectl wait --for=jsonpath='{.status.sync.status}'=Synced application/${APP_NAME} -n "${ARGO_NAMESPACE}" --timeout=300s || true

echo
kubectl get applications -n "${ARGO_NAMESPACE}"
echo
kubectl get pods -n "${ARGO_NAMESPACE}"
echo
kubectl get pods -n "${APP_NAMESPACE}"

echo
if kubectl get secret argocd-initial-admin-secret -n "${ARGO_NAMESPACE}" >/dev/null 2>&1; then
  PASSWORD="$(kubectl get secret argocd-initial-admin-secret -n "${ARGO_NAMESPACE}" -o jsonpath='{.data.password}' | base64 -d)"
  echo "Argo CD initial admin password: ${PASSWORD}"
fi

echo "Port-forward UI with: kubectl port-forward svc/argocd-server -n ${ARGO_NAMESPACE} 8081:443"
