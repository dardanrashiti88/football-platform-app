import { emitEvent, onEvent } from '../core/events.js';
import { storage } from '../core/storage.js';
import { loadUser } from './auth.js';
import { pushMainNotification } from './notifications.js';

const GUEST_KEY = 'fodrFollows:guest';
const USER_PREFIX = 'fodrFollows:user:';

const state = {
  follows: {
    teams: [],
    players: []
  },
  initialized: false
};

const normalizeString = (value = '') =>
  String(value).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalizeKey = (value = '') => normalizeString(value).replace(/[^a-z0-9]/g, '');

const readJson = (key) => {
  try {
    const raw = storage.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJson = (key, value) => {
  storage.set(key, JSON.stringify(value));
};

const getScopeKey = (user = loadUser()) => {
  if (user?.id) return `${USER_PREFIX}${user.id}`;
  if (user?.email) return `${USER_PREFIX}${String(user.email).toLowerCase()}`;
  if (user?.username) return `${USER_PREFIX}${String(user.username).toLowerCase()}`;
  return GUEST_KEY;
};

const normalizeTeamFollow = (team = {}) => {
  const id = String(team.id || '').trim();
  return {
    id,
    name: String(team.name || team.shortName || '').trim() || id,
    shortName: String(team.shortName || team.name || '').trim() || id,
    leagueKey: String(team.leagueKey || '').trim(),
    logo: String(team.logo || '').trim()
  };
};

const normalizePlayerFollow = (player = {}) => {
  const name = String(player.name || '').trim();
  const key = String(player.key || normalizeKey(name)).trim();
  return {
    key,
    name: name || key,
    teamId: String(player.teamId || '').trim(),
    teamName: String(player.teamName || '').trim(),
    leagueKey: String(player.leagueKey || '').trim(),
    photo: String(player.photo || '').trim()
  };
};

const normalizeFollowState = (raw = {}) => ({
  teams: Array.isArray(raw.teams)
    ? raw.teams.map(normalizeTeamFollow).filter((team) => team.id)
    : [],
  players: Array.isArray(raw.players)
    ? raw.players.map(normalizePlayerFollow).filter((player) => player.key)
    : []
});

const applyFollows = (follows, { emit = true } = {}) => {
  state.follows = normalizeFollowState(follows);
  writeJson(getScopeKey(), state.follows);
  if (emit) {
    emitEvent('fodr:follows', { follows: state.follows });
  }
  return state.follows;
};

const loadForCurrentScope = () => {
  const scoped = readJson(getScopeKey());
  applyFollows(scoped || { teams: [], players: [] }, { emit: false });
};

const formatMatchDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'soon';
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const buildFixtureNotificationId = (teamId, fixture = {}) =>
  [
    'follow-team-fixture',
    teamId,
    normalizeKey(fixture.matchDate || fixture.date || ''),
    normalizeKey(fixture.opponentName || fixture.homeTeam || fixture.awayTeam || ''),
    normalizeKey(fixture.competition || fixture.competitionId || '')
  ].join(':');

const buildMatchKey = (match = {}, homeTeam = {}, awayTeam = {}) =>
  [
    normalizeKey(match.id || ''),
    normalizeKey(match.competitionId || match.competition || ''),
    normalizeKey(match.matchDate || match.date || ''),
    normalizeKey(homeTeam.id || homeTeam.name || ''),
    normalizeKey(awayTeam.id || awayTeam.name || '')
  ]
    .filter(Boolean)
    .join(':');

export const getFollows = () => state.follows;

export const getFollowedTeams = () => state.follows.teams;

export const getFollowedPlayers = () => state.follows.players;

export const isTeamFollowed = (teamId = '') =>
  state.follows.teams.some((team) => normalizeKey(team.id) === normalizeKey(teamId));

export const isPlayerFollowed = (playerKeyOrName = '') => {
  const key = normalizeKey(playerKeyOrName);
  return state.follows.players.some((player) => normalizeKey(player.key || player.name) === key);
};

export const toggleTeamFollow = (team = {}) => {
  const normalized = normalizeTeamFollow(team);
  if (!normalized.id) return false;
  const already = isTeamFollowed(normalized.id);
  const follows = already
    ? {
        ...state.follows,
        teams: state.follows.teams.filter((entry) => normalizeKey(entry.id) !== normalizeKey(normalized.id))
      }
    : {
        ...state.follows,
        teams: [normalized, ...state.follows.teams.filter((entry) => normalizeKey(entry.id) !== normalizeKey(normalized.id))]
      };
  applyFollows(follows);
  pushMainNotification({
    id: `follow-team-toggle:${normalized.id}:${already ? 'off' : 'on'}`,
    title: already ? 'Team Unfollowed' : 'Team Followed',
    message: already
      ? `${normalized.name} has been removed from your follow list.`
      : `${normalized.name} will now send you match-related updates in this browser.`,
    category: 'Teams'
  });
  return !already;
};

export const togglePlayerFollow = (player = {}) => {
  const normalized = normalizePlayerFollow(player);
  if (!normalized.key) return false;
  const already = isPlayerFollowed(normalized.key);
  const follows = already
    ? {
        ...state.follows,
        players: state.follows.players.filter((entry) => normalizeKey(entry.key) !== normalizeKey(normalized.key))
      }
    : {
        ...state.follows,
        players: [
          normalized,
          ...state.follows.players.filter((entry) => normalizeKey(entry.key) !== normalizeKey(normalized.key))
        ]
      };
  applyFollows(follows);
  pushMainNotification({
    id: `follow-player-toggle:${normalized.key}:${already ? 'off' : 'on'}`,
    title: already ? 'Player Unfollowed' : 'Player Followed',
    message: already
      ? `${normalized.name} has been removed from your follow list.`
      : `${normalized.name} will now send you lineup, goal, and assist alerts when that data is loaded.`,
    category: 'Players'
  });
  return !already;
};

export const notifyNextFixtureForTeam = (team = {}, fixtures = []) => {
  const normalized = normalizeTeamFollow(team);
  if (!normalized.id || !isTeamFollowed(normalized.id) || !Array.isArray(fixtures) || !fixtures.length) return;

  const now = Date.now();
  const nextFixture = fixtures
    .map((fixture) => ({
      ...fixture,
      dateObj: fixture.dateObj instanceof Date ? fixture.dateObj : new Date(fixture.matchDate || fixture.date || '')
    }))
    .filter((fixture) => fixture.dateObj instanceof Date && !Number.isNaN(fixture.dateObj.getTime()))
    .filter((fixture) => fixture.dateObj.getTime() >= now)
    .sort((left, right) => left.dateObj.getTime() - right.dateObj.getTime())[0];

  if (!nextFixture) return;

  pushMainNotification({
    id: buildFixtureNotificationId(normalized.id, nextFixture),
    title: `${normalized.shortName || normalized.name} Match Alert`,
    message: `${normalized.name} face ${nextFixture.opponentName || 'their next opponent'} on ${formatMatchDate(nextFixture.dateObj)}${
      nextFixture.competition ? ` in ${nextFixture.competition}` : ''
    }.`,
    category: 'Matches'
  });
};

export const notifyFollowSignalsFromMatch = ({
  match = {},
  leagueKey = '',
  homeTeam = {},
  awayTeam = {},
  homeLineup = {},
  awayLineup = {},
  matchStats = {}
} = {}) => {
  const matchKey = buildMatchKey(match, homeTeam, awayTeam);
  if (!matchKey) return;

  const followedTeams = getFollowedTeams();
  const involvedTeam = followedTeams.find(
    (team) =>
      normalizeKey(team.id) === normalizeKey(homeTeam.id) || normalizeKey(team.id) === normalizeKey(awayTeam.id)
  );

  if (involvedTeam) {
    pushMainNotification({
      id: `follow-team-lineup:${involvedTeam.id}:${matchKey}`,
      title: `${involvedTeam.name} Lineup Available`,
      message: `${homeTeam.name || 'Home side'} vs ${awayTeam.name || 'Away side'} now has lineups loaded.`,
      category: 'Matches'
    });
  }

  const followedPlayers = getFollowedPlayers();
  if (!followedPlayers.length) return;

  const starters = [...(homeLineup.starters || []), ...(awayLineup.starters || [])].filter(Boolean);
  const bench = [...(homeLineup.bench || []), ...(awayLineup.bench || [])].filter(Boolean);
  followedPlayers.forEach((player) => {
    const playerKey = normalizeKey(player.key || player.name);
    const starter = starters.find(
      (entry) => normalizeKey(entry.name) === playerKey || normalizeKey(entry.name) === normalizeKey(player.name)
    );
    const benchPlayer = !starter
      ? bench.find(
          (entry) => normalizeKey(entry.name) === playerKey || normalizeKey(entry.name) === normalizeKey(player.name)
        )
      : null;

    if (starter) {
      pushMainNotification({
        id: `follow-player-lineup:${player.key}:${matchKey}`,
        title: `${player.name} Starts`,
        message: `${player.name} is in the lineup for ${homeTeam.name || 'today'} vs ${awayTeam.name || 'today'}.`,
        category: 'Players'
      });
    } else if (benchPlayer) {
      pushMainNotification({
        id: `follow-player-squad:${player.key}:${matchKey}`,
        title: `${player.name} In The Squad`,
        message: `${player.name} is on the bench for ${homeTeam.name || 'today'} vs ${awayTeam.name || 'today'}.`,
        category: 'Players'
      });
    }

    const homeEvents = Array.isArray(matchStats.homeEvents) ? matchStats.homeEvents : [];
    const awayEvents = Array.isArray(matchStats.awayEvents) ? matchStats.awayEvents : [];
    [...homeEvents, ...awayEvents].forEach((event, index) => {
      if (normalizeKey(event.scorer) === playerKey || normalizeKey(event.scorer) === normalizeKey(player.name)) {
        pushMainNotification({
          id: `follow-player-goal:${player.key}:${matchKey}:${index}:${normalizeKey(event.minute)}`,
          title: `${player.name} Scored`,
          message: `${player.name} scored in ${homeTeam.name || 'the match'} vs ${awayTeam.name || 'the match'} at ${event.minute}'.`,
          category: 'Players'
        });
      }
      if (normalizeKey(event.assist) === playerKey || normalizeKey(event.assist) === normalizeKey(player.name)) {
        pushMainNotification({
          id: `follow-player-assist:${player.key}:${matchKey}:${index}:${normalizeKey(event.minute)}`,
          title: `${player.name} Assisted`,
          message: `${player.name} assisted a goal in ${homeTeam.name || 'the match'} vs ${awayTeam.name || 'the match'}.`,
          category: 'Players'
        });
      }
    });
  });
};

export const initFollows = () => {
  if (state.initialized) return;
  state.initialized = true;
  loadForCurrentScope();

  onEvent('fodr:user', () => {
    loadForCurrentScope();
    emitEvent('fodr:follows', { follows: state.follows });
  });

  onEvent('fodr:logout', () => {
    loadForCurrentScope();
    emitEvent('fodr:follows', { follows: state.follows });
  });
};
