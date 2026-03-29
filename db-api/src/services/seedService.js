const { COMPETITIONS_DIR } = require('../config/env');
const { buildCompetitionFilePath, listDirectories, readJson } = require('../utils/fileStore');

async function listCompetitionSeedFolders() {
  return listDirectories(COMPETITIONS_DIR);
}

async function loadCompetitionSeedBundle(slug) {
  return {
    competition: await readJson(buildCompetitionFilePath(COMPETITIONS_DIR, slug, 'competition.json'), {}),
    teams: await readJson(buildCompetitionFilePath(COMPETITIONS_DIR, slug, 'teams.json'), []),
    competitionTeams: await readJson(buildCompetitionFilePath(COMPETITIONS_DIR, slug, 'competition-teams.json'), []),
    matches: await readJson(buildCompetitionFilePath(COMPETITIONS_DIR, slug, 'matches.json'), []),
    standings: await readJson(buildCompetitionFilePath(COMPETITIONS_DIR, slug, 'standings.json'), []),
  };
}

module.exports = {
  listCompetitionSeedFolders,
  loadCompetitionSeedBundle,
};
