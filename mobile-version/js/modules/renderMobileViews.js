import {
  buildStandingsFromMatches,
  buildTeamsByAlias,
  buildWorldcupFlagMarkup,
  getLogoSrc,
  parseSeasonFixturesCsv,
  parseWorldcupGroupsCsv,
  slugifyTeamId
} from '../../../frontend/js/modules/leagues.js';

const PREMIER_STANDINGS_URL = new URL('../../../db-api/data/competitions/premier-league/standings.json', import.meta.url);
const PREMIER_TEAMS_URL = new URL('../../../db-api/data/competitions/premier-league/teams.json', import.meta.url);
const PREMIER_HISTORY_BASE_URL = new URL('../../../db-api/history-data/premier-league-table-history/', import.meta.url);
const CHAMPIONSHIP_HISTORY_BASE_URL = new URL('../../../db-api/history-data/ELFchampionship-league-table-history/', import.meta.url);
const BUNDESLIGA_STANDINGS_URL = new URL('../../../db-api/data/competitions/bundesliga/standings.json', import.meta.url);
const BUNDESLIGA_TEAMS_URL = new URL('../../../db-api/data/competitions/bundesliga/teams.json', import.meta.url);
const BUNDESLIGA_HISTORY_BASE_URL = new URL('../../../db-api/history-data/bundesliga-table-history/', import.meta.url);
const SERIEA_STANDINGS_URL = new URL('../../../db-api/data/competitions/serie-a/standings.json', import.meta.url);
const SERIEA_TEAMS_URL = new URL('../../../db-api/data/competitions/serie-a/teams.json', import.meta.url);
const SERIEA_HISTORY_BASE_URL = new URL('../../../db-api/history-data/serieA-table-history/', import.meta.url);
const LALIGA_STANDINGS_URL = new URL('../../../db-api/data/competitions/la-liga/standings.json', import.meta.url);
const LALIGA_TEAMS_URL = new URL('../../../db-api/data/competitions/la-liga/teams.json', import.meta.url);
const LALIGA_HISTORY_BASE_URL = new URL('../../../db-api/history-data/laliga-table-history/', import.meta.url);
const LIGUE1_STANDINGS_URL = new URL('../../../db-api/data/competitions/ligue-1/standings.json', import.meta.url);
const LIGUE1_TEAMS_URL = new URL('../../../db-api/data/competitions/ligue-1/teams.json', import.meta.url);
const LIGUE1_HISTORY_BASE_URL = new URL('../../../db-api/history-data/ligue1-table-history/', import.meta.url);
const UCL_STANDINGS_URL = new URL('../../../db-api/data/competitions/champions-league/standings.json', import.meta.url);
const UCL_TEAMS_URL = new URL('../../../db-api/data/competitions/champions-league/teams.json', import.meta.url);
const UCL_HISTORY_BASE_URL = new URL('../../../db-api/history-data/champions-league-table-history/', import.meta.url);
const EUROPA_HISTORY_BASE_URL = new URL('../../../db-api/history-data/europa-league-table-history/', import.meta.url);
const CONFERENCE_HISTORY_BASE_URL = new URL('../../../db-api/history-data/conference-league-table-history/', import.meta.url);
const WORLDCUP_HISTORY_BASE_URL = new URL('../../../db-api/history-data/worldcup-table-history/', import.meta.url);
const PREMIER_PLAYER_STATS_URL = new URL('../../../db-api/data/competitions/premier-league/player-stats.json', import.meta.url);
const PREMIER_TEAM_STATS_URL = new URL('../../../db-api/data/competitions/premier-league/team-stats.json', import.meta.url);
const SERIEA_TEAM_STATS_URL = new URL('../../../db-api/data/competitions/serie-a/team-stats.json', import.meta.url);
const LALIGA_TEAM_STATS_URL = new URL('../../../db-api/data/competitions/la-liga/team-stats.json', import.meta.url);
const BUNDESLIGA_TEAM_STATS_URL = new URL('../../../db-api/data/competitions/bundesliga/team-stats.json', import.meta.url);
const LIGUE1_TEAM_STATS_URL = new URL('../../../db-api/data/competitions/ligue-1/team-stats.json', import.meta.url);

const leagueTableCache = new Map();
const LEAGUE_STORAGE_KEY = 'fod-mobile-league-table';
const LEAGUE_SEASON_STORAGE_PREFIX = 'fod-mobile-league-season';
const AUTH_USER_STORAGE_KEY = 'fodrUser';
const PROFILE_IMAGE_STORAGE_PREFIX = 'fodrProfileImage:';
const MOBILE_SETTINGS_STORAGE_KEY = 'fod-mobile-settings';

const BASE_SEASON_OPTIONS = (() => {
  const options = [{ value: 'live', label: '2025/26 (Live)', kind: 'live', startYear: 2025 }];
  for (let startYear = 2024; startYear >= 1993; startYear -= 1) {
    const endYear = startYear + 1;
    const code = `${String(startYear).slice(-2).padStart(2, '0')}${String(endYear).slice(-2).padStart(2, '0')}`;
    options.push({
      value: code,
      label: `${startYear}/${String(endYear).slice(-2).padStart(2, '0')}`,
      kind: 'history',
      startYear
    });
  }
  return options;
})();

const WORLDCUP_SEASON_OPTIONS = [2026, 2022, 2018, 2014, 2010, 2006, 2002].map((year) => ({
  value: String(year),
  label: String(year),
  kind: 'worldcup',
  startYear: year
}));

const playerTeamsCache = new Map();
const playerColorCache = new Map();
const mobileStatsCache = new Map();
const PLAYER_LEAGUE_STORAGE_KEY = 'fod-mobile-player-league';
const MOBILE_STATS_LEAGUE_STORAGE_KEY = 'fod-mobile-stats-league';
const MOBILE_STATS_SCOPE_STORAGE_KEY = 'fod-mobile-stats-scope';
const PLAYER_TEAM_PRIMARY_COLORS = {
  premier: {
    'afc-bournemouth': '#7a0b12',
    arsenal: '#b0001a',
    'aston-villa': '#6b1f3b',
    brentford: '#b10d1a',
    'brighton-and-hove-albion': '#0a4aa8',
    burnley: '#6b1e26',
    chelsea: '#0038a8',
    'crystal-palace': '#2d4f8b',
    everton: '#003c88',
    fulham: '#1d1d1d',
    'leeds-united': '#1b1b1b',
    liverpool: '#b0001a',
    'manchester-city': '#2b6d99',
    'manchester-united': '#a40016',
    'newcastle-united': '#202020',
    'nottingham-forest': '#8b1010',
    sunderland: '#a10e1a',
    'tottenham-hotspur': '#1d2d4a',
    'west-ham-united': '#4f1d2d',
    'wolverhampton-wanderers': '#b47b1f'
  }
};

const PLAYER_TEAM_COLOR_PAIRS = {
  premier: {
    'afc-bournemouth': ['#7a0b12', '#111111'],
    arsenal: ['#b0001a', '#f2f2f2'],
    'aston-villa': ['#6b1f3b', '#8bc1e8'],
    brentford: ['#b10d1a', '#f2f2f2'],
    'brighton-and-hove-albion': ['#0a4aa8', '#f2b705'],
    burnley: ['#6b1e26', '#8bc1e8'],
    chelsea: ['#0038a8', '#f2f2f2'],
    'crystal-palace': ['#2d4f8b', '#b0001a'],
    everton: ['#003c88', '#f2f2f2'],
    fulham: ['#101010', '#f2f2f2'],
    'leeds-united': ['#0a4aa8', '#f2b705'],
    liverpool: ['#b0001a', '#f2f2f2'],
    'manchester-city': ['#2b6d99', '#f2f2f2'],
    'manchester-united': ['#a40016', '#111111'],
    'newcastle-united': ['#111111', '#f2f2f2'],
    'nottingham-forest': ['#8b1010', '#f2f2f2'],
    sunderland: ['#a10e1a', '#f2f2f2'],
    'tottenham-hotspur': ['#1d2d4a', '#f2f2f2'],
    'west-ham-united': ['#4f1d2d', '#8bc1e8'],
    'wolverhampton-wanderers': ['#b47b1f', '#111111']
  }
};

