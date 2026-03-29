function filterStandings(standings, filters = {}) {
  return standings
    .filter((row) => {
      if (filters.stage && row.stage !== filters.stage) {
        return false;
      }

      if (filters.group && row.groupName !== filters.group) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (a.rank === null || a.rank === undefined) return 1;
      if (b.rank === null || b.rank === undefined) return -1;
      return a.rank - b.rank;
    });
}

function calculateStandingsPlaceholder(matches) {
  return {
    supported: false,
    message: 'Dynamic standings calculation can live here once match data is provided.',
    sourceMatches: matches.length,
  };
}

module.exports = {
  filterStandings,
  calculateStandingsPlaceholder,
};
