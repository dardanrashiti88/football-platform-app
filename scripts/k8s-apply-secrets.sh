#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENVIRONMENT="${1:-local}"
NAMESPACE="${K8S_NAMESPACE:-football-platform}"
SECRETS_DIR="${ROOT_DIR}/k8s/secrets/${ENVIRONMENT}"
GRAFANA_ENV="${SECRETS_DIR}/grafana.env"
ALERTMANAGER_ENV="${SECRETS_DIR}/alertmanager.env"

bash "${ROOT_DIR}/scripts/k8s-check-secrets.sh" "${ENVIRONMENT}"

echo "Applying Kubernetes secrets for ${ENVIRONMENT}..."

kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic grafana-auth \
  -n "${NAMESPACE}" \
  --from-env-file="${GRAFANA_ENV}" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic alertmanager-smtp \
  -n "${NAMESPACE}" \
  --from-env-file="${ALERTMANAGER_ENV}" \
  --dry-run=client -o yaml | kubectl apply -f -

echo
kubectl get secret -n "${NAMESPACE}" grafana-auth alertmanager-smtp
