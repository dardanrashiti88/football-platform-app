const { CACHE_TTL_MS } = require('../config/env');
const { normalizeCompetition } = require('../models/competitionModel');
const { normalizeTeam } = require('../models/teamModel');
const { normalizeCompetitionTeam } = require('../models/competitionTeamModel');
const { normalizeMatch } = require('../models/matchModel');
const { normalizeStanding } = require('../models/standingModel');
const { httpError } = require('../utils/httpError');
const { CacheService } = require('./cacheService');
const { loadCompetitionSeedBundle, listCompetitionSeedFolders } = require('./seedService');
const { filterMatches } = require('./matchService');
const { filterStandings } = require('./standingsService');

const cache = new CacheService(CACHE_TTL_MS);

async function listCompetitions() {
  const cached = cache.get('competitions:list');
  if (cached) {
    return cached;
  }

  const folders = await listCompetitionSeedFolders();
  const competitions = [];

  for (const folder of folders) {
    const bundle = await loadCompetitionSeedBundle(folder);
    if (bundle.competition && bundle.competition.slug) {
      competitions.push(normalizeCompetition(bundle.competition));
    }
  }

  competitions.sort((a, b) => a.name.localeCompare(b.name));
  return cache.set('competitions:list', competitions);
}

async function getCompetition(competitionId) {
  const competitions = await listCompetitions();
  const competition = competitions.find(
    (item) => String(item.id) === String(competitionId) || item.slug === competitionId
  );

  if (!competition) {
    throw httpError(404, `Competition not found for identifier: ${competitionId}`);
  }

  return competition;
}

async function getCompetitionBundle(competitionId) {
  const competition = await getCompetition(competitionId);
  const cacheKey = `competitions:bundle:${competition.slug}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const bundle = await loadCompetitionSeedBundle(competition.slug);
  const normalizedBundle = {
    competition,
    teams: bundle.teams.map(normalizeTeam),
    competitionTeams: bundle.competitionTeams.map(normalizeCompetitionTeam),
    matches: bundle.matches.map(normalizeMatch),
    standings: bundle.standings.map(normalizeStanding),
  };

  return cache.set(cacheKey, normalizedBundle);
}

async function getCompetitionTeams(competitionId) {
  const bundle = await getCompetitionBundle(competitionId);
  return bundle.teams;
}

async function getCompetitionMatches(competitionId, filters = {}) {
  const bundle = await getCompetitionBundle(competitionId);
  return filterMatches(bundle.matches, filters);
}

async function getCompetitionStandings(competitionId, filters = {}) {
  const bundle = await getCompetitionBundle(competitionId);
  return filterStandings(bundle.standings, filters);
}

module.exports = {
  listCompetitions,
  getCompetition,
  getCompetitionTeams,
  getCompetitionMatches,
  getCompetitionStandings,
};
