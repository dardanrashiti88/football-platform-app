#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "Validating docker compose file..."
docker compose config >/dev/null

echo "Building production images..."
docker compose build frontend backend db-api

echo "Production release checks passed."
