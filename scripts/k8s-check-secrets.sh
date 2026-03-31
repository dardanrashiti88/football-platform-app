#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENVIRONMENT="${1:-local}"
SECRETS_DIR="${ROOT_DIR}/k8s/secrets/${ENVIRONMENT}"
FAILURES=0

require_file() {
  local path="$1"
  if [[ -f "${path}" ]]; then
    echo "[PASS] ${path} exists"
  else
    echo "[FAIL] Missing ${path}"
    FAILURES=$((FAILURES + 1))
  fi
}

check_env_key() {
  local file="$1"
  local key="$2"
  local value
  value="$(sed -n "s/^${key}=//p" "${file}" | head -n 1)"
  if [[ -z "${value}" ]]; then
    echo "[FAIL] ${file} is missing ${key}"
    FAILURES=$((FAILURES + 1))
    return 0
  fi
  if [[ "${value}" == "change-me" || "${value}" == "alerts@example.com" || "${value}" == "smtp.example.com:587" ]]; then
    echo "[FAIL] ${file} still has placeholder for ${key}"
    FAILURES=$((FAILURES + 1))
    return 0
  fi
  echo "[PASS] ${file} has ${key}"
}

echo "Kubernetes Secrets Check (${ENVIRONMENT})"
echo "================================"

GRAFANA_ENV="${SECRETS_DIR}/grafana.env"
ALERTMANAGER_ENV="${SECRETS_DIR}/alertmanager.env"

require_file "${GRAFANA_ENV}"
require_file "${ALERTMANAGER_ENV}"

if [[ -f "${GRAFANA_ENV}" ]]; then
  check_env_key "${GRAFANA_ENV}" "GF_SECURITY_ADMIN_USER"
  check_env_key "${GRAFANA_ENV}" "GF_SECURITY_ADMIN_PASSWORD"
fi

if [[ -f "${ALERTMANAGER_ENV}" ]]; then
  alerting_enabled="$(sed -n 's/^ENABLE_EMAIL_ALERTS=//p' "${ALERTMANAGER_ENV}" | head -n 1 | tr '[:upper:]' '[:lower:]')"
  if [[ "${alerting_enabled:-false}" == "true" ]]; then
    echo "[PASS] ${ALERTMANAGER_ENV} has ENABLE_EMAIL_ALERTS=true"
    check_env_key "${ALERTMANAGER_ENV}" "SMTP_SMARTHOST"
    check_env_key "${ALERTMANAGER_ENV}" "SMTP_FROM"
    check_env_key "${ALERTMANAGER_ENV}" "SMTP_AUTH_USERNAME"
    check_env_key "${ALERTMANAGER_ENV}" "SMTP_AUTH_PASSWORD"
    check_env_key "${ALERTMANAGER_ENV}" "ALERT_EMAIL_TO"
  else
    echo "[PASS] ${ALERTMANAGER_ENV} has email alerting disabled for this environment"
  fi
fi

if [[ "${FAILURES}" -gt 0 ]]; then
  echo
  echo "Secret check found ${FAILURES} issue(s)."
  exit 1
fi

echo
echo "Kubernetes secrets check passed."
