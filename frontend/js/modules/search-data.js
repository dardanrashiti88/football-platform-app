import { getJson } from '../core/api.js';
import { COMPETITIONS } from './competition-catalog.js';

const TEAM_SOURCES = [
  { leagueKey: 'premier', label: 'Premier League', url: new URL('../../../db-api/data/competitions/premier-league/teams.json', import.meta.url) },
  { leagueKey: 'championship', label: 'EFL Championship', url: new URL('../../../db-api/data/competitions/championship/teams.json', import.meta.url) },
  { leagueKey: 'seriea', label: 'Serie A', url: new URL('../../../db-api/data/competitions/serie-a/teams.json', import.meta.url) },
  { leagueKey: 'laliga', label: 'LaLiga', url: new URL('../../../db-api/data/competitions/la-liga/teams.json', import.meta.url) },
  { leagueKey: 'bundesliga', label: 'Bundesliga', url: new URL('../../../db-api/data/competitions/bundesliga/teams.json', import.meta.url) },
  { leagueKey: 'ligue1', label: 'Ligue 1', url: new URL('../../../db-api/data/competitions/ligue-1/teams.json', import.meta.url) },
  { leagueKey: 'ucl', label: 'Champions League', url: new URL('../../../db-api/data/competitions/champions-league/teams.json', import.meta.url) }
];

const PLAYERSINFO_INDEX_URL = new URL('../../../db-api/playersinfo-index.json', import.meta.url);
const MOBILE_FIXTURES_URL = new URL('../../../mobile-version/data/fixtures.json', import.meta.url);

export const normalizeSearchText = (value = '') =>
  String(value).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const parseCsv = (text) => {
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const parts = line.split(',');
    if (parts.length > headers.length) {
      const fixed = parts.slice(0, headers.length - 1);
      fixed.push(parts.slice(headers.length - 1).join(','));
      parts.length = 0;
      parts.push(...fixed);
    }
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (parts[index] || '').trim();
    });
    return row;
  });
};

const fetchJsonFile = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
};

let teamsIndex = null;
let teamsByLeague = null;
let playersIndex = null;
let fixturesIndex = null;
let newsIndex = null;
let loadingTeams = null;
let loadingPlayers = null;
let loadingFixtures = null;
let loadingNews = null;

export const loadTeamsIndex = async () => {
  if (teamsIndex) return teamsIndex;
  if (!loadingTeams) {
    loadingTeams = Promise.all(
      TEAM_SOURCES.map(async (source) => {
        try {
          const data = await fetchJsonFile(source.url);
          return data.map((team) => ({
            leagueKey: source.leagueKey,
            leagueLabel: source.label,
            id: team.id,
            name: team.name || team.shortName || team.id,
            shortName: team.shortName || team.name || team.id
          }));
        } catch {
          return [];
        }
      })
    ).then((lists) => {
      teamsIndex = lists.flat();
      teamsByLeague = teamsIndex.reduce((acc, team) => {
        acc.set(`${team.leagueKey}:${team.id}`, team.name || team.shortName || team.id);
        return acc;
      }, new Map());
      return teamsIndex;
    });
  }
  return loadingTeams;
};

export const loadPlayersIndex = async () => {
  if (playersIndex) return playersIndex;
  if (!loadingPlayers) {
    loadingPlayers = (async () => {
      const index = await fetchJsonFile(PLAYERSINFO_INDEX_URL);
      await loadTeamsIndex();
      const entries = [];
      const tasks = [];
      Object.entries(index || {}).forEach(([leagueKey, teams]) => {
        Object.entries(teams || {}).forEach(([teamId, entry]) => {
          if (!entry?.csv) return;
          const csvUrl = new URL(entry.csv, PLAYERSINFO_INDEX_URL);
          tasks.push(
            fetch(csvUrl)
              .then((res) => (res.ok ? res.text() : ''))
              .then((text) => {
                if (!text) return;
                const rows = parseCsv(text);
                const teamName = teamsByLeague?.get(`${leagueKey}:${teamId}`) || teamId;
                rows.forEach((row) => {
                  const name = row['Player Name'] || row.Name || row.Player || '';
                  if (!name) return;
                  entries.push({
                    type: 'player',
                    name,
                    leagueKey,
                    leagueLabel: COMPETITIONS[leagueKey]?.label || leagueKey,
                    teamId,
                    teamName
                  });
                });
              })
              .catch(() => {})
          );
        });
      });
      await Promise.all(tasks);
      playersIndex = entries;
      return playersIndex;
    })();
  }
  return loadingPlayers;
};

export const loadFixturesIndex = async () => {
  if (fixturesIndex) return fixturesIndex;
  if (!loadingFixtures) {
    loadingFixtures = (async () => {
      const data = await fetchJsonFile(MOBILE_FIXTURES_URL);
      const entries = [];
      Object.entries(data || {}).forEach(([leagueKey, payload]) => {
        (payload?.fixtures || []).forEach((fixture) => {
          entries.push({
            type: 'fixture',
            id: fixture.id,
            leagueKey,
            leagueLabel: COMPETITIONS[leagueKey]?.label || leagueKey,
            label: `${fixture.home?.name || fixture.home?.short || 'Home'} vs ${fixture.away?.name || fixture.away?.short || 'Away'}`,
            homeName: fixture.home?.name || fixture.home?.short || 'Home',
            awayName: fixture.away?.name || fixture.away?.short || 'Away',
            meta: fixture.meta || fixture.score || payload?.labels?.left || 'Fixture',
            state: fixture.state || 'fixture'
          });
        });
      });
      fixturesIndex = entries;
      return fixturesIndex;
    })().catch(() => []);
  }
  return loadingFixtures;
};

export const loadNewsIndex = async () => {
  if (newsIndex) return newsIndex;
  if (!loadingNews) {
    loadingNews = getJson('/news')
      .then((data) => {
        newsIndex = Array.isArray(data?.articles) ? data.articles : [];
        return newsIndex;
      })
      .catch(() => {
        newsIndex = [];
        return newsIndex;
      });
  }
  return loadingNews;
};

export const getTeamOptions = async () => {
  const teams = await loadTeamsIndex();
  return teams
    .map((team) => ({ value: team.name, label: `${team.name} · ${team.leagueLabel}` }))
    .sort((left, right) => left.value.localeCompare(right.value));
};
