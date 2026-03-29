# Testing Workflow

This folder contains the checks we want to run on every push and pull request.

Current goals:

- install backend, DB API, and dashboard dependencies
- verify the repo structure with `npm run healthcheck`
- make sure the dashboard build still works

Entry script:

- `workflows/testing/run-ci.sh`
