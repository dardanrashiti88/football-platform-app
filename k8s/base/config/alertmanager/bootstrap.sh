#!/bin/sh
set -eu

mkdir -p /tmp/alertmanager

cat >/tmp/alertmanager/alertmanager.yml <<EOF
global:
  resolve_timeout: 5m
  smtp_smarthost: '${SMTP_SMARTHOST}'
  smtp_from: '${SMTP_FROM}'
  smtp_auth_username: '${SMTP_AUTH_USERNAME}'
  smtp_auth_password: '${SMTP_AUTH_PASSWORD}'
  smtp_require_tls: true

route:
  receiver: email-default
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

receivers:
  - name: email-default
    email_configs:
      - to: '${ALERT_EMAIL_TO}'
        send_resolved: true
EOF

exec /bin/alertmanager --config.file=/tmp/alertmanager/alertmanager.yml --storage.path=/alertmanager
