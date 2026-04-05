const buildSquadCardElement = (player, activeTeamId, helpers) => {
  const { createTextElement, getFlagUrl, getInitials } = helpers;
  const number = player.number ? String(player.number) : '';
  const stats = [
    player.appearances ? `APP ${player.appearances}` : null,
    player.goals ? `G ${player.goals}` : null,
    player.assists ? `A ${player.assists}` : null
  ].filter(Boolean);
  const flagUrl = getFlagUrl(player.nationality);
  const card = createTextElement('article', 'squad-card');
  card.dataset.action = 'open-player-profile';
  card.dataset.playerName = player.name || '';
  card.dataset.teamId = activeTeamId || '';
  card.tabIndex = 0;
  const photo = createTextElement('div', 'squad-photo');
  if (player.photo) {
    const image = document.createElement('img');
    image.src = player.photo;
    image.alt = player.name || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    photo.appendChild(image);
  } else {
    photo.appendChild(createTextElement('span', 'squad-photo-fallback', getInitials(player.name)));
  }

  const info = createTextElement('div', 'squad-info');
  info.appendChild(createTextElement('div', 'squad-name', player.name || '-'));

  const meta = createTextElement('div', 'squad-meta');
  if (flagUrl) {
    const flag = document.createElement('img');
    flag.className = 'squad-flag';
    flag.src = flagUrl;
    flag.alt = player.nationality || '';
    meta.appendChild(flag);
  }
  meta.appendChild(createTextElement('span', '', player.nationality || '-'));
  meta.appendChild(createTextElement('span', '', player.position || '-'));
  info.appendChild(meta);

  if (stats.length) {
    const statsWrap = createTextElement('div', 'squad-stats');
    stats.forEach((stat) => statsWrap.appendChild(createTextElement('span', '', stat)));
    info.appendChild(statsWrap);
  }

  card.append(photo, info);
  if (number) {
    card.appendChild(createTextElement('div', 'squad-number', number));
  }
  return card;
};

const buildSquadColumnElement = (title, players, activeTeamId, helpers) => {
  const { createTextElement } = helpers;
  const column = createTextElement('div', 'squad-column');
  column.appendChild(createTextElement('div', 'squad-column-title', title));
  const list = createTextElement('div', 'squad-list');
  if (players.length) {
    players.forEach((player) => list.appendChild(buildSquadCardElement(player, activeTeamId, helpers)));
  } else {
    list.appendChild(createTextElement('div', 'squad-empty', 'No players'));
  }
  column.appendChild(list);
  return column;
};

