# FODR DB API

A standalone, scalable football data API scaffold for FODR.

## Goals

- Support many competitions with one universal model.
- Keep league and cup logic data-driven.
- Organize code into controllers, models, routes, and services.
- Allow new competitions to be added by data, not code branches.
- Prepare for future extensions like player stats, transfers, live match views, and card-game integrations.

## Folder Structure

```text
/db-api
  /database
    /migrations
  /src
    /config
    /controllers
    /middleware
    /models
    /routes
    /services
    /utils
  /data
    /competitions
      /premier-league
      /la-liga
      /bundesliga
      /serie-a
      /ligue-1
      /champions-league
```

## Universal Competition Model

The API is built around one shared competition model.

- `type = league` supports round-robin standings and matchdays.
- `type = cup` supports group stages and knockout stages.
- `stage` values such as `league`, `group`, `round_of_16`, `quarter_final`, `semi_final`, and `final` are stored at match and standing level.
- `group_name` is optional and works for cups or special league phases.

## Planned REST Endpoints

- `GET /api/v1/health`
- `GET /api/v1/competitions`
- `GET /api/v1/competitions/:competitionId`
- `GET /api/v1/competitions/:competitionId/teams`
- `GET /api/v1/competitions/:competitionId/matches`
- `GET /api/v1/competitions/:competitionId/standings`

### Match Filters

- `stage`
- `teamId`
- `matchday`

### Standings Filters

- `stage`
- `group`

## Data Entry Flow

Each competition has its own folder under `data/competitions/`.

Inside each folder you will drop:

- `competition.json`
- `teams.json`
- `competition-teams.json`
- `matches.json`
- `standings.json`

That lets us keep the API universal while still separating source data per competition.

## Database Design

The SQL scaffold lives in `database/migrations/001_competitions_core.sql`.

Core tables:

- `competitions`
- `teams`
- `competition_teams`
- `matches`
- `standings`

This keeps the system normalized and ready for future joins with:

- players
- player stats
- transfers
- card-game performance hooks