const LEAGUE_VIEW_CONFIGS = {
  premier: {
    kind: 'table',
    competitionId: 'premier-league-2025-2026',
    subtitle: '2025/26 live table',
    standingsUrl: PREMIER_STANDINGS_URL,
    teamsUrl: PREMIER_TEAMS_URL,
    historyBaseUrl: PREMIER_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => (code === '2425' ? 'filtered_data 2425.csv' : `season-${code}.csv`),
    pointsForWin: () => 3
  },
  championship: {
    kind: 'history-table',
    competitionId: 'efl-championship-2025-2026',
    subtitle: '2025/26 table from played fixtures',
    historyBaseUrl: CHAMPIONSHIP_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => `${code}.csv`,
    seasonOptions: (options) =>
      (options || []).filter((option) => option?.value === 'live' || (option?.kind === 'history' && option.startYear >= 2003)),
    pointsForWin: () => 3
  },
  facup: {
    kind: 'message',
    subtitle: 'Knockout cup',
    message: 'FA Cup uses rounds and fixtures, so there is no league table here.'
  },
  carabaocup: {
    kind: 'message',
    subtitle: 'Knockout cup',
    message: 'Carabao Cup uses rounds and fixtures, so there is no league table here.'
  },
  seriea: {
    kind: 'table',
    competitionId: 'serie-a-2025-2026',
    subtitle: '2025/26 live table',
    standingsUrl: SERIEA_STANDINGS_URL,
    teamsUrl: SERIEA_TEAMS_URL,
    historyBaseUrl: SERIEA_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => `season-${code}.csv`,
    pointsForWin: (startYear) => (Number(startYear) >= 1994 ? 3 : 2)
  },
  laliga: {
    kind: 'table',
    competitionId: 'la-liga-2025-2026',
    subtitle: '2025/26 live table',
    standingsUrl: LALIGA_STANDINGS_URL,
    teamsUrl: LALIGA_TEAMS_URL,
    historyBaseUrl: LALIGA_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => `season-${code}.csv`,
    pointsForWin: (startYear) => (Number(startYear) >= 1995 ? 3 : 2),
    aliases: { Sociedad: 'real-sociedad', 'Ath Madrid': 'atl-madrid' }
  },
  bundesliga: {
    kind: 'table',
    competitionId: 'bundesliga-2025-2026',
    subtitle: '2025/26 live table',
    standingsUrl: BUNDESLIGA_STANDINGS_URL,
    teamsUrl: BUNDESLIGA_TEAMS_URL,
    historyBaseUrl: BUNDESLIGA_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => `season-${code}.csv`,
    pointsForWin: (startYear) => (Number(startYear) >= 1995 ? 3 : 2),
    aliases: { "M'gladbach": 'b-monchengladbach' }
  },
  ligue1: {
    kind: 'table',
    competitionId: 'ligue-1-2025-2026',
    subtitle: '2025/26 live table',
    standingsUrl: LIGUE1_STANDINGS_URL,
    teamsUrl: LIGUE1_TEAMS_URL,
    historyBaseUrl: LIGUE1_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => `season-${code}.csv`,
    pointsForWin: (startYear) => (Number(startYear) >= 1994 ? 3 : 2),
    aliases: { 'Paris SG': 'psg' }
  },
  ucl: {
    kind: 'table',
    competitionId: 'champions-league-2025-2026',
    subtitle: 'League stage table',
    standingsUrl: UCL_STANDINGS_URL,
    teamsUrl: UCL_TEAMS_URL,
    historyBaseUrl: UCL_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => `season-${code}.csv`,
    seasonOptions: (options) =>
      (options || []).filter((option) => option?.value === 'live' || option?.value === '2425' || option?.value === '2324'),
    pointsForWin: () => 3,
    filterMatches: (matches, { option }) => {
      const startYear = option?.startYear;
      const stage = Number(startYear) >= 2024 ? 'league stage' : 'group stage';
      return (matches || []).filter((match) => String(match?.round || '').trim().toLowerCase() === stage);
    }
  },
  europa: {
    kind: 'history-table',
    competitionId: 'europa-league-2025-2026',
    subtitle: 'League stage table',
    historyBaseUrl: EUROPA_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => `season-${code}.csv`,
    seasonOptions: (options) =>
      (options || []).filter(
        (option) => option?.value === 'live' || option?.value === '2425' || option?.value === '2324'
      ),
    pointsForWin: () => 3,
    filterMatches: (matches, { option }) => {
      const startYear = option?.startYear;
      const stage = Number(startYear) >= 2024 ? 'league stage' : 'group stage';
      return (matches || []).filter((match) => String(match?.round || '').trim().toLowerCase() === stage);
    }
  },
  conference: {
    kind: 'history-table',
    competitionId: 'conference-league-2025-2026',
    subtitle: 'League stage table',
    historyBaseUrl: CONFERENCE_HISTORY_BASE_URL,
    currentSeasonCode: '2526',
    fileForSeason: (code) => `season-${code}.csv`,
    seasonOptions: (options) =>
      (options || []).filter(
        (option) => option?.value === 'live' || option?.value === '2425' || option?.value === '2324'
      ),
    pointsForWin: () => 3,
    filterMatches: (matches, { option }) => {
      const startYear = option?.startYear;
      const stage = Number(startYear) >= 2024 ? 'league stage' : 'group stage';
      return (matches || []).filter((match) => String(match?.round || '').trim().toLowerCase() === stage);
    }
  },
  worldcup: {
    kind: 'groups',
    subtitle: '2026 group stage',
    historyBaseUrl: WORLDCUP_HISTORY_BASE_URL,
    seasonOptions: () => WORLDCUP_SEASON_OPTIONS
  }
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const searchIcon = `
  <svg class="mobile-search-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="6"></circle>
    <line x1="16.5" y1="16.5" x2="21" y2="21"></line>
  </svg>
`;

const renderSearchPill = (placeholder) => `
  <div class="mobile-search-pill-desktop">
    ${searchIcon}
    <input type="text" placeholder="${escapeHtml(placeholder)}" />
  </div>
`;

const safeStorageGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures in private mode etc.
  }
};

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredProfileImage = (user) => {
  if (!user?.username) return null;
  return safeStorageGet(`${PROFILE_IMAGE_STORAGE_PREFIX}${user.username}`);
};

const getUserInitials = (user) => String(user?.username || 'FD').slice(0, 2).toUpperCase();

