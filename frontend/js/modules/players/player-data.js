const PLAYER_PROFILE_LIBRARY = {
  alexanderisak: {
    animationTeamId: 'liverpool',
    preferredFoot: 'Right',
    height: '1.92 m',
    marketValue: 'N/A',
    positionMap: ['st'],
    currentSeasonOverrides: {
      appearances: '16',
      rating: 'N/A'
    },
    trophies: [{ title: 'Copa del Rey', season: '19/20', count: '1' }],
    seasons: [
      { season: '20/21', club: 'Real Sociedad' },
      { season: '21/22', club: 'Real Sociedad' },
      { season: '22/23', club: 'Newcastle United' },
      { season: '23/24', club: 'Newcastle United' },
      { season: '24/25', club: 'Newcastle United' },
      { season: '25/26', club: 'Liverpool' }
    ]
  }
};

const PLAYER_NAME_DISPLAY_OVERRIDES = {
  alexisak: 'Alexander Isak'
};

const PLAYER_NAME_MATCH_ALIASES = {
  alexanderisak: ['alexisak'],
  alexisak: ['alexanderisak']
};

const INVALID_STAT_MARKERS = new Set(['?', 'n/a', 'na', 'null', 'none', 'undefined', 'no']);

export const normalizeString = (value = '') =>
  String(value).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const normalizeKey = (value = '') => normalizeString(value).replace(/[^a-z0-9]/g, '');

const isMeaningfulStat = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return false;
  return !INVALID_STAT_MARKERS.has(text.toLowerCase());
};

export const formatStatValue = (value, fallback = '—') => {
  const text = String(value ?? '').trim();
  if (!isMeaningfulStat(text)) return fallback;
  return text;
};

export const parseStatNumber = (value) => {
  const text = String(value ?? '')
    .replace(/,/g, '')
    .trim();
  if (!isMeaningfulStat(text)) return null;
  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed : null;
};

export const playerProfileKey = (name = '') => normalizeKey(name);

export const getPlayerDisplayNameOverride = (name = '') => {
  const key = normalizeKey(name);
  return PLAYER_NAME_DISPLAY_OVERRIDES[key] || String(name || '').trim();
};

export const findRosterPlayer = (roster = [], playerName = '') => {
  const wanted = normalizeString(playerName);
  if (!wanted) return null;
  const wantedKey = normalizeKey(playerName);
  const acceptedKeys = new Set([wantedKey, ...(PLAYER_NAME_MATCH_ALIASES[wantedKey] || [])]);
  return (
    roster.find((player) => {
      const playerKey = normalizeKey(player.name);
      return acceptedKeys.has(playerKey);
    }) || null
  );
};

const computeGoalContributions = (player, fallback = '—') => {
  const direct = String(player?.goalContributions || '').trim();
  if (isMeaningfulStat(direct)) return direct;
  const goals = Number.parseInt(player?.goals, 10);
  const assists = Number.parseInt(player?.assists, 10);
  if (Number.isFinite(goals) || Number.isFinite(assists)) {
    return String((Number.isFinite(goals) ? goals : 0) + (Number.isFinite(assists) ? assists : 0));
  }
  return fallback;
};

const normalizeMetricForProfile = (value, { allowZero = true } = {}) => {
  if (!isMeaningfulStat(value)) return 'N/A';
  const text = String(value).trim();
  if (!allowZero && parseStatNumber(text) === 0) return 'N/A';
  return text;
};