const buildFixtureCardElement = (fixture, team, options, helpers) => {
  const { activeLeague, activeTab, vsDesignUrl } = options;
  const { createTextElement, formatFixtureDate, formatFixtureTime, getInitials, getLogoForTeam, normalizeString, toDateSafe } = helpers;
  const dateObj = fixture.dateObj || toDateSafe(fixture.matchDate);
  const timeText = formatFixtureTime(dateObj);
  const dateText = formatFixtureDate(dateObj);
  const opponent = fixture.opponentName || '';
  const opponentLogo = fixture.opponentLogo;
  const teamLogo = team ? getLogoForTeam(team, activeLeague) : null;
  const teamName = team?.shortName || team?.name || '';
  const isTottenham = (value) => normalizeString(value).includes('tottenham');
  const isOpponentTottenham = isTottenham(opponent);
  const isTeamTottenham = team?.id === 'tottenham-hotspur' || isTottenham(teamName);
  const makeAbbr = (value) => {
    const clean = normalizeString(value).replace(/[^a-z0-9 ]/g, '');
    if (!clean) return 'TBD';
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 3) return parts.slice(0, 3).map((p) => p[0]).join('').toUpperCase();
    if (parts.length === 2) {
      const combo = (parts[0][0] + parts[1][0] + parts[1][1]).toUpperCase();
      if (combo.length === 3) return combo;
      return (parts[0][0] + parts[1][0] + (parts[0][1] || '')).toUpperCase().slice(0, 3);
    }
    return clean.slice(0, 3).toUpperCase();
  };
  const opponentLabel = activeTab === 'fixtures' ? (opponent || 'TBD') : makeAbbr(opponent);
  const teamLabel = activeTab === 'fixtures' ? (teamName || 'TBD') : makeAbbr(teamName);
  const hasScore =
    Number.isFinite(fixture.opponentScore) && Number.isFinite(fixture.teamScore) && fixture.status === 'completed';
  const compKey = `${fixture.competitionId || ''} ${fixture.competition || ''}`.toLowerCase();
  const fixtureTone = compKey.includes('champions') || compKey.includes('ucl')
    ? 'cl'
    : compKey.includes('fa cup') || compKey.includes('fa-cup')
      ? 'fa'
      : 'league';
  const card = createTextElement('div', 'team-fixture-card');

  if (fixture.competitionLogo) {
    const compLogo = document.createElement('img');
    compLogo.className = 'fixture-comp-logo';
    compLogo.src = fixture.competitionLogo;
    compLogo.alt = fixture.competition || '';
    card.appendChild(compLogo);
  }

  const buildFixtureTeam = ({ logoSrc, darkLogo, altText, label, right = false }) => {
    const teamEl = createTextElement('div', `fixture-team${right ? ' right' : ''}`);
    if (logoSrc) {
      const img = document.createElement('img');
      img.src = logoSrc;
      img.alt = altText || '';
      if (darkLogo) img.classList.add('fixture-logo--dark');
      teamEl.appendChild(img);
    } else {
      teamEl.appendChild(createTextElement('span', 'fixture-logo-fallback', getInitials(altText)));
    }
    teamEl.appendChild(createTextElement('span', '', label));
    return teamEl;
  };

  card.appendChild(
    buildFixtureTeam({
      logoSrc: opponentLogo,
      darkLogo: isOpponentTottenham,
      altText: opponent,
      label: opponentLabel
    })
  );

  const vs = createTextElement('div', 'fixture-vs');
  if (hasScore) {
    const score = createTextElement('div', 'fixture-score');
    score.appendChild(createTextElement('span', '', String(fixture.opponentScore)));
    score.appendChild(createTextElement('span', 'score-dash', '-'));
    score.appendChild(createTextElement('span', '', String(fixture.teamScore)));
    vs.appendChild(score);
  } else {
    const vsImg = document.createElement('img');
    vsImg.src = vsDesignUrl;
    vsImg.alt = 'VS';
    vs.appendChild(vsImg);
  }
  card.appendChild(vs);

  card.appendChild(
    buildFixtureTeam({
      logoSrc: teamLogo,
      darkLogo: isTeamTottenham,
      altText: teamName,
      label: teamLabel,
      right: true
    })
  );

  const time = createTextElement('div', `fixture-time fixture-time--${fixtureTone}`);
  time.appendChild(createTextElement('span', 'fixture-clock', timeText));
  time.appendChild(createTextElement('span', 'fixture-date', dateText));
  card.appendChild(time);

  return card;
};

