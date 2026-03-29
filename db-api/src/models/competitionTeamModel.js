function normalizeCompetitionTeam(raw) {
  return {
    competitionId: raw.competitionId,
    teamId: raw.teamId,
    groupName: raw.groupName || null,
    seedOrder: raw.seedOrder || null,
  };
}

module.exports = { normalizeCompetitionTeam };
