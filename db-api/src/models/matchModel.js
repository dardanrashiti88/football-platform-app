function normalizeMatch(raw) {
  return {
    id: raw.id,
    competitionId: raw.competitionId,
    homeTeamId: raw.homeTeamId,
    awayTeamId: raw.awayTeamId,
    stage: raw.stage,
    groupName: raw.groupName || null,
    matchday: raw.matchday || null,
    matchDate: raw.matchDate,
    status: raw.status || 'scheduled',
    homeScore: raw.homeScore ?? null,
    awayScore: raw.awayScore ?? null,
  };
}

module.exports = { normalizeMatch };