const buildPlayerPulse = (player = {}, position = '') => {
  const appearances = parseStatNumber(player.appearances) || 0;
  const goals = parseStatNumber(player.goals) || 0;
  const assists = parseStatNumber(player.assists) || 0;
  const minutes = parseStatNumber(player.minutes) || 0;
  const cleanSheets = parseStatNumber(player.cleanSheets) || 0;
  const yellow = parseStatNumber(player.yellow) || 0;
  const red = parseStatNumber(player.red) || 0;
  const appearanceBase = Math.max(appearances, 1);
  const minutesPerAppearance = appearances > 0 && minutes > 0 ? Math.round(minutes / appearances) : null;
  const isKeeper = normalizeString(position).includes('keeper') || normalizeString(position).includes('gk');
  const attackBase = isKeeper ? cleanSheets * 10 : goals * 16;
  const creationBase = isKeeper ? 0 : assists * 14;
  const availabilityBase = appearances * 4 + Math.min(minutes / 18, 40);
  const disciplineBase = Math.max(0, 100 - yellow * 8 - red * 28);
  const momentumBase = Math.max(
    35,
    Math.min(96, 44 + ((attackBase + creationBase) / appearanceBase) * 7 + Math.min(appearances, 20) * 1.2 - yellow * 1.8 - red * 7)
  );

  const buildLevel = (value) => Math.max(22, Math.min(98, Math.round(value)));
  const levels = [
    buildLevel(momentumBase - 8),
    buildLevel(momentumBase - 2),
    buildLevel(momentumBase + 3),
    buildLevel(momentumBase - 1),
    buildLevel(momentumBase + 6)
  ];

  const summary =
    momentumBase >= 82
      ? 'Red hot'
      : momentumBase >= 68
        ? 'Sharp'
        : momentumBase >= 56
          ? 'Steady'
          : 'Finding rhythm';

  return {
    summary,
    levels,
    metrics: [
      { label: isKeeper ? 'Shot Stop' : 'Threat', value: buildLevel(isKeeper ? cleanSheets * 8 + 36 : goals * 12 + 34) },
      { label: isKeeper ? 'Claiming' : 'Creation', value: buildLevel(isKeeper ? appearances * 2.4 + 28 : assists * 14 + 28) },
      { label: 'Load', value: buildLevel(availabilityBase) },
      { label: 'Discipline', value: buildLevel(disciplineBase) }
    ],
    minutesPerAppearance: minutesPerAppearance ? `${minutesPerAppearance} mins/app` : 'Minutes trend unavailable'
  };
};

export const POSITION_MAP_LAYOUT = [
  { key: 'gk', label: 'GK', x: 50, y: 92, roles: ['gk'] },
  { key: 'lb', label: 'LB', x: 15, y: 72, roles: ['lb'] },
  { key: 'cb1', label: 'CB', x: 38, y: 76, roles: ['cb'] },
  { key: 'cb2', label: 'CB', x: 62, y: 76, roles: ['cb'] },
  { key: 'rb', label: 'RB', x: 85, y: 72, roles: ['rb'] },
  { key: 'cm1', label: 'CM', x: 30, y: 52, roles: ['cm', 'dm'] },
  { key: 'cm2', label: 'CM', x: 70, y: 52, roles: ['cm', 'dm'] },
  { key: 'cam', label: 'CAM', x: 50, y: 35, roles: ['am'] },
  { key: 'lw', label: 'LW', x: 15, y: 18, roles: ['lw'] },
  { key: 'st', label: 'ST', x: 50, y: 10, roles: ['st'] },
  { key: 'rw', label: 'RW', x: 85, y: 18, roles: ['rw'] }
];

const resolvePositionMap = (profile = {}) => {
  if (Array.isArray(profile.positionMap) && profile.positionMap.length) return profile.positionMap;
  const position = normalizeString(profile.position);
  if (position.includes('keeper') || position.includes('gk')) return ['gk'];
  if (position.includes('wing')) return ['lw', 'rw'];
  if (position.includes('striker') || position.includes('forward') || position.includes('fwd')) return ['st'];
  if (position.includes('attacking')) return ['am'];
  if (position.includes('fullback') || position.includes('wing-back') || position.includes('back')) return ['lb', 'rb'];
  if (position.includes('centre-back') || position.includes('center-back') || position.includes('def')) return ['cb'];
  if (position.includes('mid')) return ['cm'];
  return ['cm'];
};