const loadMobileSettings = () => {
  try {
    const raw = safeStorageGet(MOBILE_SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveMobileSettings = (settings) => {
  safeStorageSet(MOBILE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

const getSeasonStorageKey = (leagueId) => `${LEAGUE_SEASON_STORAGE_PREFIX}-${String(leagueId || 'league')}`;

const getSeasonOptionsForLeague = (leagueId) => {
  const config = LEAGUE_VIEW_CONFIGS[leagueId];
  if (!config) return [];
  if (typeof config.seasonOptions === 'function') {
    const customOptions = config.seasonOptions(BASE_SEASON_OPTIONS);
    return Array.isArray(customOptions) && customOptions.length ? customOptions : [];
  }
  if (config.kind === 'message') {
    return [{ value: 'current', label: 'Current', kind: 'message', startYear: 2025 }];
  }
  return BASE_SEASON_OPTIONS;
};

const getDefaultSeasonValue = (leagueId) => {
  const options = getSeasonOptionsForLeague(leagueId);
  const stored = safeStorageGet(getSeasonStorageKey(leagueId));
  if (stored && options.some((option) => option.value === stored)) return stored;
  return options[0]?.value || 'live';
};

const parsePlayedScore = (score) => {
  const match = String(score || '').match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return {
    home: Number.parseInt(match[1], 10),
    away: Number.parseInt(match[2], 10)
  };
};

const getThemeAccent = (themeClass = '') => {
  const map = {
    premier: 'var(--premier)',
    championship: 'var(--championship)',
    facup: 'var(--facup)',
    carabaocup: 'var(--carabaocup)',
    seriea: 'var(--seriea)',
    laliga: 'var(--laliga)',
    bundesliga: 'var(--bundesliga)',
    ligue1: 'var(--ligue1)',
    ucl: 'var(--ucl)',
    europa: 'var(--europa)',
    conference: 'var(--conference)',
    worldcup: 'var(--worldcup)'
  };
  return map[themeClass] || 'var(--home-blue)';
};

const buildCompetitionSummary = (competition) => {
  const fixtures = competition.fixtures || [];
  const played = fixtures.filter((fixture) => fixture.state === 'played');
  const upcoming = fixtures.filter((fixture) => fixture.state !== 'played');
  const goals = played.reduce((sum, fixture) => {
    const parsed = parsePlayedScore(fixture.score);
    return sum + (parsed ? parsed.home + parsed.away : 0);
  }, 0);
  const uniqueTeams = new Map();
  fixtures.forEach((fixture) => {
    [fixture.home, fixture.away].forEach((team) => {
      if (!team?.name) return;
      if (!uniqueTeams.has(team.name)) uniqueTeams.set(team.name, team);
    });
  });
  const topGame = played
    .map((fixture) => {
      const parsed = parsePlayedScore(fixture.score);
      return parsed
        ? {
            label: `${fixture.home.short} ${fixture.score} ${fixture.away.short}`,
            total: parsed.home + parsed.away
          }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.total - a.total)[0];

  return { played, upcoming, goals, teams: [...uniqueTeams.values()], topGame };
};

const renderHeader = (title, subtitle) => `
  <div class="mobile-view-header">
    <div class="mobile-view-title">${escapeHtml(title)}</div>
    <div class="mobile-view-subtitle">${escapeHtml(subtitle)}</div>
  </div>
`;

const renderLeagueButton = (competition, active = false) => `
  <button class="mobile-stats-league${active ? ' is-active' : ''}" type="button" style="--league-accent:${getThemeAccent(
    competition.themeClass
  )};">
    <span class="mobile-stats-league__logo">
      <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
    </span>
    <span>${escapeHtml(competition.title)}</span>
  </button>
`;

const renderStatCard = (title, rows) => `
  <div class="mobile-stats-card">
    <div class="mobile-stats-card__title">${escapeHtml(title)}</div>
    <div class="mobile-stats-card__body">
      ${rows
        .map(
          (row) => `
            <div class="mobile-stat-line">
              <div class="mobile-stat-line__label">${escapeHtml(row.label)}</div>
              <div class="mobile-stat-line__value">${escapeHtml(row.value)}</div>
            </div>
          `
        )
        .join('')}
    </div>
  </div>
`;

const MOBILE_PLAYER_STAT_CARDS = [
  { key: 'goals', title: 'Goals' },
  { key: 'assists', title: 'Assists' },
  { key: 'expectedGoals', title: 'Expected goals', format: (value) => formatDecimal(value) },
  { key: 'cleanSheets', title: 'Clean sheets' },
  { key: 'yellowCards', title: 'Yellow cards' },
  { key: 'redCards', title: 'Red cards' },
  { key: 'duelsWon', title: 'Duels won' },
  { key: 'minutesPlayed', title: 'Minutes played' }
];

const MOBILE_TEAM_STAT_CARDS = [
  { key: 'goals', title: 'Goals' },
  { key: 'assists', title: 'Assists' },
  { key: 'expectedGoals', title: 'Expected goals', format: (value) => formatDecimal(value) },
  { key: 'cleanSheets', title: 'Clean sheets' },
  { key: 'yellowCards', title: 'Yellow cards' },
  { key: 'redCards', title: 'Red cards' },
  { key: 'possession', title: 'Possession', format: (value) => formatPercentage(value) },
  { key: 'successfulShortPasses', title: 'Successful short passes' },
  { key: 'successfulLongPasses', title: 'Successful long passes' },
  { key: 'cornersTaken', title: 'Corners taken' },
  { key: 'totalShots', title: 'Total shots' },
  { key: 'hitWoodwork', title: 'Hit woodwork' },
  { key: 'offsides', title: 'Offsides' },
  { key: 'interceptions', title: 'Interceptions' },
  { key: 'duelsWon', title: 'Duels won' },
  { key: 'blocks', title: 'Blocks' },
  { key: 'clearances', title: 'Clearances' },
  { key: 'totalPasses', title: 'Total passes' },
  { key: 'foulsPerGame', title: 'Fouls per game', format: (value) => formatDecimal(value) },
  { key: 'turnoversPerGame', title: 'Turnovers per game', format: (value) => formatDecimal(value) },
  { key: 'penaltiesWon', title: 'Penalties won' },
  { key: 'minutesPlayed', title: 'Minutes played' }
];

const MOBILE_STATS_CONFIGS = {
  premier: {
    competitionId: 'premier-league-2025-2026',
    playerStatsUrl: PREMIER_PLAYER_STATS_URL,
    teamStatsUrl: PREMIER_TEAM_STATS_URL
  },
  championship: {
    competitionId: 'efl-championship-2025-2026'
  },
  facup: {
    competitionId: 'fa-cup-2025-2026'
  },
  carabaocup: {
    competitionId: 'carabao-cup-2025-2026'
  },
  seriea: {
    competitionId: 'serie-a-2025-2026',
    teamStatsUrl: SERIEA_TEAM_STATS_URL
  },
  laliga: {
    competitionId: 'la-liga-2025-2026',
    teamStatsUrl: LALIGA_TEAM_STATS_URL
  },
  bundesliga: {
    competitionId: 'bundesliga-2025-2026',
    teamStatsUrl: BUNDESLIGA_TEAM_STATS_URL
  },
  ligue1: {
    competitionId: 'ligue-1-2025-2026',
    teamStatsUrl: LIGUE1_TEAM_STATS_URL
  },
  ucl: {
    competitionId: 'champions-league-2025-2026'
  },
  europa: {
    competitionId: 'europa-league-2025-2026'
  },
  conference: {
    competitionId: 'conference-league-2025-2026'
  },
  worldcup: {
    competitionId: 'world-cup-2026'
  }
};

const normalizeStatsString = (value = '') =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const formatDecimal = (value) => {
  if (typeof value !== 'number') return value;
  const formatted = value.toFixed(2);
  return formatted.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
};

const formatPercentage = (value) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${formatDecimal(value)}%`;
  return value;
};

const getStatsNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const getStatsCardsForScope = (scope) => (scope === 'teams' ? MOBILE_TEAM_STAT_CARDS : MOBILE_PLAYER_STAT_CARDS);

const getMobileStatsUrl = (leagueId, scope) => {
  const config = MOBILE_STATS_CONFIGS[leagueId];
  return scope === 'teams' ? config?.teamStatsUrl : config?.playerStatsUrl;
};

const getStatsLineLogo = (leagueId, teamId) => {
  const competitionId = MOBILE_STATS_CONFIGS[leagueId]?.competitionId;
  if (!competitionId || !teamId) return '';
  return getLogoSrc(competitionId, teamId) || '';
};

const renderMobileStatsLeagueButton = (competition, active = false) => `
  <button
    class="mobile-stats-league${active ? ' is-active' : ''}"
    type="button"
    data-stats-league="${competition.id}"
    style="--league-accent:${getThemeAccent(competition.themeClass)};"
  >
    <span class="mobile-stats-league__logo">
      <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
    </span>
    <span>${escapeHtml(competition.title)}</span>
  </button>
`;

const renderMobileStatLine = (entry, card, scope, leagueId) => {
  if (!entry) {
    return `
      <div class="mobile-stat-line is-empty">
        <div class="mobile-stat-line__label">
          <span>Data coming soon</span>
        </div>
        <div class="mobile-stat-line__value">—</div>
      </div>
    `;
  }

  const label = scope === 'teams' ? entry.teamName || 'Team' : entry.playerName || 'Unknown';
  const teamName = entry.teamName || 'Team';
  const logoUrl = getStatsLineLogo(leagueId, entry.teamId);
  const rawValue = entry[card.key] ?? 0;
  const displayValue = card.format ? card.format(rawValue) : rawValue;

  return `
    <div class="mobile-stat-line">
      <div class="mobile-stat-line__label">
        ${
          logoUrl
            ? `<span class="mobile-stat-line__logo"><img src="${logoUrl}" alt="${escapeHtml(teamName)}" /></span>`
            : ''
        }
        <span>${escapeHtml(label)}</span>
      </div>
      <div class="mobile-stat-line__value">${escapeHtml(displayValue)}</div>
    </div>
  `;
};

const buildMobileStatsCardMarkup = (stats, card, scope, leagueId, searchTerm = '') => {
  const filtered = searchTerm
    ? stats.filter((entry) =>
        normalizeStatsString(scope === 'teams' ? entry.teamName : entry.playerName).includes(searchTerm)
      )
    : stats;

  const rows = filtered
    .filter((entry) => {
      const value = entry?.[card.key];
      if (value == null) return false;
      if (typeof value === 'string') return value.trim() !== '' && value.trim() !== '0' && value.trim() !== '0%';
      return getStatsNumber(value) > 0;
    })
    .sort((left, right) => {
      const orderKey = `${card.key}Order`;
      const rankKey = `${card.key}Rank`;
      const leftOrder = left?.[orderKey] ?? left?.[rankKey];
      const rightOrder = right?.[orderKey] ?? right?.[rankKey];
      if (leftOrder != null && rightOrder != null) return Number(leftOrder) - Number(rightOrder);
      if (leftOrder != null) return -1;
      if (rightOrder != null) return 1;
      const diff = getStatsNumber(right?.[card.key]) - getStatsNumber(left?.[card.key]);
      if (diff !== 0) return diff;
      const leftLabel = scope === 'teams' ? left?.teamName || '' : left?.playerName || '';
      const rightLabel = scope === 'teams' ? right?.teamName || '' : right?.playerName || '';
      return leftLabel.localeCompare(rightLabel);
    })
    .slice(0, 3);

  return `
    <div class="mobile-stats-card">
      <div class="mobile-stats-card__title">${escapeHtml(card.title)}</div>
      <div class="mobile-stats-card__body">
        ${rows.length
          ? rows.map((entry) => renderMobileStatLine(entry, card, scope, leagueId)).join('')
          : renderMobileStatLine(null, card, scope, leagueId)}
      </div>
    </div>
  `;
};

const PLAYER_TEAM_SOURCES = {
  premier: { type: 'teams', url: PREMIER_TEAMS_URL, competitionId: 'premier-league-2025-2026' },
  championship: {
    type: 'history',
    url: new URL('2526.csv', CHAMPIONSHIP_HISTORY_BASE_URL),
    competitionId: 'efl-championship-2025-2026'
  },
  seriea: { type: 'teams', url: SERIEA_TEAMS_URL, competitionId: 'serie-a-2025-2026' },
  laliga: { type: 'teams', url: LALIGA_TEAMS_URL, competitionId: 'la-liga-2025-2026' },
  bundesliga: { type: 'teams', url: BUNDESLIGA_TEAMS_URL, competitionId: 'bundesliga-2025-2026' },
  ligue1: { type: 'teams', url: LIGUE1_TEAMS_URL, competitionId: 'ligue-1-2025-2026' },
  ucl: { type: 'teams', url: UCL_TEAMS_URL, competitionId: 'champions-league-2025-2026' },
  europa: {
    type: 'history',
    url: new URL('season-2526.csv', EUROPA_HISTORY_BASE_URL),
    competitionId: 'europa-league-2025-2026'
  },
  conference: {
    type: 'history',
    url: new URL('season-2526.csv', CONFERENCE_HISTORY_BASE_URL),
    competitionId: 'conference-league-2025-2026'
  }
};

const clampChannel = (value) => Math.max(0, Math.min(255, value));

const hexToRgb = (hex) => {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
};

const rgbToHsl = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case rNorm:
        hue = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        hue = (bNorm - rNorm) / delta + 2;
        break;
      default:
        hue = (rNorm - gNorm) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return { h: hue, s: saturation, l: lightness };
};

const hslToRgb = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: clampChannel(Math.round((r + m) * 255)),
    g: clampChannel(Math.round((g + m) * 255)),
    b: clampChannel(Math.round((b + m) * 255))
  };
};

const rgbToHex = (r, g, b) =>
  `#${[r, g, b].map((value) => clampChannel(value).toString(16).padStart(2, '0')).join('')}`;

const tameColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#2a2a2a';
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const saturation = Math.min(hsl.s, 0.65);
  const lightness = Math.min(Math.max(hsl.l, 0.18), 0.42);
  const toned = hslToRgb(hsl.h, saturation, lightness);
  return rgbToHex(toned.r, toned.g, toned.b);
};

const boostColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#2a2a2a';
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const saturation = Math.max(Math.min(hsl.s, 0.85), 0.7);
  const lightness = Math.min(Math.max(hsl.l, 0.35), 0.55);
  const toned = hslToRgb(hsl.h, saturation, lightness);
  return rgbToHex(toned.r, toned.g, toned.b);
};

const stylizePlayerCardColor = (hex, leagueId) => (leagueId === 'premier' ? tameColor(hex) : boostColor(hex));

const buildPlayerCardPair = (primary, secondaryOverride = null) => {
  const rgb = hexToRgb(primary) || { r: 42, g: 42, b: 42 };
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return {
    primary,
    secondary: secondaryOverride || (luminance < 0.4 ? '#f2f2f2' : '#111111'),
    rgb
  };
};

const getManualPlayerCardPair = (leagueId, teamId) => {
  if (!leagueId || !teamId) return null;
  const manualPair = PLAYER_TEAM_COLOR_PAIRS?.[leagueId]?.[teamId];
  if (manualPair) {
    return buildPlayerCardPair(manualPair[0], manualPair[1]);
  }
  const manualPrimary = PLAYER_TEAM_PRIMARY_COLORS?.[leagueId]?.[teamId];
  if (!manualPrimary) return null;
  return buildPlayerCardPair(stylizePlayerCardColor(manualPrimary, leagueId));
};

const applyPlayerCardPair = (card, pair) => {
  if (!(card instanceof HTMLElement) || !pair) return;
  card.style.setProperty('--player-team-primary', pair.primary);
  card.style.setProperty('--player-team-copy', pair.secondary);
  card.style.setProperty(
    '--player-team-border',
    `rgba(${pair.rgb.r}, ${pair.rgb.g}, ${pair.rgb.b}, 0.8)`
  );
};

const extractDominantColor = (url) =>
  new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('No image'));
      return;
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        reject(new Error('Canvas unavailable'));
        return;
      }
      const size = 40;
      canvas.width = size;
      canvas.height = size;
      context.drawImage(image, 0, 0, size, size);
      const { data } = context.getImageData(0, 0, size, size);
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let index = 0; index < data.length; index += 4) {
        const alpha = data[index + 3];
        if (alpha < 200) continue;
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const average = (red + green + blue) / 3;
        if (average > 235) continue;
        r += red;
        g += green;
        b += blue;
        count += 1;
      }
      if (!count) {
        reject(new Error('No dominant color'));
        return;
      }
      resolve(rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count)));
    };
    image.onerror = () => reject(new Error('Image failed'));
    image.src = url;
  });

