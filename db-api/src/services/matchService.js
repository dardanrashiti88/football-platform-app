function filterMatches(matches, filters = {}) {
  return matches.filter((match) => {
    if (filters.stage && match.stage !== filters.stage) {
      return false;
    }

    if (filters.matchday && Number(match.matchday) !== Number(filters.matchday)) {
      return false;
    }

    if (filters.teamId) {
      const teamId = String(filters.teamId);
      const hasTeam = String(match.homeTeamId) === teamId || String(match.awayTeamId) === teamId;
      if (!hasTeam) {
        return false;
      }
    }

    return true;
  });
}

module.exports = { filterMatches };
