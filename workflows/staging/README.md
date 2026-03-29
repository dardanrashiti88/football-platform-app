# Staging Workflow

This folder contains the safe pre-production checks.

Purpose:

- boot the backend and DB API together
- run live health checks
- verify a basic auth flow works
- behave like a safe staging gate before production

Entry script:

- `workflows/staging/run-smoke.sh`
