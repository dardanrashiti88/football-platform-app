# Database Notes

This folder contains the normalized schema for the universal competition backend.

## Why this design works

- One `competitions` table supports every current and future competition.
- One `teams` table keeps team records reusable across domestic and continental competitions.
- `competition_teams` lets the same team appear in multiple competitions.
- `matches` uses flexible `stage` and optional `group_name` fields for both leagues and cups.
- `standings` supports domestic league tables and group-stage tables with the same structure.

## Future tables to add

- `players`
- `player_match_stats`
- `transfers`
- `card_performance_snapshots`
