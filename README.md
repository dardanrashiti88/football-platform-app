# FOD Football Project

FOD is a football web app with:

- a main desktop web app
- a separate mobile web version
- a backend for auth, account storage, and cardgame data
- a competition data API
- a marketing/dashboard view

This README is meant to help someone new understand the project fast and run it locally without needing VS Code `Go Live`.

**Preview**

![FOD app screenshot](./pictures/web-sc.png)

**Quick Start**

You do **not** need `Go Live` for this project. The normal way to run it is through the backend server.

**1. Install backend dependencies**

```bash
cd backend
npm install
cd ..
```

**2. Start the backend**

From the project root:

```bash
npm run dev:backend
```

Or from inside `backend/`:

```bash
npm start
```

**3. Open the app**

Desktop:

```text
http://localhost:3002/frontend/index.html
```

Mobile:

```text
http://localhost:3002/mobile
```

Root:

```text
http://localhost:3002/
```

**4. Run the healthcheck**

Filesystem check:

```bash
npm run healthcheck
```

Live check while backend and DB API are running:

```bash
npm run healthcheck:live
```

**Docker**

If you want the app in containers, this repo now includes:

- `frontend/Dockerfile`
- `backend/Dockerfile`
- `db-api/Dockerfile`
- `docker-compose.yml`

Start everything:

```bash
npm run docker:up
```

Or:

```bash
docker compose up --build
```

Open:

- frontend root: `http://localhost:8080`
- desktop: `http://localhost:8080/frontend/index.html`
- mobile: `http://localhost:8080/mobile`
- backend API: `http://localhost:3002/api/health`
- DB API health: `http://localhost:3010/api/v1/health`

The frontend container proxies `/api` to the backend container, so the browser can use the app from the frontend server cleanly.

**Monitoring**

Prometheus and Grafana are included for local monitoring.

Open:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`
- Alertmanager: `http://localhost:9093`
- Blackbox exporter: `http://localhost:9115`

Grafana default login:

- user: `fod-monitor`
- password: `FodMonitor2026!`

You can override Grafana credentials with a root `.env` file:

```bash
cp .env.example .env
```

Then change:

```text
GRAFANA_USER=your-user
GRAFANA_PASSWORD=your-password
```

Metrics endpoints:

- backend: `http://localhost:3002/metrics`
- db-api: `http://localhost:3010/metrics`

A starter Grafana dashboard is provisioned automatically:

- `FOD Overview`

Crash / availability alerts are also wired now:

- frontend down
- backend down
- db-api down
- backend high memory

Email / secret values should **not** live in Git.

Keep them in a local `.env`, server env vars, or secret manager.

To make email alerts actually send, create a root `.env` file:

```bash
cp .env.example .env
```

Then update at least:

```text
SMTP_SMARTHOST=smtp.your-provider.com:587
SMTP_FROM=alerts@your-domain.com
SMTP_AUTH_USERNAME=alerts@your-domain.com
SMTP_AUTH_PASSWORD=your-real-smtp-password
ALERT_EMAIL_TO=you@example.com
```

Alerting code/config belongs in the repo here:

- `monitoring/prometheus/`
- `monitoring/alertmanager/`
- `monitoring/grafana/`
- `monitoring/blackbox/`

Secrets do not belong in Git.

If Grafana was already started before changing credentials, recreate the Grafana container and volume so the new login applies:

```bash
docker compose down
docker volume rm football-project_grafana-data
docker compose up -d --build
```

Stop everything:

```bash
npm run docker:down
```

**Terraform Infra**

A Terraform infrastructure layer now lives in `infra/terraform/` for managing the current Docker-based stack as code.

Quick start:

```bash
cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
npm run infra:init
npm run infra:plan
npm run infra:apply
```

Important:

- this Terraform setup manages the local Docker stack you already use
- for HCP Terraform, use CLI-driven runs or an HCP agent on the Docker host
- standard HCP remote runners cannot manage your local Docker daemon

**Backups**

This project now includes backup and restore scripts for the data that actually matters:

- backend SQLite database
- root `.env` if you use one
- local Kubernetes secret env files
- Docker volumes for:
  - `fod-backend-data`
  - `prometheus-data`
  - `grafana-data`
  - `alertmanager-data`

