# Terraform Infra

This folder manages the current FOD stack with Terraform and the Docker provider.

## What it provisions

- `frontend` nginx container
- `backend` Node container
- `db-api` container
- `blackbox-exporter`
- `prometheus`
- `alertmanager`
- `grafana`
- persistent Docker volumes for backend data and monitoring state
- a shared Docker network for the whole stack

## Why Docker-based Terraform

Right now the app is designed around local/container infrastructure and you do not have an AWS, Azure, or GCP account yet.

So this Terraform layer gives you real infrastructure-as-code for the stack you already run today.

## HCP Terraform note

HCP Terraform can store state and run plans for this project, but because this stack uses the Docker provider it needs access to the target Docker daemon.

That means one of these is required:

1. CLI-driven Terraform runs from the machine that has Docker
2. an HCP Terraform Agent running on the same host that has Docker access

Standard HCP remote runners cannot manage your local Docker engine.

## Quick start

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

## URLs after apply

- frontend: `http://localhost:8080`
- desktop: `http://localhost:8080/frontend/index.html`
- mobile: `http://localhost:8080/mobile`
- backend health: `http://localhost:3002/api/health`
- db-api health: `http://localhost:3010/api/v1/health`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`
- Alertmanager: `http://localhost:9093`

## HCP Terraform setup

If you want to wire this into HCP Terraform:

1. Copy `cloud.tf.example` to `cloud.tf`
2. Replace the organization and workspace name
3. Use CLI-driven runs or an HCP agent on the Docker host

## Clean up

```bash
terraform destroy
```
