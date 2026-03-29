# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS deps
WORKDIR /app/db-api

COPY db-api/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production \
    PORT=3010 \
    API_BASE_PATH=/api/v1

WORKDIR /app

COPY --from=deps /app/db-api/node_modules ./db-api/node_modules
COPY --chown=node:node db-api ./db-api

USER node

EXPOSE 3010

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3010/api/v1/health').then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1));"]

CMD ["node", "db-api/src/server.js"]
