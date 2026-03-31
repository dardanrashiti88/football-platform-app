# Kubernetes Manifests

This directory gives the app a full Kubernetes layout for the core web stack and the monitoring stack.

## What is included

- `frontend`, `backend`, and `db-api` Deployments and Services
- `Prometheus`, `Grafana`, `Alertmanager`, and `blackbox-exporter`
- PersistentVolumeClaims for backend SQLite, Prometheus, Grafana, and Alertmanager
- Ingress for the app and monitoring endpoints
- HPAs for stateless services
- PodDisruptionBudgets
- `kustomize` structure with `base`, `overlays/local`, and `overlays/production`

## Important note about the backend

The backend still uses SQLite.
That means it should stay at a single replica until the app moves to a shared database such as PostgreSQL.
The manifests keep `backend` at `1` replica on purpose.

## Before applying

1. Build and publish images, or load them into your cluster:
   - `football-platform-app-frontend:latest`
   - `football-platform-app-backend:latest`
   - `football-platform-app-db-api:latest`
2. Create secret env files:
   - `npm run k8s:init-secrets -- local`
3. Fill in the real values in:
   - `k8s/secrets/local/grafana.env`
   - `k8s/secrets/local/alertmanager.env`
   - if you do not want SMTP yet for local dev, set `ENABLE_EMAIL_ALERTS=false`
4. Apply the secrets to the cluster:
   - `npm run k8s:apply-secrets -- local`
5. Validate them any time with:
   - `npm run k8s:check-secrets -- local`
6. Make sure your cluster has:
   - an Ingress controller such as `ingress-nginx`
   - a StorageClass for the PVCs
   - metrics-server if you want the HPAs to work

## Apply

```bash
kubectl apply -k k8s/overlays/local
```

For production-style settings:

```bash
kubectl apply -k k8s/overlays/production
```

## Render manifests locally

```bash
kubectl kustomize k8s/base
```
