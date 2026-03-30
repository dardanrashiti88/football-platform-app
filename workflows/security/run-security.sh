#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "Running baseline testing checks first..."
bash workflows/testing/run-ci.sh

echo "Running backend dependency security audit..."
npm --prefix backend audit --omit=dev --audit-level=critical

echo "Running DB API dependency security audit..."
npm --prefix db-api audit --omit=dev --audit-level=critical

echo "Running dashboard dependency security audit..."
npm --prefix Dashboard-view audit --omit=dev --audit-level=critical

echo "Security workflow checks passed."
