export const ensurePlayerCompareIndex = async ({ currentIndex, loadPlayersIndex }) => {
  if (Array.isArray(currentIndex)) return currentIndex;
  const entries = await loadPlayersIndex();
  return Array.isArray(entries) ? entries : [];
};

export const getPlayerCompareResults = ({
  query,
  compareIndex,
  profileKey,
  normalizeSearchText,
  playerProfileKey,
  normalizeKey
}) => {
  const clean = normalizeSearchText(query);
  if (!clean || !Array.isArray(compareIndex)) return [];

  const seen = new Set();
  return compareIndex
    .filter((entry) => {
      const entryKey = playerProfileKey(entry.name);
      if (entryKey === profileKey) return false;
      const haystack = normalizeSearchText(`${entry.name} ${entry.teamName || ''} ${entry.leagueLabel || ''}`);
      if (!haystack.includes(clean)) return false;
      const dedupeKey = `${entryKey}:${normalizeKey(entry.teamId)}:${entry.leagueKey}`;
      if (seen.has(dedupeKey)) return false;
      seen.add(dedupeKey);
      return true;
    })
    .slice(0, 8);
};

export const resolveCompareTeam = async (entry, { activeLeague, activeTeams, loadTeamsList, normalizeKey }) => {
  const teams = entry.leagueKey === activeLeague && activeTeams.length
    ? activeTeams
    : await loadTeamsList(entry.leagueKey);

  return (
    teams.find((team) =>
      [team.id, team.name, team.shortName]
        .map((value) => normalizeKey(value))
        .includes(normalizeKey(entry.teamId || entry.teamName || ''))
    )
    || teams.find((team) => normalizeKey(team.name || team.shortName || team.id) === normalizeKey(entry.teamName || ''))
    || {
      id: entry.teamId || normalizeKey(entry.teamName || entry.name),
      name: entry.teamName || 'Club',
      shortName: entry.teamName || 'Club'
    }
  );
};

export const resolveComparePlayerProfile = async (entry, deps) => {
  const {
    activeLeague,
    activeTeams,
    loadTeamsList,
    normalizeKey,
    loadRosterForTeam,
    findRosterPlayer,
    loadPlayersListForLeague,
    playerBelongsToTeam,
    playerProfileKey,
    buildPlayerProfileData
  } = deps;

  const team = await resolveCompareTeam(entry, {
    activeLeague,
    activeTeams,
    loadTeamsList,
    normalizeKey
  });

  let player = null;

  try {
    const roster = await loadRosterForTeam(team, entry.leagueKey);
    player = findRosterPlayer(roster, entry.name);
  } catch (error) {
    console.warn('Unable to load compare roster', error);
  }

  if (!player) {
    const players = await loadPlayersListForLeague(entry.leagueKey);
    player = players.find(
      (candidate) =>
        playerProfileKey(candidate?.name) === playerProfileKey(entry.name) && playerBelongsToTeam(candidate, team)
    );
  }

  const safePlayer = {
    name: entry.name,
    position: '',
    number: '',
    nationality: '',
    age: '',
    appearances: '',
    goals: '',
    assists: '',
    goalContributions: '',
    minutes: '',
    cleanSheets: '',
    yellow: '',
    red: '',
    homeGrown: '',
    notes: '',
    photo: entry.photo || '',
    ...(player || {})
  };

  if (!safePlayer.photo && entry.photo) safePlayer.photo = entry.photo;
  return buildPlayerProfileData(safePlayer, team, entry.leagueKey);
};

export const focusPlayerCompareInput = (playersGrid) => {
  requestAnimationFrame(() => {
    const input = playersGrid.querySelector('[data-action="player-compare-query"]');
    if (input instanceof HTMLInputElement) {
      input.focus();
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }
  });
};
