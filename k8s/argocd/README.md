# Argo CD

This directory connects Argo CD to the Kubernetes manifests in `k8s/`.

## Structure

- `base/` contains the shared `AppProject`
- `overlays/local/` points Argo CD at `k8s/overlays/local`
- `overlays/production/` points Argo CD at `k8s/overlays/production`

## Bootstrap

Use the bootstrap script from the repo root:

```bash
bash scripts/argocd-bootstrap.sh local
```

That script:

1. creates `argocd` and `football-platform` namespaces
2. installs Argo CD
3. applies the Argo CD project and application manifests
4. waits for the main Argo CD components
5. prints the initial admin password if available

## Port-forward the UI

```bash
kubectl port-forward svc/argocd-server -n argocd 8081:443
```

Then open:

- `https://localhost:8081`
