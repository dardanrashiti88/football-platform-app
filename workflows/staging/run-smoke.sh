#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

BACKEND_LOG="/tmp/fod-backend-staging.log"
DB_API_LOG="/tmp/fod-db-api-staging.log"
TEST_DB="/tmp/fod-staging.sqlite"
BACKEND_PID=""
DB_API_PID=""

cleanup() {
  if [[ -n "${BACKEND_PID}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    kill "${BACKEND_PID}" 2>/dev/null || true
    wait "${BACKEND_PID}" 2>/dev/null || true
  fi
  if [[ -n "${DB_API_PID}" ]] && kill -0 "${DB_API_PID}" 2>/dev/null; then
    kill "${DB_API_PID}" 2>/dev/null || true
    wait "${DB_API_PID}" 2>/dev/null || true
  fi
  rm -f "${TEST_DB}"
}

trap cleanup EXIT

echo "Starting DB API..."
PORT=3010 npm --prefix db-api start >"${DB_API_LOG}" 2>&1 &
DB_API_PID=$!

echo "Starting backend..."
PORT=3002 FODR_DB_PATH="${TEST_DB}" npm --prefix backend start >"${BACKEND_LOG}" 2>&1 &
BACKEND_PID=$!

echo "Waiting for services..."
for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:3002/api/health >/dev/null 2>&1 && \
     curl -fsS http://127.0.0.1:3010/api/v1/health >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

curl -fsS http://127.0.0.1:3002/api/health >/dev/null
curl -fsS http://127.0.0.1:3010/api/v1/health >/dev/null

echo "Running live healthcheck..."
npm run healthcheck:live

STAMP="$(date +%s)"
EMAIL="staging-${STAMP}@example.com"
USERNAME="staging${STAMP}"
PASSWORD="ynwa1234"

echo "Checking register flow..."
REGISTER_RESPONSE="$(curl -fsS -X POST http://127.0.0.1:3002/api/auth/register \
  -H 'Content-Type: application/json' \
  -d "{\"username\":\"${USERNAME}\",\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")"
printf '%s' "${REGISTER_RESPONSE}" | grep -q '"user"'

echo "Checking login flow..."
LOGIN_RESPONSE="$(curl -fsS -X POST http://127.0.0.1:3002/api/auth/login \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")"
printf '%s' "${LOGIN_RESPONSE}" | grep -q '"user"'

echo "Staging smoke checks passed."