const splitTeamName = (name = '') => {
  const clean = String(name).trim();
  if (!clean) return { left: '', right: '' };
  const parts = clean.split(/\s+/);
  if (parts.length > 1) {
    return { left: parts.slice(0, -1).join(' '), right: parts.slice(-1).join(' ') };
  }
  const mid = Math.floor(clean.length / 2);
  return { left: clean.slice(0, mid), right: clean.slice(mid) };
};

const collectFixtureTeams = (competition) => {
  const map = new Map();
  (competition?.fixtures || []).forEach((fixture) => {
    [fixture.home, fixture.away].forEach((team) => {
      if (!team?.name) return;
      if (!map.has(team.name)) {
        map.set(team.name, {
          id: team.id || slugifyTeamId(team.name),
          name: team.name,
          shortName: team.short || team.name,
          logo: team.logo || null
        });
      }
    });
  });
  return map;
};

const buildTeamsFromFixtureFallback = (competition) =>
  [...collectFixtureTeams(competition).values()].sort((a, b) => a.name.localeCompare(b.name));

const loadCompetitionTeamsForPlayers = async (competition) => {
  if (!competition?.id) return [];
  if (playerTeamsCache.has(competition.id)) return playerTeamsCache.get(competition.id);

  const source = PLAYER_TEAM_SOURCES[competition.id];
  let teams = [];

  try {
    if (source?.type === 'teams') {
      const payload = await fetchJsonArray(source.url);
      teams = payload.map((team) => ({
        id: team.id,
        name: team.name || team.shortName || team.id,
        shortName: team.shortName || team.name || team.id,
        logo: getLogoSrc(source.competitionId, team.id) || null
      }));
    } else if (source?.type === 'history') {
      const csvText = await fetchText(source.url);
      const matches = parseSeasonFixturesCsv(csvText);
      const fallbackMap = collectFixtureTeams(competition);
      const seen = new Map();
      matches.forEach((match) => {
        [match.homeTeamName, match.awayTeamName].forEach((name) => {
          if (!name) return;
          const id = slugifyTeamId(name);
          if (seen.has(id)) return;
          seen.set(id, {
            id,
            name,
            shortName: name,
            logo: getLogoSrc(source.competitionId, id) || fallbackMap.get(name)?.logo || null
          });
        });
      });
      teams = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      teams = buildTeamsFromFixtureFallback(competition);
    }
  } catch (error) {
    console.warn(`Unable to load mobile player teams for ${competition.id}.`, error);
    teams = buildTeamsFromFixtureFallback(competition);
  }

  playerTeamsCache.set(competition.id, teams);
  return teams;
};

const renderPlayersCompStrip = (competitions, activeCompetitionId) => `
  <section class="mobile-players-comp-shell">
    <div class="mobile-comp-strip mobile-comp-strip--players">
      ${competitions
        .map(
          (competition) => `
            <button
              class="mobile-sidebar-item${competition.id === activeCompetitionId ? ' active' : ''} ${competition.themeClass || ''}"
              type="button"
              data-player-competition="${competition.id}"
              aria-label="Show ${escapeHtml(competition.title)} teams"
              title="${escapeHtml(competition.title)}"
            >
              <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
            </button>
          `
        )
        .join('')}
    </div>
  </section>
`;

const renderPlayerTeamCard = (team, competition) => {
  const displayName = team.name || team.shortName || team.id;
  const isLongName = displayName.length >= 16 || displayName.split(/\s+/).length >= 3;
  const isWorldcup = competition.id === 'worldcup';
  const { left, right } = splitTeamName(displayName);
  const teamId = team.id || slugifyTeamId(displayName);
  const manualPair = getManualPlayerCardPair(competition.id, teamId);
  return `
    <button
      class="mobile-player-team-card${isLongName ? ' is-long' : ''}${isWorldcup ? ' is-worldcup' : ''}"
      type="button"
      data-player-league="${escapeHtml(competition.id)}"
      data-player-team-id="${escapeHtml(teamId)}"
      data-player-team-name="${escapeHtml(displayName)}"
      data-player-team-logo="${escapeHtml(team.logo || '')}"
      style="--player-team-primary:${manualPair?.primary || getThemeAccent(competition.themeClass)};--player-team-copy:${manualPair?.secondary || '#ffffff'};${manualPair ? `--player-team-border:rgba(${manualPair.rgb.r}, ${manualPair.rgb.g}, ${manualPair.rgb.b}, 0.8);` : ''}"
    >
      <div class="mobile-player-team-card__title">
        ${
          isWorldcup
            ? `
              <span class="mobile-player-team-card__logo${team.logo ? '' : ' is-fallback'}">
                ${
                  team.logo
                    ? `<img src="${team.logo}" alt="${escapeHtml(displayName)}" />`
                    : `<span>${escapeHtml(displayName.slice(0, 2).toUpperCase())}</span>`
                }
              </span>
              <span class="mobile-player-team-card__word is-full">${escapeHtml(displayName)}</span>
            `
            : `
              <span class="mobile-player-team-card__word">${escapeHtml(left)}</span>
              <span class="mobile-player-team-card__logo${team.logo ? '' : ' is-fallback'}">
                ${
                  team.logo
                    ? `<img src="${team.logo}" alt="${escapeHtml(displayName)}" />`
                    : `<span>${escapeHtml(displayName.slice(0, 2).toUpperCase())}</span>`
                }
              </span>
              <span class="mobile-player-team-card__word">${escapeHtml(right)}</span>
            `
        }
      </div>
    </button>
  `;
};

const applyPlayerCardTheme = async (card) => {
  if (!(card instanceof HTMLElement)) return;
  const logoSrc = card.dataset.playerTeamLogo;
  const leagueId = card.dataset.playerLeague || '';
  const teamId = card.dataset.playerTeamId || '';
  const manualPair = getManualPlayerCardPair(leagueId, teamId);
  if (manualPair) {
    applyPlayerCardPair(card, manualPair);
    return;
  }
  if (!logoSrc) return;
  const cacheKey = `${leagueId}:${logoSrc}`;
  if (playerColorCache.has(cacheKey)) {
    applyPlayerCardPair(card, playerColorCache.get(cacheKey));
    return;
  }
  try {
    const dominant = await extractDominantColor(logoSrc);
    const color = stylizePlayerCardColor(dominant, leagueId);
    const pair = buildPlayerCardPair(color);
    playerColorCache.set(cacheKey, pair);
    applyPlayerCardPair(card, pair);
  } catch {
    // keep fallback accent
  }
};

const renderPlayersCompetitionPanel = (competition, teams) => `
  <section class="mobile-desktop-surface mobile-desktop-surface--players-browser">
    <div class="mobile-players-browser__meta" style="--league-accent:${getThemeAccent(competition.themeClass)};">
      <span class="mobile-players-browser__meta-logo">
        <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
      </span>
      <span class="mobile-players-browser__meta-copy">
        <span class="mobile-players-browser__meta-eyebrow">Club Select</span>
        <span class="mobile-players-browser__meta-title">${escapeHtml(competition.title)}</span>
      </span>
      <span class="mobile-players-browser__meta-count">${teams.length}</span>
    </div>
    <div class="mobile-player-team-grid">
      ${teams.map((team) => renderPlayerTeamCard(team, competition)).join('')}
    </div>
  </section>
`;

const renderQuizCard = (mode, level, isOnline = false) => `
  <article class="mobile-quiz-card${isOnline ? ' is-online' : ''}">
    <span class="mobile-quiz-card__mode">${isOnline ? 'Onlinemode' : 'Singlemode'}</span>
    <div class="mobile-quiz-card__head">
      <span>Quiz</span>
      <span>Level</span>
      <span>${level}</span>
    </div>
    <div class="mobile-quiz-card__body">${mode}</div>
  </article>
`;

const renderNewsColumn = () => `
  <div class="mobile-news-column">
    <div class="mobile-news-card small"></div>
    <div class="mobile-news-card tall"></div>
  </div>
`;

const MOBILE_NEWS_ITEMS = [
  {
    id: 'florian',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/Florian/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/Florian/images/florian-wirtz_2em8s4r19zyf103rb9qloaqgy.jpg',
      import.meta.url
    ).href
  },
  {
    id: 'diomande',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/diamonte/text/info', import.meta.url),
    imageUrl: new URL('../../../news/diamonte/images/3DR18JJ.webp', import.meta.url).href
  },
  {
    id: 'messi',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/messi/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/messi/images/images_voltaxMediaLibrary_mmsport_si_01kmqtp64k4hfcp70axc.webp',
      import.meta.url
    ).href
  },
  {
    id: 'netherlands',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/netherlands/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/netherlands/images/tijjani-reijnders_btpsxgtw2i801edbgzr2gz21k.jpg',
      import.meta.url
    ).href
  },
  {
    id: 'madueke',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/madueke/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/madueke/images/images_voltaxMediaLibrary_mmsport_si_01kmt7q6xm81d02mw1n4.webp',
      import.meta.url
    ).href,
    fallbackTitle: 'Noni Madueke',
    fallbackExcerpt: 'Article text has not been added yet.'
  },
  {
    id: 'rodri',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/rodri/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/rodri/images/images_voltaxMediaLibrary_mmsport_si_01kmt9vq8y5pbmd00sm8.webp',
      import.meta.url
    ).href
  },
  {
    id: 'salah',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/salah/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/salah/images/mohamed-salah_7llm5eygdolh1xtn8l8uf4erq.jpg',
      import.meta.url
    ).href
  }
];

const toNewsTitleCase = (value = '') =>
  String(value)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const parseMobileNewsArticle = (rawText, item) => {
  const blocks = String(rawText || '')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n+/g, ' ').trim())
    .filter(Boolean)
    .filter(
      (block) =>
        !/^(share|watch every press conference|free newsletter|join over|read the latest)/i.test(block)
    );

  const title = blocks.shift() || item.fallbackTitle || toNewsTitleCase(item.id);

  let meta = '';
  if (
    blocks[0] &&
    (/fotmob\s*-/i.test(blocks[0]) ||
      /\b(?:march|april|may|june|july|august|september|october|november|december|january|february)\b/i.test(
        blocks[0]
      ) ||
      /•/.test(blocks[0]))
  ) {
    meta = blocks.shift();
  }

  const excerpt = blocks.shift() || item.fallbackExcerpt || '';
  return {
    title,
    meta,
    excerpt
  };
};

