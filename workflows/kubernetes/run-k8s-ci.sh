#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${ROOT_DIR}"

echo "Rendering Kubernetes manifests..."
kubectl kustomize k8s/base >/tmp/k8s-base.yaml
kubectl kustomize k8s/overlays/local >/tmp/k8s-local.yaml
kubectl kustomize k8s/overlays/production >/tmp/k8s-production.yaml

echo
echo "Validating rendered manifests against the cluster..."
kubectl apply --dry-run=server -f /tmp/k8s-base.yaml >/dev/null
kubectl apply --dry-run=server -f /tmp/k8s-local.yaml >/dev/null
kubectl apply --dry-run=server -f /tmp/k8s-production.yaml >/dev/null

echo
echo "Preparing throwaway local secret files for CI..."
mkdir -p k8s/secrets/local
cat > k8s/secrets/local/grafana.env <<'EOF'
GF_SECURITY_ADMIN_USER=fod-monitor
GF_SECURITY_ADMIN_PASSWORD=FodCiGrafana2026!
EOF

cat > k8s/secrets/local/alertmanager.env <<'EOF'
ENABLE_EMAIL_ALERTS=false
SMTP_SMARTHOST=smtp.example.com:587
SMTP_FROM=alerts@example.com
SMTP_AUTH_USERNAME=alerts@example.com
SMTP_AUTH_PASSWORD=change-me
ALERT_EMAIL_TO=alerts@example.com
EOF

echo
echo "Applying local Kubernetes overlay..."
SKIP_IMAGE_BUILD=1 bash scripts/k8s-apply.sh local

echo
echo "Running Kubernetes healthcheck..."
bash scripts/healthcheck-k8s.sh
