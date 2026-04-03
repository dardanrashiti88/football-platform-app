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

const normalizeKey = (value = '') => normalizeSearchText(value).replace(/[^a-z0-9]/g, '');

const PLAYER_NAME_DISPLAY_OVERRIDES = {
  alexisak: 'Alexander Isak'
};

const PHOTO_STRATEGY_OVERRIDES = {
  'premier:liverpool': 'name'
};

const getPlayerDisplayName = (name = '') => {
  const key = normalizeKey(name);
  return PLAYER_NAME_DISPLAY_OVERRIDES[key] || String(name || '').trim();
};

const getPhotoStrategy = (leagueKey, teamId, entry) =>
  entry?.photoStrategy || PHOTO_STRATEGY_OVERRIDES[`${leagueKey}:${teamId}`] || 'index';

const buildPhotoNameLookup = (photos = []) => {
  const lookup = new Map();
  photos.forEach((path) => {
    const filename = String(path || '').split('/').pop() || '';
    const base = filename.replace(/\.[^.]+$/, '');
    if (!base || /^[0-9]+$/.test(base)) return;
    lookup.set(normalizeKey(base), path);
  });
  return lookup;
};

const getNameParts = (name = '') => {
  const parts = normalizeSearchText(name).split(' ').filter(Boolean);
  return {
    first: parts[0] || '',
    last: parts[parts.length - 1] || ''
  };
};

const findPhotoBySubstring = (playerKey, lookup) => {
  if (!lookup) return null;
  let bestPath = null;
  let bestLen = 0;
  for (const [photoKey, path] of lookup.entries()) {
    if (!photoKey || photoKey.length < 4) continue;
    if (playerKey.includes(photoKey) || photoKey.includes(playerKey)) {
      if (photoKey.length > bestLen) {
        bestLen = photoKey.length;
        bestPath = path;
      }
    }
  }
  return bestPath;
};

const resolvePlayerPhoto = (playerName, entry, index, leagueKey, teamId, hints) => {
  const key = normalizeKey(playerName);
  const photos = entry?.photos || [];
  const lookup = hints?.photoLookup || buildPhotoNameLookup(photos);
  const strategy = getPhotoStrategy(leagueKey, teamId, entry);

  if (strategy === 'name') {
    const direct = lookup.get(key);
    if (direct) return direct;
  }

  if (strategy === 'none') return null;

  if (lookup && (strategy === 'name' || strategy === 'index')) {
    const { first, last } = getNameParts(playerName);
    const firstKey = normalizeKey(first);
    const lastKey = normalizeKey(last);
    if (lastKey && hints?.lastCounts?.get?.(lastKey) === 1 && lookup.get(lastKey)) {
      return lookup.get(lastKey);
    }
    if (firstKey && hints?.firstCounts?.get?.(firstKey) === 1 && lookup.get(firstKey)) {
      return lookup.get(firstKey);
    }
    const partial = findPhotoBySubstring(key, lookup);
    if (partial) return partial;
  }

  if (strategy === 'name') return null;
  return photos[index] || null;
};

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
                const photoLookup = buildPhotoNameLookup(entry?.photos || []);
                const firstCounts = new Map();
                const lastCounts = new Map();

                rows.forEach((row) => {
                  const rawName = row['Player Name'] || row.Name || row.Player || '';
                  if (!rawName) return;
                  const { first, last } = getNameParts(rawName);
                  const firstKey = normalizeKey(first);
                  const lastKey = normalizeKey(last);
                  if (firstKey) firstCounts.set(firstKey, (firstCounts.get(firstKey) || 0) + 1);
                  if (lastKey) lastCounts.set(lastKey, (lastCounts.get(lastKey) || 0) + 1);
                });

                const nameHints = { firstCounts, lastCounts, photoLookup };

                rows.forEach((row, indexInTeam) => {
                  const rawName = row['Player Name'] || row.Name || row.Player || '';
                  const name = getPlayerDisplayName(rawName);
                  if (!name) return;
                  entries.push({
                    type: 'player',
                    name,
                    leagueKey,
                    leagueLabel: COMPETITIONS[leagueKey]?.label || leagueKey,
                    teamId,
                    teamName,
                    photo: resolvePlayerPhoto(name, entry, indexInTeam, leagueKey, teamId, nameHints)
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
