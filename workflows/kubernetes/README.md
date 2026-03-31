# Kubernetes Workflow

This workflow is the GitHub Actions check for the Kubernetes side of the project.

It does four things:

1. renders the manifests
2. validates the YAML against a real test cluster
3. builds the local app images and loads them into a temporary `kind` cluster
4. applies the local overlay and runs the Kubernetes healthcheck

Triggers:

- manual run from GitHub Actions
- daily scheduled run at `06:00` Europe/Tirane time

Main files:

- `.github/workflows/kubernetes.yml`
- `workflows/kubernetes/run-k8s-ci.sh`
- `scripts/healthcheck-k8s.sh`