const buildStandingsTableElement = (leagueKey, title, standings, teamsList, highlightId, helpers) => {
  const { competitionLogos, createTextElement, getLeagueConfig, getLogoForTeam, normalizeKey } = helpers;
  if (!standings?.length) {
    return createTextElement('div', 'team-table-empty', 'Table data unavailable.');
  }
  const teamsById = new Map((teamsList || []).map((team) => [team.id, team]));
  const config = getLeagueConfig(leagueKey);
  const compLogo = competitionLogos[leagueKey];
  const card = createTextElement('div', 'team-table-card');
  const leagueClass = normalizeKey(leagueKey);
  if (leagueClass) card.classList.add(`league-${leagueClass}`);

  const titleEl = createTextElement('div', 'team-table-title');
  if (compLogo) {
    const img = document.createElement('img');
    img.src = compLogo;
    img.alt = title;
    titleEl.appendChild(img);
  }
  titleEl.appendChild(createTextElement('span', '', title));
  card.appendChild(titleEl);

  const table = createTextElement('div', 'team-table');
  const header = createTextElement('div', 'team-table-row header');
  [
    ['rank', '#'],
    ['team', 'Team'],
    ['', 'P'],
    ['', 'W'],
    ['', 'D'],
    ['', 'L'],
    ['', 'GF'],
    ['', 'GA'],
    ['', 'GD'],
    ['pts', 'Pts']
  ].forEach(([className, label]) => {
    header.appendChild(createTextElement('div', `team-table-cell${className ? ` ${className}` : ''}`, label));
  });
  table.appendChild(header);

  standings.forEach((row) => {
    const team = teamsById.get(row.teamId);
    const name = team?.shortName || team?.name || row.teamId;
    const logo = team ? getLogoForTeam(team, leagueKey) : config?.teamLogos?.[row.teamId];
    const isTeam = row.teamId === highlightId;
    const rowEl = createTextElement('div', `team-table-row${isTeam ? ' is-team' : ''}`);
    rowEl.appendChild(createTextElement('div', 'team-table-cell rank', row.rank ?? '-'));

    const teamCell = createTextElement('div', 'team-table-cell team');
    if (logo) {
      const img = document.createElement('img');
      img.src = logo;
      img.alt = name || '';
      teamCell.appendChild(img);
    } else {
      teamCell.appendChild(createTextElement('span', 'team-logo-fallback'));
    }
    teamCell.appendChild(createTextElement('span', '', name));
    rowEl.appendChild(teamCell);

    [
      row.matchesPlayed ?? '-',
      row.wins ?? '-',
      row.draws ?? '-',
      row.losses ?? '-',
      row.goalsFor ?? '-',
      row.goalsAgainst ?? '-',
      row.goalDifference ?? '-'
    ].forEach((value) => rowEl.appendChild(createTextElement('div', 'team-table-cell', value)));
    rowEl.appendChild(createTextElement('div', 'team-table-cell pts', row.points ?? '-'));
    table.appendChild(rowEl);
  });

  card.appendChild(table);
  return card;
};

const getCupRoundLabel = (fixtures, competitionLabel, normalizeString) => {
  const list = (fixtures || []).filter(
    (fixture) => normalizeString(fixture.competition) === normalizeString(competitionLabel)
  );
  if (!list.length) return null;
  const sorted = [...list].sort((a, b) => {
    if (!a.dateObj && !b.dateObj) return 0;
    if (!a.dateObj) return 1;
    if (!b.dateObj) return -1;
    return a.dateObj - b.dateObj;
  });
  const latest = sorted[sorted.length - 1];
  return latest.round || latest.stage || latest.competition || null;
};

const buildTrophyCabinetElement = (team, helpers) => {
  const { createTextElement, trophyImages } = helpers;
  if (team.id !== 'liverpool') {
    return createTextElement('div', 'trophy-empty', 'Trophy cabinet coming soon.');
  }

  const cabinet = createTextElement('div', 'trophy-cabinet');
  const trophyCards = [
    { title: 'FA CUP', image: trophyImages.faCup, alt: 'FA Cup', count: '8' },
    {
      title: 'COMMUNITY SHIELD',
      image: trophyImages.communityShield,
      alt: 'Community Shield',
      count: '16'
    },
    { title: 'UEFA SUPERCUP', image: trophyImages.uefaSupercup, alt: 'UEFA Supercup', count: '4' },
    { title: 'CARABAO CUP', image: trophyImages.carabaoCup, alt: 'Carabao Cup', count: '10' },
    {
      title: 'CHAMPIONS LEAGUE',
      image: trophyImages.championsLeague,
      alt: 'Champions League',
      count: '6'
    },
    { title: 'CLUB WORLD CUP', image: trophyImages.clubWorldCup, alt: 'Club World Cup', count: '1' },
    {
      title: 'CONFERENCE LEAGUE',
      image: trophyImages.conferenceLeague,
      alt: 'Conference League',
      count: '4'
    }
  ];

  trophyCards.forEach((entry) => {
    const card = createTextElement('div', 'trophy-card');
    card.appendChild(createTextElement('div', 'trophy-title', entry.title));
    const img = document.createElement('img');
    img.src = entry.image;
    img.alt = entry.alt;
    card.appendChild(img);
    card.appendChild(createTextElement('div', 'trophy-count', entry.count));
    cabinet.appendChild(card);
  });

  const premier = createTextElement('div', 'trophy-card');
  premier.appendChild(createTextElement('div', 'trophy-title', 'PREMIER LEAGUE'));
  const duo = createTextElement('div', 'trophy-duo');
  [
    [trophyImages.premierLeague, 'Premier League'],
    [trophyImages.premierLeagueOld, 'Premier League (Old)']
  ].forEach(([src, alt]) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    duo.appendChild(img);
  });
  premier.appendChild(duo);
  premier.appendChild(createTextElement('div', 'trophy-count trophy-count-premier', '20'));
  cabinet.insertBefore(premier, cabinet.children[3] || null);

  return cabinet;
};

