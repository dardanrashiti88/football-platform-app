#!/usr/bin/env bash
set -euo pipefail

ARGO_NAMESPACE="${ARGO_NAMESPACE:-argocd}"
APP_NAMESPACE="${APP_NAMESPACE:-football-platform}"
FAILURES=0

print_section() {
  echo
  echo "$1"
  echo "--------------------------------"
}

check_rollouts() {
  local namespace="$1"
  local kind="$2"
  local names
  names="$(kubectl get "$kind" -n "$namespace" -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' 2>/dev/null || true)"
  [[ -z "$names" ]] && return 0

  while IFS= read -r name; do
    [[ -z "$name" ]] && continue
    if kubectl rollout status "$kind/$name" -n "$namespace" --timeout=120s >/dev/null; then
      echo "[PASS] $namespace $kind/$name is ready"
    else
      echo "[FAIL] $namespace $kind/$name is not ready"
      FAILURES=$((FAILURES + 1))
    fi
  done <<< "$names"
}

check_pods() {
  local namespace="$1"
  local lines
  lines="$(kubectl get pods -n "$namespace" --no-headers 2>/dev/null || true)"
  [[ -z "$lines" ]] && return 0

  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    local name ready status restarts
    name="$(awk '{print $1}' <<< "$line")"
    ready="$(awk '{print $2}' <<< "$line")"
    status="$(awk '{print $3}' <<< "$line")"
    restarts="$(awk '{print $4}' <<< "$line")"

    if [[ "$status" == "Running" || "$status" == "Completed" ]]; then
      echo "[PASS] $namespace pod/$name $ready $status restarts=$restarts"
    else
      echo "[FAIL] $namespace pod/$name $ready $status restarts=$restarts"
      FAILURES=$((FAILURES + 1))
    fi
  done <<< "$lines"
}

check_applications() {
  if ! kubectl get crd applications.argoproj.io >/dev/null 2>&1; then
    echo "[WARN] Argo CD Applications CRD not installed; skipping Argo application checks"
    return 0
  fi

  local apps
  apps="$(kubectl get applications -n "$ARGO_NAMESPACE" -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' 2>/dev/null || true)"
  [[ -z "$apps" ]] && return 0

  while IFS= read -r app; do
    [[ -z "$app" ]] && continue
    local sync health
    sync="$(kubectl get application "$app" -n "$ARGO_NAMESPACE" -o jsonpath='{.status.sync.status}' 2>/dev/null || true)"
    health="$(kubectl get application "$app" -n "$ARGO_NAMESPACE" -o jsonpath='{.status.health.status}' 2>/dev/null || true)"
    if [[ "$sync" == "Synced" && "$health" == "Healthy" ]]; then
      echo "[PASS] Argo application/$app sync=$sync health=$health"
    else
      echo "[FAIL] Argo application/$app sync=${sync:-unknown} health=${health:-unknown}"
      FAILURES=$((FAILURES + 1))
    fi
  done <<< "$apps"
}

echo "Kubernetes Healthcheck"
echo "================================"
print_section "Argo CD Rollouts"
check_rollouts "$ARGO_NAMESPACE" deployment
check_rollouts "$ARGO_NAMESPACE" statefulset

print_section "Argo CD Applications"
check_applications

print_section "Application Rollouts"
check_rollouts "$APP_NAMESPACE" deployment
check_rollouts "$APP_NAMESPACE" statefulset
check_rollouts "$APP_NAMESPACE" daemonset

print_section "Pod Status"
check_pods "$ARGO_NAMESPACE"
check_pods "$APP_NAMESPACE"

print_section "Services"
kubectl get svc -n "$ARGO_NAMESPACE" || true
kubectl get svc -n "$APP_NAMESPACE" || true

print_section "Ingress"
kubectl get ingress -n "$APP_NAMESPACE" || true

if [[ "$FAILURES" -gt 0 ]]; then
  echo
  echo "Healthcheck found ${FAILURES} issue(s)."
  exit 1
fi

echo
 echo "Kubernetes healthcheck passed."