const renderMobileNewsCard = (article, index) => `
  <article class="mobile-news-feed-card${index === 0 ? ' is-featured' : ''}">
    <div class="mobile-news-feed-card__media">
      <img src="${article.imageUrl}" alt="${escapeHtml(article.title)}" loading="lazy" decoding="async" />
    </div>
    <div class="mobile-news-feed-card__body">
      <div class="mobile-news-feed-card__kicker">Football News</div>
      <h3 class="mobile-news-feed-card__title">${escapeHtml(article.title)}</h3>
      <div class="mobile-news-feed-card__date">Uploaded ${escapeHtml(article.uploadedAt || '')}</div>
      ${article.meta ? `<div class="mobile-news-feed-card__meta">${escapeHtml(article.meta)}</div>` : ''}
      ${article.excerpt ? `<p class="mobile-news-feed-card__excerpt">${escapeHtml(article.excerpt)}</p>` : ''}
    </div>
  </article>
`;

export const renderNewsView = async (root) => {
  if (!root) return;

  root.innerHTML = `
    ${renderHeader('News', 'Your uploaded stories, sized properly for phone.')}
    <section class="mobile-desktop-surface mobile-desktop-surface--news">
      <div class="mobile-news-feed" id="mobile-news-feed">
        <div class="mobile-news-feed__loading">Loading news...</div>
      </div>
    </section>
  `;

  const feed = root.querySelector('#mobile-news-feed');
  if (!feed) return;

  try {
    const articles = await Promise.all(
      MOBILE_NEWS_ITEMS.map(async (item) => {
        const response = await fetch(item.textUrl);
        if (!response.ok) throw new Error(`Failed to load ${item.id}`);
        const text = await response.text();
        return { ...item, ...parseMobileNewsArticle(text, item) };
      })
    );

    feed.innerHTML = articles.map((article, index) => renderMobileNewsCard(article, index)).join('');
  } catch (error) {
    console.warn('Unable to load mobile news.', error);
    feed.innerHTML = '<div class="mobile-news-feed__loading">News is unavailable right now.</div>';
  }
};

const sortStandings = (entries = []) =>
  [...entries]
    .sort((a, b) => {
      const rankDelta = Number(a?.rank ?? 999) - Number(b?.rank ?? 999);
      if (rankDelta !== 0) return rankDelta;
      if ((b?.points ?? 0) !== (a?.points ?? 0)) return (b?.points ?? 0) - (a?.points ?? 0);
      if ((b?.goalDifference ?? 0) !== (a?.goalDifference ?? 0)) {
        return (b?.goalDifference ?? 0) - (a?.goalDifference ?? 0);
      }
      if ((b?.goalsFor ?? 0) !== (a?.goalsFor ?? 0)) return (b?.goalsFor ?? 0) - (a?.goalsFor ?? 0);
      return String(a?.teamName || a?.teamId || '').localeCompare(String(b?.teamName || b?.teamId || ''));
    })
    .map((entry, index) => ({
      ...entry,
      rank: Number.isFinite(entry?.rank) ? entry.rank : index + 1
    }));

const renderFormPills = (form = []) => {
  const values = Array.isArray(form) ? form.slice(0, 5) : [];
  if (!values.length) return '<span class="mobile-form-empty">-</span>';
  return `
    <div class="mobile-form-row">
      ${values
        .map((value) => {
          const label = String(value || '').toUpperCase();
          const outcome =
            label === 'W' ? 'win' : label === 'L' ? 'loss' : label === 'D' ? 'draw' : 'draw';
          return `<span class="mobile-form-pill is-${outcome}">${escapeHtml(label || 'D')}</span>`;
        })
        .join('')}
    </div>
  `;
};

const renderTeamLogo = (competitionId, teamId, teamLabel) => {
  const logoSrc = getLogoSrc(competitionId, teamId);
  if (logoSrc) {
    return `<span class="mobile-league-team-logo mobile-league-team-logo--${escapeHtml(teamId)}"><img src="${logoSrc}" alt="${escapeHtml(teamLabel)}" loading="lazy" decoding="async" /></span>`;
  }

  return `<span class="mobile-league-team-logo is-fallback">${escapeHtml(String(teamLabel || '?').slice(0, 2).toUpperCase())}</span>`;
};

const renderTableRows = (standings, teamsById, competitionId) =>
  sortStandings(standings)
    .map((entry) => {
      const team = teamsById.get(entry.teamId);
      const teamLabel = team?.name || team?.shortName || entry.teamName || entry.teamId;
      return `
        <tr>
          <td class="is-rank">${escapeHtml(entry.rank)}</td>
          <td class="is-team">
            ${renderTeamLogo(competitionId, entry.teamId, teamLabel)}
            <span class="mobile-league-team-name">${escapeHtml(teamLabel)}</span>
          </td>
          <td>${escapeHtml(entry.matchesPlayed)}</td>
          <td>${escapeHtml(entry.wins)}</td>
          <td>${escapeHtml(entry.draws)}</td>
          <td>${escapeHtml(entry.losses)}</td>
          <td>${escapeHtml(entry.goalDifference)}</td>
          <td class="is-points">${escapeHtml(entry.points)}</td>
          <td class="is-form">${renderFormPills(entry.form)}</td>
        </tr>
      `;
    })
    .join('');

const renderSeasonSelect = (leagueId, selectedSeasonValue) => {
  const options = getSeasonOptionsForLeague(leagueId);
  const label = leagueId === 'worldcup' ? 'Year' : 'Season';
  return `
    <div class="mobile-league-season">
      <label for="mobile-league-season-select">${label}</label>
      <select id="mobile-league-season-select" class="mobile-league-season__select"${options.length <= 1 ? ' disabled' : ''}>
        ${options
          .map(
            (option) => `
              <option value="${escapeHtml(option.value)}"${option.value === selectedSeasonValue ? ' selected' : ''}>
                ${escapeHtml(option.label)}
              </option>
            `
          )
          .join('')}
      </select>
    </div>
  `;
};

const renderTablePanel = (competition, config, standings, teamsById, seasonValue) => `
  <div class="mobile-league-panel__hero" style="--league-accent:${getThemeAccent(competition.themeClass)};">
    <span class="mobile-league-panel__hero-logo">
      <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
    </span>
    <div class="mobile-league-panel__hero-copy">
      <div class="mobile-league-panel__title">${escapeHtml(competition.title)}</div>
      <div class="mobile-league-panel__meta">${escapeHtml(config.subtitle || 'Current table')}</div>
    </div>
  </div>
  ${renderSeasonSelect(competition.id, seasonValue)}
  <div class="mobile-league-table-scroll">
    <table class="mobile-league-table">
      <thead>
        <tr>
          <th>#</th>
          <th class="is-team">Team</th>
          <th>PL</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GD</th>
          <th>PTS</th>
          <th>Form</th>
        </tr>
      </thead>
      <tbody>
        ${renderTableRows(standings, teamsById, config.competitionId)}
      </tbody>
    </table>
  </div>
`;

const renderGroupsPanel = (competition, config, groups, seasonValue) => `
  <div class="mobile-league-panel__hero" style="--league-accent:${getThemeAccent(competition.themeClass)};">
    <span class="mobile-league-panel__hero-logo">
      <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
    </span>
    <div class="mobile-league-panel__hero-copy">
      <div class="mobile-league-panel__title">${escapeHtml(competition.title)}</div>
      <div class="mobile-league-panel__meta">${escapeHtml(config.subtitle || 'Groups')}</div>
    </div>
  </div>
  ${renderSeasonSelect(competition.id, seasonValue)}
  <div class="mobile-worldcup-groups">
    ${groups
      .map(
        ({ groupName, teams }) => `
          <section class="mobile-worldcup-group">
            <div class="mobile-worldcup-group__title">${escapeHtml(groupName)}</div>
            <div class="mobile-worldcup-group__list">
              ${teams
                .map(
                  (teamName) => `
                    <div class="mobile-worldcup-group__team">
                      ${buildWorldcupFlagMarkup(teamName)}
                      <span>${escapeHtml(teamName)}</span>
                    </div>
                  `
                )
                .join('')}
            </div>
          </section>
        `
      )
      .join('')}
  </div>
`;

const renderMessagePanel = (competition, config, seasonValue) => `
  <div class="mobile-league-panel__hero" style="--league-accent:${getThemeAccent(competition.themeClass)};">
    <span class="mobile-league-panel__hero-logo">
      <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
    </span>
    <div class="mobile-league-panel__hero-copy">
      <div class="mobile-league-panel__title">${escapeHtml(competition.title)}</div>
      <div class="mobile-league-panel__meta">${escapeHtml(config.subtitle || 'Competition view')}</div>
    </div>
  </div>
  ${renderSeasonSelect(competition.id, seasonValue)}
  <div class="mobile-league-message-card">
    <div class="mobile-league-message-card__title">No league table</div>
    <div class="mobile-league-message-card__body">${escapeHtml(config.message || 'This competition does not use a league table.')}</div>
  </div>
`;

const renderLoadingPanel = (competition, seasonValue) => `
  <div class="mobile-league-panel__hero" style="--league-accent:${getThemeAccent(competition.themeClass)};">
    <span class="mobile-league-panel__hero-logo">
      <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
    </span>
    <div class="mobile-league-panel__hero-copy">
      <div class="mobile-league-panel__title">${escapeHtml(competition.title)}</div>
      <div class="mobile-league-panel__meta">Loading table...</div>
    </div>
  </div>
  ${renderSeasonSelect(competition.id, seasonValue)}
  <div class="mobile-league-loading">
    <span></span><span></span><span></span>
  </div>
`;

const renderErrorPanel = (competition, config, seasonValue) => `
  <div class="mobile-league-panel__hero" style="--league-accent:${getThemeAccent(competition.themeClass)};">
    <span class="mobile-league-panel__hero-logo">
      <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
    </span>
    <div class="mobile-league-panel__hero-copy">
      <div class="mobile-league-panel__title">${escapeHtml(competition.title)}</div>
      <div class="mobile-league-panel__meta">${escapeHtml(config.subtitle || 'Current view')}</div>
    </div>
  </div>
  ${renderSeasonSelect(competition.id, seasonValue)}
  <div class="mobile-league-message-card is-error">
    <div class="mobile-league-message-card__title">Couldn’t load this table</div>
    <div class="mobile-league-message-card__body">Try refreshing the mobile page once.</div>
  </div>
`;

const fetchJsonArray = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
};

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.text();
};

