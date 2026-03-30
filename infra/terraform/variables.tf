variable "project_name" {
  description = "Base name used for Terraform-managed Docker resources."
  type        = string
  default     = "football-platform-app"
}

variable "image_tag" {
  description = "Image tag used for locally built application images."
  type        = string
  default     = "latest"
}

variable "frontend_port" {
  description = "Host port for the nginx frontend container."
  type        = number
  default     = 8080
}

variable "backend_port" {
  description = "Host port for the backend API container."
  type        = number
  default     = 3002
}

variable "db_api_port" {
  description = "Host port for the DB API container."
  type        = number
  default     = 3010
}

variable "prometheus_port" {
  description = "Host port for Prometheus."
  type        = number
  default     = 9090
}

variable "grafana_port" {
  description = "Host port for Grafana."
  type        = number
  default     = 3001
}

variable "alertmanager_port" {
  description = "Host port for Alertmanager."
  type        = number
  default     = 9093
}

variable "blackbox_port" {
  description = "Host port for the blackbox exporter."
  type        = number
  default     = 9115
}

variable "grafana_admin_user" {
  description = "Grafana admin username."
  type        = string
  default     = "fod-monitor"
}

variable "grafana_admin_password" {
  description = "Grafana admin password."
  type        = string
  sensitive   = true
  default     = "FodMonitor2026!"
}

variable "smtp_smarthost" {
  description = "SMTP relay used by Alertmanager."
  type        = string
  default     = "smtp.example.com:587"
}

variable "smtp_from" {
  description = "From address for Alertmanager emails."
  type        = string
  default     = "alerts@example.com"
}

variable "smtp_auth_username" {
  description = "SMTP username for Alertmanager."
  type        = string
  default     = "alerts@example.com"
}

variable "smtp_auth_password" {
  description = "SMTP password for Alertmanager."
  type        = string
  sensitive   = true
  default     = "change-me"
}

variable "alert_email_to" {
  description = "Recipient address for Alertmanager notifications."
  type        = string
  default     = "alerts@example.com"
}