Create a backup:

```bash
npm run backup:create
```

Modes:

```bash
npm run backup:create -- local
npm run backup:create -- docker
```

Restore from a backup folder:

```bash
npm run backup:restore -- backups/20260331-160000
```

Use these before:

- wiping Docker volumes
- resetting local data
- risky infra changes
- cluster rebuilds where you want to keep monitoring/app data

**Kubernetes**

Kubernetes manifests now live in `k8s/` with a full `kustomize` layout:

- `k8s/base/`
- `k8s/overlays/local/`
- `k8s/overlays/production/`

Kubernetes secrets are now handled outside Git.

Start with:

```bash
npm run k8s:init-secrets -- local
```

Fill in:

- `k8s/secrets/local/grafana.env`
- `k8s/secrets/local/alertmanager.env`

Then apply them:

```bash
npm run k8s:apply-secrets -- local
```

For CI/CD later, keep deployment credentials in GitHub Actions secrets, not in workflow files.

If you do not want email alerts locally yet, keep this in `k8s/secrets/local/alertmanager.env`:

```text
ENABLE_EMAIL_ALERTS=false
```

That lets Alertmanager run without requiring SMTP values.

The Kubernetes setup includes:

- app Deployments and Services for `frontend`, `backend`, and `db-api`
- monitoring Deployments and Services for `Prometheus`, `Grafana`, `Alertmanager`, and `blackbox-exporter`
- PVCs for backend SQLite, Prometheus, Grafana, and Alertmanager
- Ingress resources
- HPAs for stateless services
- PodDisruptionBudgets

Render the manifests:

```bash
kubectl kustomize k8s/base
```

Apply the local overlay:

```bash
kubectl apply -k k8s/overlays/local
```

Useful scripts:

```bash
npm run k8s:build-images
npm run k8s:apply -- local
npm run k8s:healthcheck
npm run argocd:bootstrap -- local
```

Argo CD manifests live in:

- `k8s/argocd/base/`
- `k8s/argocd/overlays/local/`
- `k8s/argocd/overlays/production/`

**Project Structure**

```text
football-project/
├── frontend/                     Desktop app
├── mobile-version/               Mobile app
├── backend/                      Main backend server + SQLite auth/storage
├── db-api/                       Football data API and static data
│   ├── data/competitions/        Main structured competition JSON data
│   ├── history-data/             Table history data for leagues and cups
│   ├── comps-teamplayers-info/   Team player CSV files by competition
│   ├── database/                 DB API database docs/migrations
│   └── src/                      DB API source code
├── Dashboard-view/               Separate dashboard frontend
├── images/                       Logos, photos, trophies, flags, assets
├── news/                         News article text and images
├── pictures/                     README screenshots
├── scripts/                      Utility scripts
├── shared/                       Shared config/data
└── README.md
```

**Main Parts**

1. `frontend/`
Desktop version of the app.

2. `mobile-version/`
Mobile version of the app, built as a separate UI flow for phone-sized screens.

3. `backend/`
Express backend used for:
- login / register
- saved account data
- cardgame inventory and storage
- serving the frontend, mobile app, images, news, and data files on the backend port

4. `db-api/`
Football data layer:
- competition data
- history tables
- team player CSV files
- data API service

5. `Dashboard-view/`
Separate Vite dashboard app.

6. `images/`
Project images:
- team logos
- player photos
- trophies
- flags
- wallpapers
- assets

7. `shared/`
Shared app data, for example card prices.

**Important Data Folders**

`db-api/history-data/`
- league and cup history CSV files
- used for standings history, fixtures, and season switching

Examples:
- `db-api/history-data/premier-league-table-history/`
- `db-api/history-data/laliga-table-history/`
- `db-api/history-data/champions-league-table-history/`

`db-api/comps-teamplayers-info/`
- team player CSVs grouped by competition
- used for squad pages, player stats, and lineup-style views

Examples:
- `db-api/comps-teamplayers-info/premier-league/liverpool.csv`
- `db-api/comps-teamplayers-info/serie-A/inter.csv`
- `db-api/comps-teamplayers-info/bundesliga/bayern.csv`