const loadHistoryStandings = async ({ config, seasonValue, seasonOption, teamsById, teamsByAlias }) => {
  const seasonCode = seasonValue === 'live' ? config.currentSeasonCode : seasonValue;
  const fileName =
    typeof config.fileForSeason === 'function' ? config.fileForSeason(seasonCode) : `season-${seasonCode}.csv`;
  const csvText = await fetchText(new URL(fileName, config.historyBaseUrl));
  let matches = parseSeasonFixturesCsv(csvText);
  if (typeof config.filterMatches === 'function') {
    matches = config.filterMatches(matches, { seasonValue, option: seasonOption });
  }
  const pointsForWin = typeof config.pointsForWin === 'function' ? config.pointsForWin(seasonOption?.startYear) : 3;
  return buildStandingsFromMatches(matches, { teamsById, teamsByAlias, pointsForWin });
};

const loadLeagueTableData = async (leagueId, seasonValue) => {
  const config = LEAGUE_VIEW_CONFIGS[leagueId];
  if (!config) throw new Error(`Unknown league config: ${leagueId}`);
  const seasonOptions = getSeasonOptionsForLeague(leagueId);
  const seasonOption = seasonOptions.find((option) => option.value === seasonValue) || seasonOptions[0] || null;
  const resolvedSeasonValue = seasonOption?.value || seasonValue || 'live';
  const cacheKey = `${leagueId}::${resolvedSeasonValue}`;

  if (leagueTableCache.has(cacheKey)) {
    return leagueTableCache.get(cacheKey);
  }

  if (config.kind === 'message') {
    const payload = { type: 'message' };
    leagueTableCache.set(cacheKey, payload);
    return payload;
  }

  if (config.kind === 'groups') {
    const worldcupFile = `season-${resolvedSeasonValue}.csv`;
    const csvText = await fetchText(new URL(worldcupFile, config.historyBaseUrl));
    const payload = { type: 'groups', groups: parseWorldcupGroupsCsv(csvText) };
    leagueTableCache.set(cacheKey, payload);
    return payload;
  }

  let teams = [];
  if (config.teamsUrl) {
    teams = await fetchJsonArray(config.teamsUrl);
  }

  const teamsById = new Map(teams.map((team) => [team.id, team]));
  const teamsByAlias = buildTeamsByAlias(teams, config.aliases);

  if (config.kind === 'table') {
    let standings = [];
    if (resolvedSeasonValue === 'live') {
      try {
        standings = await fetchJsonArray(config.standingsUrl);
      } catch (error) {
        if (!config.historyBaseUrl) throw error;
        standings = await loadHistoryStandings({
          config,
          seasonValue: resolvedSeasonValue,
          seasonOption,
          teamsById,
          teamsByAlias
        });
      }
    } else if (config.historyBaseUrl) {
      standings = await loadHistoryStandings({
        config,
        seasonValue: resolvedSeasonValue,
        seasonOption,
        teamsById,
        teamsByAlias
      });
    } else {
      standings = await fetchJsonArray(config.standingsUrl);
    }
    const payload = { type: 'table', standings, teamsById };
    leagueTableCache.set(cacheKey, payload);
    return payload;
  }

  const standings = await loadHistoryStandings({
    config,
    seasonValue: resolvedSeasonValue,
    seasonOption,
    teamsById,
    teamsByAlias
  });
  const payload = { type: 'table', standings, teamsById };
  leagueTableCache.set(cacheKey, payload);
  return payload;
};

const renderLeagueSelector = (competitions, activeLeagueId) => `
  <div class="mobile-league-selector">
    ${competitions
      .map(
        (competition) => `
          <button
            class="mobile-league-selector__btn${competition.id === activeLeagueId ? ' is-active' : ''}"
            type="button"
            data-league-view="${competition.id}"
            style="--league-accent:${getThemeAccent(competition.themeClass)};"
          >
            <span class="mobile-league-selector__logo">
              <img src="${competition.logo}" alt="${escapeHtml(competition.title)}" />
            </span>
            <span class="mobile-league-selector__label">${escapeHtml(competition.title)}</span>
          </button>
        `
      )
      .join('')}
  </div>
`;

export const renderLeaguesView = async (root, competitions = [], { preferredLeagueId = null } = {}) => {
  if (!root) return;

  const leagueCompetitions = competitions.filter((competition) => LEAGUE_VIEW_CONFIGS[competition.id]);
  if (!leagueCompetitions.length) {
    root.innerHTML = `
      ${renderHeader('Leagues', 'League tables will show up here once the data is ready.')}
      <section class="mobile-desktop-surface mobile-desktop-surface--leagues">
        <div class="mobile-league-message-card">
          <div class="mobile-league-message-card__title">No leagues found</div>
        </div>
      </section>
    `;
    return;
  }

  const storedLeagueId = safeStorageGet(LEAGUE_STORAGE_KEY);
  const activeLeagueId = leagueCompetitions.some((competition) => competition.id === preferredLeagueId)
    ? preferredLeagueId
    : leagueCompetitions.some((competition) => competition.id === storedLeagueId)
      ? storedLeagueId
      : leagueCompetitions[0].id;

  root.innerHTML = `
    ${renderHeader('Leagues', 'Tap any competition and we show its table right here.')}
    <section class="mobile-desktop-surface mobile-desktop-surface--leagues">
      ${renderLeagueSelector(leagueCompetitions, activeLeagueId)}
      <div class="mobile-league-panel" aria-live="polite"></div>
    </section>
  `;

  const selectorRoot = root.querySelector('.mobile-league-selector');
  const panelRoot = root.querySelector('.mobile-league-panel');
  let selectedLeagueId = activeLeagueId;
  let selectedSeasonValue = getDefaultSeasonValue(activeLeagueId);
  let activeRequestKey = '';

  const setActiveButton = () => {
    selectorRoot?.querySelectorAll('.mobile-league-selector__btn').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.leagueView === selectedLeagueId);
    });
  };

  const renderSelectedLeague = async (leagueId, seasonValue = null) => {
    const competition = leagueCompetitions.find((entry) => entry.id === leagueId);
    const config = LEAGUE_VIEW_CONFIGS[leagueId];
    if (!competition || !config || !panelRoot) return;

    selectedLeagueId = leagueId;
    const seasonOptions = getSeasonOptionsForLeague(leagueId);
    const resolvedSeasonValue =
      seasonValue && seasonOptions.some((option) => option.value === seasonValue)
        ? seasonValue
        : getDefaultSeasonValue(leagueId);
    selectedSeasonValue = resolvedSeasonValue;
    safeStorageSet(LEAGUE_STORAGE_KEY, leagueId);
    safeStorageSet(getSeasonStorageKey(leagueId), resolvedSeasonValue);
    setActiveButton();
    const requestKey = `${leagueId}::${resolvedSeasonValue}`;
    activeRequestKey = requestKey;
    panelRoot.innerHTML = renderLoadingPanel(competition, resolvedSeasonValue);

    try {
      const payload = await loadLeagueTableData(leagueId, resolvedSeasonValue);
      if (selectedLeagueId !== leagueId || activeRequestKey !== requestKey) return;

      if (payload.type === 'table') {
        panelRoot.innerHTML = renderTablePanel(competition, config, payload.standings, payload.teamsById, resolvedSeasonValue);
        return;
      }

      if (payload.type === 'groups') {
        panelRoot.innerHTML = renderGroupsPanel(competition, config, payload.groups, resolvedSeasonValue);
        return;
      }

      panelRoot.innerHTML = renderMessagePanel(competition, config, resolvedSeasonValue);
    } catch (error) {
      console.warn(`Unable to load mobile league table for ${leagueId}.`, error);
      if (selectedLeagueId === leagueId && activeRequestKey === requestKey) {
        panelRoot.innerHTML = renderErrorPanel(competition, config, resolvedSeasonValue);
      }
    }
  };

  selectorRoot?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest('.mobile-league-selector__btn[data-league-view]');
    if (!button) return;
    renderSelectedLeague(button.dataset.leagueView);
  });

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    if (target.id !== 'mobile-league-season-select') return;
    renderSelectedLeague(selectedLeagueId, target.value);
  });

  await renderSelectedLeague(activeLeagueId);
};

export const renderPlayersView = async (root, competitions = []) => {
  if (!root) return;

  const playerCompetitions = competitions.filter(Boolean);
  const storedCompetitionId = safeStorageGet(PLAYER_LEAGUE_STORAGE_KEY);
  const activeCompetitionId = playerCompetitions.some((competition) => competition.id === storedCompetitionId)
    ? storedCompetitionId
    : playerCompetitions[0]?.id;

  if (!activeCompetitionId) {
    root.innerHTML = `
      <section class="mobile-players-comp-shell mobile-players-comp-shell--empty"></section>
      <section class="mobile-desktop-surface mobile-desktop-surface--players-browser">
        <div class="mobile-league-message-card">
          <div class="mobile-league-message-card__title">No teams found</div>
        </div>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    ${renderPlayersCompStrip(playerCompetitions, activeCompetitionId)}
    <div class="mobile-players-browser-panel"></div>
  `;

  const stripRoot = root.querySelector('.mobile-comp-strip--players');
  const panelRoot = root.querySelector('.mobile-players-browser-panel');
  let selectedCompetitionId = activeCompetitionId;
  let requestToken = 0;

  const setActiveCompetition = () => {
    stripRoot?.querySelectorAll('.mobile-sidebar-item').forEach((button) => {
      button.classList.toggle('active', button.dataset.playerCompetition === selectedCompetitionId);
    });
  };

  const renderSelectedCompetition = async (competitionId) => {
    const competition = playerCompetitions.find((entry) => entry.id === competitionId);
    if (!competition || !panelRoot) return;
    selectedCompetitionId = competitionId;
    safeStorageSet(PLAYER_LEAGUE_STORAGE_KEY, competitionId);
    setActiveCompetition();
    const currentToken = ++requestToken;
    panelRoot.innerHTML = `
      <section class="mobile-desktop-surface mobile-desktop-surface--players-browser">
        <div class="mobile-league-loading"><span></span><span></span><span></span></div>
      </section>
    `;
    const teams = await loadCompetitionTeamsForPlayers(competition);
    if (currentToken !== requestToken) return;
    panelRoot.innerHTML = renderPlayersCompetitionPanel(competition, teams);
    panelRoot.querySelectorAll('.mobile-player-team-card').forEach((card) => {
      applyPlayerCardTheme(card);
    });
  };

  stripRoot?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest('.mobile-sidebar-item[data-player-competition]');
    if (!button) return;
    renderSelectedCompetition(button.dataset.playerCompetition);
  });

  await renderSelectedCompetition(activeCompetitionId);
};

