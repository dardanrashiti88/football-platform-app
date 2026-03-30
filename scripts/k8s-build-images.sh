#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Building local app images into Minikube..."
minikube image build -t football-platform-app-frontend:latest -f frontend/Dockerfile .
minikube image build -t football-platform-app-backend:latest -f backend/Dockerfile .
minikube image build -t football-platform-app-db-api:latest -f db-api/Dockerfile .

echo
minikube image ls | rg 'football-platform-app-(frontend|backend|db-api)' || true
