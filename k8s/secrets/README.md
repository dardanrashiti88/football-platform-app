# Kubernetes Secrets

This directory is the safe home for Kubernetes secret inputs.

What lives in Git:

- `examples/` with placeholder env files
- docs and helper scripts

What does **not** live in Git:

- real `local/*.env`
- real `production/*.env`

Flow:

1. Create local secret env files from the examples.
2. Fill in real values.
3. Apply them to the cluster with `npm run k8s:apply-secrets -- <env>`.
4. Then apply the manifests or bootstrap Argo CD.

Current environments:

- `local`
- `production`

This is the first secure step for the repo.
It keeps real secrets out of Git while still letting Argo CD and Kubernetes use stable secret names.
