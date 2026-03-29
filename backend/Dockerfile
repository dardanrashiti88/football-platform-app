# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS deps
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production \
    PORT=3002 \
    FODR_DB_PATH=/data/fodr.sqlite

WORKDIR /app

RUN mkdir -p /data && chown -R node:node /data

COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --chown=node:node backend ./backend
COPY --chown=node:node frontend ./frontend
COPY --chown=node:node mobile-version ./mobile-version
COPY --chown=node:node db-api ./db-api
COPY --chown=node:node images ./images
COPY --chown=node:node news ./news
COPY --chown=node:node shared ./shared
COPY --chown=node:node index.html ./index.html

USER node

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3002/api/health').then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1));"]

CMD ["node", "backend/server.js"]
