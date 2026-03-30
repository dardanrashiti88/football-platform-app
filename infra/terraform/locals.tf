locals {
  project_name = var.project_name
  repo_root    = abspath("${path.root}/../..")

  image_names = {
    frontend = "${var.project_name}/frontend:${var.image_tag}"
    backend  = "${var.project_name}/backend:${var.image_tag}"
    db_api   = "${var.project_name}/db-api:${var.image_tag}"
  }

  official_images = {
    blackbox     = "prom/blackbox-exporter:v0.25.0"
    prometheus   = "prom/prometheus:v2.53.1"
    alertmanager = "prom/alertmanager:v0.27.0"
    grafana      = "grafana/grafana:11.1.4"
  }

  ports = {
    frontend     = var.frontend_port
    backend      = var.backend_port
    db_api       = var.db_api_port
    prometheus   = var.prometheus_port
    grafana      = var.grafana_port
    alertmanager = var.alertmanager_port
    blackbox     = var.blackbox_port
  }

  backend_env = [
    "NODE_ENV=production",
    "PORT=3002",
    "FODR_DB_PATH=/data/fodr.sqlite"
  ]

  db_api_env = [
    "NODE_ENV=production",
    "PORT=3010",
    "API_BASE_PATH=/api/v1"
  ]

  grafana_env = [
    "GF_SECURITY_ADMIN_USER=${var.grafana_admin_user}",
    "GF_SECURITY_ADMIN_PASSWORD=${var.grafana_admin_password}",
    "GF_USERS_ALLOW_SIGN_UP=false"
  ]

  alertmanager_env = [
    "SMTP_SMARTHOST=${var.smtp_smarthost}",
    "SMTP_FROM=${var.smtp_from}",
    "SMTP_AUTH_USERNAME=${var.smtp_auth_username}",
    "SMTP_AUTH_PASSWORD=${var.smtp_auth_password}",
    "ALERT_EMAIL_TO=${var.alert_email_to}"
  ]
}