`images/players-photos/`
- player photos used in squad pages, lineups, and team views

`db-api/playersinfo-index.json`
- connects teams to:
- CSV files
- player photo folders / photo paths
- special photo matching rules

**How The App Runs**

The backend serves the main app and important static files, including:

- `/frontend`
- `/mobile-version`
- `/images`
- `/news`
- `/db-api`
- `/playersinfo`
- `/comps-teamplayers-info`

So for normal testing, run the backend and open the app through `localhost:3002`.

**Root Scripts**

From the project root:

```bash
npm run dev
```

Starts:
- backend
- dashboard

Other useful scripts:

```bash
npm run dev:dashboard
npm run build:dashboard
npm run dev:db-api
```

**Workflow Structure**

The repo now keeps CI/CD separated in two places:

- `.github/workflows/`
  - real GitHub Actions entrypoints
- `workflows/`
  - grouped helper scripts and notes for:
    - `testing/`
    - `security/`
    - `kubernetes/`
    - `staging/`
    - `production/`

Current flow:

1. `Testing`
   - runs on pushes and pull requests
   - installs dependencies
   - runs `npm run healthcheck`
   - builds the dashboard

2. `Security`
   - runs on manual trigger and a daily schedule
   - reruns baseline testing checks
   - runs dependency audits for backend, db-api, and dashboard
   - runs CodeQL analysis
   - scheduled to execute at `06:00 Europe/Tirane` using a DST-safe gate

3. `Staging`
   - runs only when triggered manually
   - starts backend + DB API
   - runs `npm run healthcheck:live`
   - checks register/login smoke flow

4. `Kubernetes`
   - runs on manual trigger and a daily schedule
   - validates rendered Kubernetes manifests
   - creates a throwaway `kind` cluster
   - builds and loads the app images
   - applies the local overlay and runs `npm run k8s:healthcheck`
   - scheduled to execute at `06:00 Europe/Tirane` using a DST-safe gate

5. `Production`
   - manual only
   - reruns testing + staging checks
   - validates and builds Docker images before release

**Extra Services**

`Dashboard-view/`
- Vite app
- default port: `3000`

`db-api/`
- competition data API
- default port: `3010`
- base path: `/api/v1`

**Backend Storage**

The backend uses SQLite for account/cardgame storage.

Main backend database code:
- `backend/database/db.js`

Example custom start:

```bash
PORT=3003 FODR_DB_PATH=/tmp/fodr.sqlite npm --prefix backend start
```

**Useful Files**

- `backend/server.js`
Main backend server.

- `frontend/js/app.js`
Desktop app entry logic.

- `mobile-version/js/app.js`
Mobile app entry logic.

- `frontend/js/modules/players.js`
Players, squads, team profiles, photo mapping.

- `frontend/js/modules/leagues.js`
League tables and season/history logic.

- `frontend/js/modules/home.js`
Home screen, fixtures, match views, lineups.

- `frontend/js/modules/news.js`
Desktop news feed and article loading.

- `db-api/playersinfo-index.json`
Links teams to squad CSVs and player photo data.

**Notes For Contributors**

- Use the backend route for normal testing, because it serves the frontend and static assets together.
- A lot of player-photo behavior depends on `db-api/playersinfo-index.json`.
- History/season data lives under `db-api/history-data/`.
- Team player CSV data lives under `db-api/comps-teamplayers-info/`.
- Mobile and desktop are separate UIs, so changes often need to be checked in both.

**Recommended Start For New Contributors**

1. Run the backend.
2. Open the desktop app on `http://localhost:3002/frontend/index.html`.
3. Open the mobile app on `http://localhost:3002/mobile`.
4. If you are working on standings or fixtures, check `db-api/history-data/`.
5. If you are working on squads or player photos, check:
   - `db-api/comps-teamplayers-info/`
   - `db-api/playersinfo-index.json`
   - `images/players-photos/`

**Current Goal Of This Repo**

The project is set up as a football platform with:

- league pages
- fixtures
- tables
- squad/team pages
- match views
- stats
- quiz
- cardgame
- news
- profile/account system
- mobile and desktop experiences