export const createTeamProfileView = ({
  team,
  activeLeague,
  activeTab,
  activeTeamId,
  roster = [],
  searchTerm = '',
  fixtures = [],
  fixtureVisibleCount = 10,
  standings = {},
  leagueTeams = {},
  isFollowed,
  buildFollowButton,
  helpers
}) => {
  const {
    createTextElement,
    normalizeString,
    splitTeamName,
    buildLogo,
    positionGroupFor,
    getFixtureCutoffDate,
    getLeagueConfig
  } = helpers;

  const fullName = team.name || team.shortName || '';
  const { left, right } = splitTeamName(fullName);
  const isLongName = fullName.length >= 15 || fullName.split(' ').length >= 3;
  const logo = buildLogo(team);

  const filteredRoster = roster.filter((player) =>
    normalizeString(player.name).includes(searchTerm)
  );
  const groups = {
    Forwards: [],
    Midfielders: [],
    Defenders: [],
    Goalkeepers: [],
    Other: []
  };
  filteredRoster.forEach((player) => {
    const group = positionGroupFor(player.position);
    if (!groups[group]) groups.Other.push(player);
    else groups[group].push(player);
  });

  const squadColumns = [
    buildSquadColumnElement('Forwards', groups.Forwards, activeTeamId, helpers),
    buildSquadColumnElement('Midfield', groups.Midfielders, activeTeamId, helpers),
    buildSquadColumnElement('Defense', groups.Defenders, activeTeamId, helpers),
    buildSquadColumnElement('Goalkeepers', groups.Goalkeepers, activeTeamId, helpers)
  ];

  const cutoff = getFixtureCutoffDate();
  const upcomingFixtures = fixtures.filter((fixture) => !fixture.dateObj || fixture.dateObj >= cutoff);
  const fixturesToShow = activeTab === 'fixtures'
    ? fixtures
    : upcomingFixtures.slice(0, fixtureVisibleCount);
  const fixtureNodes = fixturesToShow.length
    ? fixturesToShow.map((fixture) =>
        buildFixtureCardElement(fixture, team, { activeLeague, activeTab, vsDesignUrl: helpers.vsDesignUrl }, helpers)
      )
    : [createTextElement('div', 'squad-empty', 'Fixtures loading...')];

  const tabConfig = [
    { key: 'squad', label: 'Squad' },
    { key: 'fixtures', label: 'Fixtures' },
    { key: 'history', label: 'History' },
    { key: 'news', label: 'News' },
    { key: 'table', label: 'Table' }
  ];

  const teamProfile = createTextElement('div', 'team-profile');
  if (isLongName) teamProfile.classList.add('long-name');
  if (activeTab === 'fixtures') teamProfile.classList.add('fixtures-view');
  if (activeTab === 'history') teamProfile.classList.add('history-view');
  if (activeTab === 'table') teamProfile.classList.add('table-view');
  teamProfile.dataset.teamId = team.id;
  teamProfile.dataset.activeTab = activeTab;

  const hero = createTextElement('div', 'team-hero');
  const exitButton = createTextElement('button', 'team-exit', 'Exit');
  exitButton.type = 'button';
  exitButton.dataset.action = 'exit-team-profile';
  hero.appendChild(exitButton);
  hero.appendChild(
    buildFollowButton({
      active: isFollowed,
      type: 'team'
    })
  );

  const heroInner = createTextElement('div', 'team-hero-inner');
  const heroTitle = createTextElement('div', 'team-hero-title');
  heroTitle.appendChild(createTextElement('span', 'team-hero-word', left));
  if (logo) {
    const logoWrap = createTextElement('span', 'team-hero-logo');
    logoWrap.appendChild(logo);
    heroTitle.appendChild(logoWrap);
  }
  heroTitle.appendChild(createTextElement('span', 'team-hero-word', right));
  heroInner.appendChild(heroTitle);
  hero.appendChild(heroInner);
  teamProfile.appendChild(hero);

  const tabs = createTextElement('div', 'team-tabs');
  tabConfig.forEach((tab) => {
    const button = createTextElement('button', `team-tab${activeTab === tab.key ? ' active' : ''}`, tab.label);
    button.type = 'button';
    button.dataset.tab = tab.key;
    tabs.appendChild(button);
  });
  teamProfile.appendChild(tabs);

  const appendFixtureList = (container) => {
    fixtureNodes.forEach((node) => container.appendChild(node));
  };

  if (activeTab === 'fixtures') {
    const body = createTextElement('div', 'team-body fixtures-only');
    const fixturesWrap = createTextElement('div', 'team-fixtures');
    fixturesWrap.appendChild(createTextElement('div', 'team-fixtures-title', 'Fixtures 25/26'));
    const list = createTextElement('div', 'team-fixtures-list');
    appendFixtureList(list);
    fixturesWrap.appendChild(list);
    body.appendChild(fixturesWrap);
    teamProfile.appendChild(body);
  } else if (activeTab === 'history') {
    const body = createTextElement('div', 'team-body history-only');
    body.appendChild(buildTrophyCabinetElement(team, helpers));
    teamProfile.appendChild(body);
  } else if (activeTab === 'table') {
    const leagueStandings = standings?.[activeLeague] || [];
    const leagueTable = buildStandingsTableElement(
      activeLeague,
      getLeagueConfig(activeLeague)?.competitionLabel || 'League Table',
      leagueStandings,
      helpers.teams,
      team.id,
      helpers
    );
    const uclInFixtures = fixtures.some((fixture) =>
      normalizeString(fixture.competition).includes('champions')
    );
    const uclStandings = standings?.ucl || [];
    const uclTable = uclInFixtures
      ? buildStandingsTableElement(
          'ucl',
          'Champions League',
          uclStandings,
          leagueTeams?.ucl || [],
          team.id,
          helpers
        )
      : null;
    const faRound = getCupRoundLabel(fixtures, 'FA Cup', normalizeString);

    const body = createTextElement('div', 'team-body table-only');
    const tables = createTextElement('div', `team-tables${uclTable ? '' : ' single'}`);
    const leftColumn = createTextElement('div', 'team-table-col');
    leftColumn.appendChild(leagueTable);
    if (faRound) {
      const cupCard = createTextElement('div', 'cup-round-card');
      cupCard.appendChild(createTextElement('div', 'cup-round-title', 'FA Cup'));
      cupCard.appendChild(createTextElement('div', 'cup-round-value', faRound));
      leftColumn.appendChild(cupCard);
    }
    tables.appendChild(leftColumn);
    if (uclTable) {
      const rightColumn = createTextElement('div', 'team-table-col');
      rightColumn.appendChild(uclTable);
      tables.appendChild(rightColumn);
    }
    body.appendChild(tables);
    teamProfile.appendChild(body);
  } else {
    const body = createTextElement('div', 'team-body');
    const squad = createTextElement('div', 'team-squad');
    squadColumns.forEach((column) => squad.appendChild(column));
    body.appendChild(squad);

    const fixturesAside = document.createElement('aside');
    fixturesAside.className = 'team-fixtures';
    fixturesAside.appendChild(createTextElement('div', 'team-fixtures-title', 'Fixtures'));
    const list = createTextElement('div', 'team-fixtures-list');
    appendFixtureList(list);
    if (activeTab !== 'fixtures' && upcomingFixtures.length > fixtureVisibleCount) {
      const showMore = createTextElement('button', 'fixtures-show-more', 'Show More');
      showMore.type = 'button';
      showMore.dataset.action = 'fixtures-show-more';
      list.appendChild(showMore);
    }
    fixturesAside.appendChild(list);
    body.appendChild(fixturesAside);
    teamProfile.appendChild(body);
  }

  return teamProfile;
};