export const renderStatsView = (root, competitions = []) => {
  if (!root) return;

  const statsCompetitions = competitions.filter(Boolean);
  const storedLeagueId = safeStorageGet(MOBILE_STATS_LEAGUE_STORAGE_KEY);
  const storedScope = safeStorageGet(MOBILE_STATS_SCOPE_STORAGE_KEY);
  let selectedLeagueId = statsCompetitions.some((competition) => competition.id === storedLeagueId)
    ? storedLeagueId
    : statsCompetitions[0]?.id || 'premier';
  let selectedScope = storedScope === 'teams' || storedScope === 'players' ? storedScope : 'players';
  let searchTerm = '';
  let activeRequestToken = 0;

  root.innerHTML = `
    ${renderHeader('Stats', 'Desktop stats flow, resized for the phone view.')}
    <div class="mobile-stats-toolbar">
      ${renderSearchPill('Search stats')}
      <div class="mobile-stats-toggle" role="tablist" aria-label="Stats scope">
        <button class="mobile-stats-toggle__btn${selectedScope === 'players' ? ' is-active' : ''}" type="button" data-stats-scope="players">Players</button>
        <button class="mobile-stats-toggle__btn${selectedScope === 'teams' ? ' is-active' : ''}" type="button" data-stats-scope="teams">Teams</button>
      </div>
    </div>
    <section class="mobile-desktop-surface mobile-desktop-surface--stats">
      <div class="mobile-stats-sidebar">
        ${statsCompetitions.map((competition) => renderMobileStatsLeagueButton(competition, competition.id === selectedLeagueId)).join('')}
      </div>
      <div class="mobile-stats-grid" aria-live="polite"></div>
    </section>
  `;

  const searchInput = root.querySelector('.mobile-stats-toolbar input');
  const toggleButtons = [...root.querySelectorAll('.mobile-stats-toggle__btn[data-stats-scope]')];
  const leagueButtons = [...root.querySelectorAll('.mobile-stats-league[data-stats-league]')];
  const gridRoot = root.querySelector('.mobile-stats-grid');

  const setActiveUi = () => {
    toggleButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.statsScope === selectedScope);
    });
    leagueButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.statsLeague === selectedLeagueId);
    });
  };

  const renderNotice = (title, body) => {
    if (!gridRoot) return;
    gridRoot.innerHTML = `
      <div class="mobile-stats-card mobile-stats-card--notice">
        <div class="mobile-stats-card__title">${escapeHtml(title)}</div>
        <div class="mobile-stats-card__body">
          <div class="mobile-stat-line is-empty">
            <div class="mobile-stat-line__label"><span>${escapeHtml(body)}</span></div>
            <div class="mobile-stat-line__value">—</div>
          </div>
        </div>
      </div>
    `;
  };

  const renderSelectedStats = async () => {
    if (!gridRoot) return;
    safeStorageSet(MOBILE_STATS_LEAGUE_STORAGE_KEY, selectedLeagueId);
    safeStorageSet(MOBILE_STATS_SCOPE_STORAGE_KEY, selectedScope);
    setActiveUi();
    const requestToken = ++activeRequestToken;
    renderNotice('Loading stats', 'Pulling the league numbers now.');

    const statsUrl = getMobileStatsUrl(selectedLeagueId, selectedScope);
    const statCards = getStatsCardsForScope(selectedScope);

    if (!statsUrl) {
      renderNotice('No stats yet', `${selectedScope === 'players' ? 'Player' : 'Team'} stats are not uploaded for this competition yet.`);
      return;
    }

    const cacheKey = `${selectedLeagueId}:${selectedScope}`;
    if (!mobileStatsCache.has(cacheKey)) {
      try {
        mobileStatsCache.set(cacheKey, await fetchJsonArray(statsUrl));
      } catch (error) {
        console.warn(`Unable to load mobile stats for ${selectedLeagueId} (${selectedScope}).`, error);
        mobileStatsCache.set(cacheKey, []);
      }
    }

    if (requestToken !== activeRequestToken) return;

    const stats = mobileStatsCache.get(cacheKey) || [];
    if (!stats.length) {
      renderNotice('No stats yet', 'Stats data is not available for this competition.');
      return;
    }

    const normalizedSearchTerm = normalizeStatsString(searchTerm);
    const visibleCards = statCards.filter((card) => {
      const filtered = normalizedSearchTerm
        ? stats.filter((entry) =>
            normalizeStatsString(selectedScope === 'teams' ? entry.teamName : entry.playerName).includes(normalizedSearchTerm)
          )
        : stats;
      return filtered.some((entry) => {
        const value = entry?.[card.key];
        if (value == null) return false;
        if (typeof value === 'string') return value.trim() !== '' && value.trim() !== '0' && value.trim() !== '0%';
        return getStatsNumber(value) > 0;
      });
    });

    if (!visibleCards.length) {
      renderNotice('No stats found', 'Try another search or switch the scope.');
      return;
    }

    gridRoot.innerHTML = visibleCards
      .map((card) => buildMobileStatsCardMarkup(stats, card, selectedScope, selectedLeagueId, normalizedSearchTerm))
      .join('');
  };

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const scopeButton = target.closest('.mobile-stats-toggle__btn[data-stats-scope]');
    if (scopeButton) {
      selectedScope = scopeButton.dataset.statsScope || 'players';
      renderSelectedStats();
      return;
    }

    const leagueButton = target.closest('.mobile-stats-league[data-stats-league]');
    if (leagueButton) {
      selectedLeagueId = leagueButton.dataset.statsLeague || selectedLeagueId;
      renderSelectedStats();
    }
  });

  searchInput?.addEventListener('input', (event) => {
    searchTerm = event.target.value || '';
    renderSelectedStats();
  });

  setActiveUi();
  renderSelectedStats();
};

export const renderQuizView = (root) => {
  if (!root) return;

  root.innerHTML = `
    ${renderHeader('Quiz', 'Same quiz flow as the main web, resized inside the phone view.')}
    <section class="mobile-quiz-embed" aria-label="Quiz">
      <div class="mobile-quiz-embed__frame-wrap">
        <iframe
          class="mobile-quiz-embed__frame"
          src="/frontend/index.html?view=quiz&embedQuiz=1"
          title="FOD Quiz"
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </div>
    </section>
  `;
};

export const renderCardgameView = (root) => {
  if (!root) return;

  root.innerHTML = `
    ${renderHeader('Cardgame', 'Same cardgame as the main web, with basic packs on top and special boxes underneath.')}
    <section class="mobile-cardgame-embed" aria-label="Cardgame">
      <div class="mobile-cardgame-embed__frame-wrap">
        <iframe
          class="mobile-cardgame-embed__frame"
          src="/frontend/index.html?view=cardgame&embedCardgame=1"
          title="FOD Cardgame"
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </div>
    </section>
  `;
};

export const renderSimpleView = (root, config) => {
  if (!root) return;

  if (config.type === 'quiz') {
    root.innerHTML = `
      ${renderHeader('Quiz', 'Phone version of the desktop quiz cards.')}
      <section class="mobile-desktop-surface mobile-desktop-surface--quiz">
        <div class="mobile-quiz-toolbar">
          <div class="mobile-select-wrap">
            <label>Select competition</label>
            <select>
              <option>Premier League</option>
              <option>EFL Championship</option>
              <option>Serie A</option>
              <option>LaLiga</option>
              <option>Bundesliga</option>
              <option>Ligue 1</option>
              <option>Champions League</option>
            </select>
          </div>
        </div>
        <div class="mobile-quiz-grid">
          ${renderQuizCard('Start now', 'Easy')}
          ${renderQuizCard('Start now', 'Medium')}
          ${renderQuizCard('Start now', 'Hard')}
          ${renderQuizCard('Join room', 'Easy', true)}
        </div>
      </section>
    `;
    return;
  }

  if (config.type === 'news') {
    root.innerHTML = `
      ${renderHeader('News', 'News feed is loading...')}
      <section class="mobile-desktop-surface mobile-desktop-surface--news">
        <div class="mobile-news-feed">
          <div class="mobile-news-feed__loading">Loading news...</div>
        </div>
      </section>
    `;
    return;
  }

  if (config.type === 'cards') {
    root.innerHTML = `
      ${renderHeader('Cardgame', 'Desktop cardgame feeling, reorganized for mobile.')}
      <section class="mobile-desktop-surface mobile-desktop-surface--cards">
        <div class="mobile-cardgame-toolbar">
          <button class="mobile-cardgame-tab is-active" type="button">Packs</button>
          <button class="mobile-cardgame-tab" type="button">Inventory</button>
          <button class="mobile-cardgame-tab" type="button">Market</button>
        </div>
        <div class="mobile-cardgame-stage">
          <div class="mobile-cardgame-stage__hero"></div>
          <div class="mobile-cardgame-stage__grid">
            <div class="mobile-cardgame-tile"></div>
            <div class="mobile-cardgame-tile"></div>
            <div class="mobile-cardgame-tile"></div>
            <div class="mobile-cardgame-tile"></div>
          </div>
        </div>
      </section>
    `;
    return;
  }

  root.innerHTML = '';
};

