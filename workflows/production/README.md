# Production Workflow

This folder contains the controlled production gate.

Purpose:

- keep production deployment manual
- build all Docker services before release
- give us one clean place to extend later with a real host deploy command

Entry script:

- `workflows/production/run-release-check.sh`
