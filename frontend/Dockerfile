# syntax=docker/dockerfile:1.7

FROM nginx:1.27-alpine

COPY frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY index.html /usr/share/nginx/html/index.html
COPY frontend /usr/share/nginx/html/frontend
COPY mobile-version /usr/share/nginx/html/mobile-version
COPY images /usr/share/nginx/html/images
COPY news /usr/share/nginx/html/news
COPY shared /usr/share/nginx/html/shared
COPY db-api /usr/share/nginx/html/db-api

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -q -O - http://127.0.0.1/ >/dev/null 2>&1 || exit 1
