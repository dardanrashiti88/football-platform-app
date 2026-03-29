function normalizeStanding(raw) {
  return {
    competitionId: raw.competitionId,
    teamId: raw.teamId,
    stage: raw.stage || 'league',
    groupName: raw.groupName || null,
    rank: raw.rank || null,
    matchesPlayed: raw.matchesPlayed || 0,
    wins: raw.wins || 0,
    draws: raw.draws || 0,
    losses: raw.losses || 0,
    goalsFor: raw.goalsFor || 0,
    goalsAgainst: raw.goalsAgainst || 0,
    goalDifference: raw.goalDifference || 0,
    points: raw.points || 0,
  };
}

module.exports = { normalizeStanding };
