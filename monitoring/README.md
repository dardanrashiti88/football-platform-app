# Monitoring Structure

Keep monitoring split like this:

- `monitoring/prometheus/`
  - scrape config
  - alert rules
- `monitoring/alertmanager/`
  - alert delivery config/bootstrap
- `monitoring/grafana/`
  - datasources
  - dashboards
- `monitoring/blackbox/`
  - uptime probes

What should live in Git:

- Prometheus scrape configs
- alert rules
- Grafana dashboards
- Alertmanager templates/bootstrap

What should **not** live in Git:

- SMTP usernames
- SMTP passwords
- email recipients for private use
- provider tokens

Put those secrets in:

- local `.env` for local testing
- server env vars
- GitHub Actions secrets
- a secret manager if you deploy later