const buildPlayerSeasonEntries = (player, team, profile) => {
  const currentClub = team?.name || profile?.seasons?.at(-1)?.club || 'Current Club';
  const currentSeasonSource = {
    ...player,
    ...(profile?.currentSeasonOverrides || {})
  };
  const currentSeason = {
    season: '25/26',
    club: currentClub,
    appearances: normalizeMetricForProfile(currentSeasonSource?.appearances),
    goals: normalizeMetricForProfile(currentSeasonSource?.goals),
    assists: normalizeMetricForProfile(currentSeasonSource?.assists),
    minutes: normalizeMetricForProfile(currentSeasonSource?.minutes, { allowZero: false }),
    goalContributions: formatStatValue(
      profile?.currentSeasonOverrides?.goalContributions ?? computeGoalContributions(currentSeasonSource, 'N/A'),
      'N/A'
    ),
    rating: normalizeMetricForProfile(currentSeasonSource?.rating)
  };

  if (!profile?.seasons?.length) return [currentSeason];

  return profile.seasons.map((entry) => {
    if (entry.season === currentSeason.season) {
      return {
        ...entry,
        club: entry.club || currentSeason.club,
        appearances: currentSeason.appearances,
        goals: currentSeason.goals,
        assists: currentSeason.assists,
        minutes: currentSeason.minutes,
        goalContributions: currentSeason.goalContributions,
        rating: currentSeason.rating
      };
    }
    return {
      appearances: 'N/A',
      goals: 'N/A',
      assists: 'N/A',
      minutes: 'N/A',
      goalContributions: 'N/A',
      rating: 'N/A',
      ...entry
    };
  });
};

export const createPlayerProfileData = ({
  player,
  team,
  leagueKey,
  teams = [],
  getFlagUrl,
  getLogoForTeam
}) => {
  const profile = PLAYER_PROFILE_LIBRARY[playerProfileKey(player?.name)] || null;
  const flagUrl = getFlagUrl(player?.nationality);
  const seasons = buildPlayerSeasonEntries(player, team, profile);
  const currentSeason = seasons.at(-1) || seasons[0] || null;
  const logoTeamId = profile?.animationTeamId || team?.id || '';
  const logoTeam =
    (team?.id && normalizeKey(team.id) === normalizeKey(logoTeamId) ? team : null) ||
    teams.find((entry) => entry.id === logoTeamId) ||
    team ||
    null;
  const pulse = buildPlayerPulse(player, player?.position || profile?.position || '');
  const positionMap = resolvePositionMap({
    position: player?.position,
    positionMap: profile?.positionMap
  });

  return {
    key: playerProfileKey(player?.name),
    name: player?.name || 'Player',
    position: player?.position || '—',
    nationality: player?.nationality || '—',
    age: formatStatValue(player?.age),
    flagUrl,
    teamId: team?.id || '',
    teamName: team?.name || team?.shortName || '',
    teamLogo: getLogoForTeam(logoTeam, leagueKey),
    leagueKey,
    photo: player?.photo || '',
    notes: player?.notes || '',
    preferredFoot: profile?.preferredFoot || 'N/A',
    height: profile?.height || 'N/A',
    marketValue: profile?.marketValue || 'N/A',
    shirtNumber: formatStatValue(player?.number, 'N/A'),
    homeGrown: formatStatValue(player?.homeGrown, 'N/A'),
    positionMap,
    trophies: Array.isArray(profile?.trophies) ? profile.trophies : [],
    pulse,
    seasons,
    currentSeason: currentSeason || {
      season: '25/26',
      club: team?.name || 'Current Club',
      appearances: 'N/A',
      goals: 'N/A',
      assists: 'N/A',
      minutes: 'N/A',
      goalContributions: 'N/A',
      rating: 'N/A'
    }
  };
};
