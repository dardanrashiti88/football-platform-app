output "frontend_url" {
  description = "Public URL for the frontend container."
  value       = "http://localhost:${var.frontend_port}"
}

output "desktop_url" {
  description = "Direct desktop entrypoint."
  value       = "http://localhost:${var.frontend_port}/frontend/index.html"
}

output "mobile_url" {
  description = "Direct mobile entrypoint."
  value       = "http://localhost:${var.frontend_port}/mobile"
}

output "backend_health_url" {
  description = "Backend health endpoint."
  value       = "http://localhost:${var.backend_port}/api/health"
}

output "db_api_health_url" {
  description = "DB API health endpoint."
  value       = "http://localhost:${var.db_api_port}/api/v1/health"
}

output "prometheus_url" {
  description = "Prometheus UI URL."
  value       = "http://localhost:${var.prometheus_port}"
}

output "grafana_url" {
  description = "Grafana UI URL."
  value       = "http://localhost:${var.grafana_port}"
}

output "alertmanager_url" {
  description = "Alertmanager UI URL."
  value       = "http://localhost:${var.alertmanager_port}"
}

output "grafana_admin_user" {
  description = "Grafana admin username."
  value       = var.grafana_admin_user
}