export const renderProfileView = (root) => {
  if (!root) return;
  const user = loadStoredUser();
  const avatar = getStoredProfileImage(user);
  const posts = Number(user?.posts) || 0;
  const followers = Number(user?.followers) || 0;
  const following = Number(user?.following) || 0;

  if (!user) {
    root.innerHTML = `
      ${renderHeader('Profile', 'Login on mobile and keep the same FOD account as the main web.')}
      <section class="mobile-desktop-surface mobile-desktop-surface--profile">
        <div class="mobile-profile-empty">
          <div class="mobile-profile-empty__avatar">FD</div>
          <div class="mobile-profile-empty__title">Login To Your FOD Account</div>
          <div class="mobile-profile-empty__text">
            Your login, profile image and saved account stay in the same browser storage as the main web.
          </div>
          <div class="mobile-profile-empty__actions">
            <button class="mobile-profile-cta mobile-profile-cta--primary" type="button" data-mobile-auth-trigger="login">
              Login
            </button>
            <button class="mobile-profile-cta mobile-profile-cta--secondary" type="button" data-mobile-auth-trigger="signup">
              Sign Up
            </button>
          </div>
        </div>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    ${renderHeader('Profile', 'Same account state as the desktop web, with stored login and profile image.')}
    <section class="mobile-desktop-surface mobile-desktop-surface--profile">
      <div class="mobile-profile-desktop">
        <div class="mobile-profile-desktop__avatar-wrap">
          ${
            avatar
              ? `<img class="mobile-profile-desktop__avatar mobile-profile-desktop__avatar--image" src="${avatar}" alt="${escapeHtml(user.username)}" />`
              : `<div class="mobile-profile-desktop__avatar">${escapeHtml(getUserInitials(user))}</div>`
          }
          <input class="mobile-profile-avatar-input" data-mobile-profile-avatar-input type="file" accept="image/*" />
          <button class="mobile-profile-action mobile-profile-action--secondary" type="button" data-mobile-profile-avatar-trigger>
            Change Photo
          </button>
        </div>
        <div class="mobile-profile-desktop__copy">
          <div class="mobile-profile-desktop__name">${escapeHtml(String(user.username || 'FOD User').toUpperCase())}</div>
          <div class="mobile-profile-desktop__meta">@${escapeHtml(String(user.username || 'foduser').toLowerCase())}</div>
          <div class="mobile-profile-desktop__meta">${escapeHtml(user.email || '')}</div>
        </div>
      </div>
      <div class="mobile-profile-stats">
        <div class="mobile-profile-stat">
          <span class="mobile-profile-stat__count">${posts}</span>
          <span class="mobile-profile-stat__label">Posts</span>
        </div>
        <div class="mobile-profile-stat">
          <span class="mobile-profile-stat__count">${followers}</span>
          <span class="mobile-profile-stat__label">Followers</span>
        </div>
        <div class="mobile-profile-stat">
          <span class="mobile-profile-stat__count">${following}</span>
          <span class="mobile-profile-stat__label">Following</span>
        </div>
      </div>
      <div class="mobile-profile-cards">
        <div class="mobile-profile-card">
          <div class="mobile-profile-card__title">Account</div>
          <div class="mobile-profile-card__text">Logged in and stored on this device.</div>
        </div>
        <div class="mobile-profile-card">
          <div class="mobile-profile-card__title">Wallet</div>
          <div class="mobile-profile-card__text">Cardgame and profile use the same saved FOD account.</div>
        </div>
      </div>
      <div class="mobile-profile-actions">
        <button class="mobile-profile-action mobile-profile-action--primary" type="button" data-mobile-auth-trigger="login">
          Switch Account
        </button>
        <button class="mobile-profile-action mobile-profile-action--secondary" type="button" data-mobile-logout>
          Log Out
        </button>
      </div>
    </section>
  `;
};

export const renderSettingsView = (root) => {
  if (!root) return;

  const settings = loadMobileSettings();
  const accent = settings.accent || '#e7c84b';
  document.documentElement.style.setProperty('--ui-accent', accent);

  root.innerHTML = `
    ${renderHeader('Settings', 'Same settings sections as the main web, rebuilt for phone size.')}
    <section class="mobile-desktop-surface mobile-desktop-surface--settings">
      <div class="mobile-settings-grid">
        <div class="mobile-settings-card">
          <div class="mobile-settings-card__title">Account</div>
          <div class="mobile-settings-item">
            <span>Change username</span>
            <button class="mobile-settings-btn" type="button">Edit</button>
          </div>
          <div class="mobile-settings-item">
            <span>Change email</span>
            <button class="mobile-settings-btn" type="button">Edit</button>
          </div>
          <div class="mobile-settings-item">
            <span>Change password</span>
            <button class="mobile-settings-btn" type="button">Update</button>
          </div>
          <div class="mobile-settings-item">
            <span>Upload / change profile picture</span>
            <button class="mobile-settings-btn" type="button" data-mobile-profile-avatar-trigger>Choose</button>
          </div>
          <input class="mobile-profile-avatar-input" data-mobile-profile-avatar-input type="file" accept="image/*" />
          <div class="mobile-settings-item mobile-settings-item--danger">
            <span>Delete account</span>
            <button class="mobile-settings-btn mobile-settings-btn--danger" type="button">Delete</button>
          </div>
          <div class="mobile-settings-item">
            <span>Log out</span>
            <button class="mobile-settings-btn" type="button" data-mobile-logout>Log out</button>
          </div>
        </div>

        <div class="mobile-settings-card">
          <div class="mobile-settings-card__title">Notifications</div>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Match notifications</span>
            <input type="checkbox" data-mobile-setting="matchNotifications" ${settings.matchNotifications !== false ? 'checked' : ''} />
          </label>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Goal alerts for favorite teams</span>
            <input type="checkbox" data-mobile-setting="goalAlerts" ${settings.goalAlerts !== false ? 'checked' : ''} />
          </label>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Likes, comments, and new followers</span>
            <input type="checkbox" data-mobile-setting="socialNotifications" ${settings.socialNotifications !== false ? 'checked' : ''} />
          </label>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Direct message notifications</span>
            <input type="checkbox" data-mobile-setting="dmNotifications" ${settings.dmNotifications !== false ? 'checked' : ''} />
          </label>
        </div>

        <div class="mobile-settings-card">
          <div class="mobile-settings-card__title">Social Preferences</div>
          <div class="mobile-settings-item">
            <span>Manage blocked users</span>
            <button class="mobile-settings-btn" type="button">View</button>
          </div>
          <div class="mobile-settings-item">
            <span>Who can send direct messages</span>
            <select class="mobile-settings-select" data-mobile-setting="dmAudience">
              <option value="everyone" ${settings.dmAudience !== 'followers' ? 'selected' : ''}>Everyone</option>
              <option value="followers" ${settings.dmAudience === 'followers' ? 'selected' : ''}>Followers only</option>
            </select>
          </div>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Show follower count</span>
            <input type="checkbox" data-mobile-setting="showFollowerCount" ${settings.showFollowerCount !== false ? 'checked' : ''} />
          </label>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Show online status</span>
            <input type="checkbox" data-mobile-setting="showOnlineStatus" ${settings.showOnlineStatus ? 'checked' : ''} />
          </label>
        </div>

        <div class="mobile-settings-card">
          <div class="mobile-settings-card__title">Appearance</div>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Dark mode / Light mode</span>
            <input type="checkbox" data-mobile-setting="darkMode" ${settings.darkMode ? 'checked' : ''} />
          </label>
          <div class="mobile-settings-item mobile-settings-item--stack">
            <span>Accent color</span>
            <div class="mobile-settings-swatches">
              ${['#e7c84b', '#1aa356', '#d60b16', '#2e2fbf']
                .map(
                  (value) => `
                    <label class="mobile-settings-swatch" style="--swatch:${value}">
                      <input type="radio" name="mobile-accent" value="${value}" ${accent === value ? 'checked' : ''} />
                      <span></span>
                    </label>
                  `
                )
                .join('')}
            </div>
          </div>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Animations</span>
            <input type="checkbox" data-mobile-setting="animations" ${settings.animations !== false ? 'checked' : ''} />
          </label>
        </div>

        <div class="mobile-settings-card">
          <div class="mobile-settings-card__title">Favorites</div>
          <div class="mobile-settings-item">
            <span>Select favorite team</span>
            <select class="mobile-settings-select" data-mobile-setting="favoriteTeam">
              ${['Liverpool', 'Manchester City', 'Arsenal', 'Barcelona'].map((team) => `<option value="${team}" ${settings.favoriteTeam === team ? 'selected' : ''}>${team}</option>`).join('')}
            </select>
          </div>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Premier League</span>
            <input type="checkbox" data-mobile-setting="favoritePremier" ${settings.favoritePremier !== false ? 'checked' : ''} />
          </label>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Serie A</span>
            <input type="checkbox" data-mobile-setting="favoriteSerieA" ${settings.favoriteSerieA ? 'checked' : ''} />
          </label>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>LaLiga</span>
            <input type="checkbox" data-mobile-setting="favoriteLaLiga" ${settings.favoriteLaLiga ? 'checked' : ''} />
          </label>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Champions League</span>
            <input type="checkbox" data-mobile-setting="favoriteUcl" ${settings.favoriteUcl ? 'checked' : ''} />
          </label>
        </div>

        <div class="mobile-settings-card">
          <div class="mobile-settings-card__title">Privacy</div>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Public / Private profile</span>
            <input type="checkbox" data-mobile-setting="privateProfile" ${settings.privateProfile ? 'checked' : ''} />
          </label>
          <label class="mobile-settings-item mobile-settings-item--toggle">
            <span>Hide posts from non-followers</span>
            <input type="checkbox" data-mobile-setting="hidePosts" ${settings.hidePosts ? 'checked' : ''} />
          </label>
          <div class="mobile-settings-item">
            <span>Who can comment on posts</span>
            <select class="mobile-settings-select" data-mobile-setting="commentAudience">
              <option value="everyone" ${settings.commentAudience !== 'followers' && settings.commentAudience !== 'none' ? 'selected' : ''}>Everyone</option>
              <option value="followers" ${settings.commentAudience === 'followers' ? 'selected' : ''}>Followers only</option>
              <option value="none" ${settings.commentAudience === 'none' ? 'selected' : ''}>No one</option>
            </select>
          </div>
        </div>

        <div class="mobile-settings-card">
          <div class="mobile-settings-card__title">About</div>
          <div class="mobile-settings-item">
            <span>App version</span>
            <span class="mobile-settings-meta">v1.0.0</span>
          </div>
          <div class="mobile-settings-item"><button class="mobile-settings-link" type="button">Terms of service</button></div>
          <div class="mobile-settings-item"><button class="mobile-settings-link" type="button">Privacy policy</button></div>
          <div class="mobile-settings-item"><button class="mobile-settings-link" type="button">Contact / report issue</button></div>
        </div>
      </div>
    </section>
  `;

  root.querySelectorAll('input[data-mobile-setting], select[data-mobile-setting]').forEach((field) => {
    field.addEventListener('change', () => {
      const nextSettings = loadMobileSettings();
      nextSettings[field.dataset.mobileSetting] =
        field instanceof HTMLInputElement && field.type === 'checkbox' ? field.checked : field.value;
      saveMobileSettings(nextSettings);
    });
  });

  root.querySelectorAll('input[name="mobile-accent"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      if (!(radio instanceof HTMLInputElement) || !radio.checked) return;
      const nextSettings = loadMobileSettings();
      nextSettings.accent = radio.value;
      saveMobileSettings(nextSettings);
      document.documentElement.style.setProperty('--ui-accent', radio.value);
    });
  });
};
