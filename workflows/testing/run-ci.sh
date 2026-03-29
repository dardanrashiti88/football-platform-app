#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "Installing backend dependencies..."
npm --prefix backend ci

echo "Installing DB API dependencies..."
npm --prefix db-api ci

echo "Installing dashboard dependencies..."
npm --prefix Dashboard-view ci

echo "Running filesystem healthcheck..."
npm run healthcheck

echo "Building dashboard..."
npm run build:dashboard

echo "Testing workflow checks passed."
