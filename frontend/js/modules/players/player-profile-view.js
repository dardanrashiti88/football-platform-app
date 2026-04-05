const buildPlayerStatChip = (helpers, label, value) => {
  const { createTextElement, formatStatValue } = helpers;
  const chip = createTextElement('div', 'player-profile-stat');
  chip.appendChild(createTextElement('span', 'player-profile-stat-label', label));
  chip.appendChild(createTextElement('span', 'player-profile-stat-value', formatStatValue(value)));
  return chip;
};

const buildPlayerIntelRow = (helpers, label, value, emphasize = false) => {
  const { createTextElement, formatStatValue } = helpers;
  const row = createTextElement('div', `player-profile-intel-row${emphasize ? ' is-emphasis' : ''}`);
  row.appendChild(createTextElement('span', 'player-profile-intel-label', label));
  row.appendChild(createTextElement('strong', 'player-profile-intel-value', formatStatValue(value, 'N/A')));
  return row;
};

const buildPlayerFieldElement = (helpers, profile, { compact = false } = {}) => {
  const { createTextElement } = helpers;
  const field = createTextElement('div', `player-profile-field${compact ? ' player-profile-field--compact' : ''}`);

  const stripes = createTextElement('div', 'player-profile-field-stripes');
  for (let index = 0; index < 10; index += 1) {
    stripes.appendChild(createTextElement('span', `player-profile-field-stripe${index % 2 === 0 ? ' is-dark' : ''}`));
  }
  field.appendChild(stripes);
  field.appendChild(createTextElement('div', 'player-profile-field-texture'));
  field.appendChild(createTextElement('div', 'player-profile-field-boundary'));
  field.appendChild(createTextElement('div', 'player-profile-field-half'));

  const centerCircle = createTextElement('div', 'player-profile-field-circle');
  centerCircle.appendChild(createTextElement('span', 'player-profile-field-spot player-profile-field-spot--center'));
  field.appendChild(centerCircle);

  const topBox = createTextElement('div', 'player-profile-field-box player-profile-field-box--top');
  topBox.appendChild(createTextElement('div', 'player-profile-field-six player-profile-field-six--top'));
  topBox.appendChild(createTextElement('div', 'player-profile-field-arc player-profile-field-arc--top'));
  field.appendChild(topBox);

  const bottomBox = createTextElement('div', 'player-profile-field-box player-profile-field-box--bottom');
  bottomBox.appendChild(createTextElement('div', 'player-profile-field-six player-profile-field-six--bottom'));
  bottomBox.appendChild(createTextElement('div', 'player-profile-field-arc player-profile-field-arc--bottom'));
  field.appendChild(bottomBox);

  field.appendChild(createTextElement('span', 'player-profile-field-spot player-profile-field-spot--top'));
  field.appendChild(createTextElement('span', 'player-profile-field-spot player-profile-field-spot--bottom'));

  ['tl', 'tr', 'bl', 'br'].forEach((corner) =>
    field.appendChild(createTextElement('span', `player-profile-field-corner player-profile-field-corner--${corner}`))
  );

  field.appendChild(createTextElement('div', 'player-profile-field-goal player-profile-field-goal--top'));
  field.appendChild(createTextElement('div', 'player-profile-field-goal player-profile-field-goal--bottom'));
  field.appendChild(createTextElement('div', 'player-profile-field-light'));

  helpers.positionMapLayout.forEach((zone) => {
    const marker = createTextElement(
      'span',
      `player-profile-field-node${zone.roles.some((role) => profile.positionMap.includes(role)) ? ' is-active' : ''}`,
      zone.label
    );
    marker.style.left = `${zone.x}%`;
    marker.style.top = `${zone.y}%`;
    field.appendChild(marker);
  });

  return field;
};

const buildPositionMapCard = (helpers, profile) => {
  const { createTextElement } = helpers;
  const card = createTextElement('article', 'player-profile-panel player-profile-panel--map');
  const header = createTextElement('div', 'player-profile-section-header');
  header.appendChild(createTextElement('span', 'player-profile-section-kicker', 'Position Map'));
  header.appendChild(createTextElement('h3', 'player-profile-section-title', 'Role footprint'));
  card.appendChild(header);
  card.appendChild(buildPlayerFieldElement(helpers, profile));
  card.appendChild(
    createTextElement(
      'p',
      'player-profile-panel-note',
      `${profile.position || 'Player'} role view using the live field style from the match experience.`
    )
  );
  return card;
};

const buildTrophiesCard = (helpers, profile) => {
  const { createTextElement } = helpers;
  const card = createTextElement('article', 'player-profile-panel player-profile-panel--wide');
  const header = createTextElement('div', 'player-profile-section-header');
  header.appendChild(createTextElement('span', 'player-profile-section-kicker', 'Trophies'));
  header.appendChild(createTextElement('h3', 'player-profile-section-title', 'Honours cabinet'));
  card.appendChild(header);

  if (!profile.trophies.length) {
    card.appendChild(createTextElement('div', 'player-profile-empty', 'No trophy history loaded yet.'));
    return card;
  }

  const grid = createTextElement('div', 'player-profile-trophy-grid');
  profile.trophies.forEach((entry) => {
    const tile = createTextElement('div', 'player-profile-trophy');
    tile.appendChild(createTextElement('span', 'player-profile-trophy-count', entry.count || '1'));
    tile.appendChild(createTextElement('strong', 'player-profile-trophy-title', entry.title || 'Honour'));
    tile.appendChild(createTextElement('span', 'player-profile-trophy-season', entry.season || '—'));
    grid.appendChild(tile);
  });
  card.appendChild(grid);
  return card;
};

const buildRecentFormCard = (helpers, profile) => {
  const { createTextElement } = helpers;
  const card = createTextElement('article', 'player-profile-panel');
  const header = createTextElement('div', 'player-profile-section-header');
  header.appendChild(createTextElement('span', 'player-profile-section-kicker', 'Recent Form'));
  header.appendChild(createTextElement('h3', 'player-profile-section-title', profile.pulse.summary));
  card.appendChild(header);

  const strip = createTextElement('div', 'player-profile-form-strip');
  profile.pulse.levels.forEach((value, index) => {
    const item = createTextElement('div', 'player-profile-form-item');
    item.style.setProperty('--player-form-level', `${value}%`);
    item.appendChild(createTextElement('span', 'player-profile-form-match', `M${index + 1}`));
    item.appendChild(createTextElement('strong', 'player-profile-form-score', String(value)));
    strip.appendChild(item);
  });
  card.appendChild(strip);

  const metrics = createTextElement('div', 'player-profile-form-metrics');
  profile.pulse.metrics.forEach((metric) => {
    const item = createTextElement('div', 'player-profile-form-metric');
    item.appendChild(createTextElement('span', 'player-profile-form-metric-label', metric.label));
    item.appendChild(createTextElement('strong', 'player-profile-form-metric-value', `${metric.value}%`));
    metrics.appendChild(item);
  });
  card.appendChild(metrics);
  card.appendChild(createTextElement('p', 'player-profile-panel-note', profile.pulse.minutesPerAppearance));
  return card;
};

const buildPlayerCompareCard = (helpers, profile, { title = '', searchable = false } = {}) => {
  const { createTextElement, getInitials, formatStatValue } = helpers;
  const card = createTextElement(
    'article',
    `player-compare-card${searchable ? ' is-search-side' : ' is-locked-side'}`
  );

  const top = createTextElement('div', 'player-compare-card-top');
  top.appendChild(createTextElement('span', 'player-compare-card-kicker', title));
  if (profile?.teamLogo) {
    const logo = document.createElement('img');
    logo.className = 'player-compare-card-logo';
    logo.src = profile.teamLogo;
    logo.alt = profile.teamName || 'Club';
    top.appendChild(logo);
  }
  card.appendChild(top);

  const body = createTextElement('div', 'player-compare-card-body');
  const media = createTextElement('div', 'player-compare-card-media');
  if (profile?.photo) {
    const image = document.createElement('img');
    image.src = profile.photo;
    image.alt = profile.name || 'Player';
    image.loading = 'lazy';
    image.decoding = 'async';
    media.appendChild(image);
  } else {
    media.appendChild(createTextElement('span', 'player-compare-card-fallback', getInitials(profile?.name || 'P')));
  }

  const details = createTextElement('div', 'player-compare-card-details');
  details.appendChild(createTextElement('strong', 'player-compare-card-name', profile?.name || 'Pick a player'));
  details.appendChild(
    createTextElement(
      'span',
      'player-compare-card-meta',
      [profile?.teamName, profile?.position].filter(Boolean).join(' · ') || 'Type a player name to compare'
    )
  );

  const chips = createTextElement('div', 'player-compare-card-chips');
  [
    ['Apps', profile?.currentSeason?.appearances],
    ['Goals', profile?.currentSeason?.goals],
    ['Assists', profile?.currentSeason?.assists],
    ['Rating', profile?.currentSeason?.rating]
  ].forEach(([label, value]) => {
    const chip = createTextElement('span', 'player-compare-card-chip');
    chip.appendChild(createTextElement('span', 'player-compare-card-chip-label', label));
    chip.appendChild(createTextElement('strong', 'player-compare-card-chip-value', formatStatValue(value, 'N/A')));
    chips.appendChild(chip);
  });

  details.appendChild(chips);
  body.append(media, details);
  card.appendChild(body);
  return card;
};

const buildPlayerCompareResult = (helpers, entry) => {
  const { createTextElement, getInitials } = helpers;
  const button = createTextElement('button', 'player-compare-result');
  button.type = 'button';
  button.dataset.action = 'select-player-compare';
  button.dataset.playerName = entry.name || '';
  button.dataset.teamId = entry.teamId || '';
  button.dataset.teamName = entry.teamName || '';
  button.dataset.leagueKey = entry.leagueKey || '';

  const media = createTextElement('span', 'player-compare-result-media');
  if (entry.photo) {
    const image = document.createElement('img');
    image.src = entry.photo;
    image.alt = entry.name || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    media.appendChild(image);
  } else {
    media.appendChild(createTextElement('span', 'player-compare-result-fallback', getInitials(entry.name)));
  }

  const text = createTextElement('span', 'player-compare-result-text');
  text.appendChild(createTextElement('strong', 'player-compare-result-name', entry.name));
  text.appendChild(
    createTextElement(
      'span',
      'player-compare-result-meta',
      [entry.teamName, entry.leagueLabel].filter(Boolean).join(' · ')
    )
  );

  button.append(media, text);
  return button;
};

const buildPlayerCompareMetricRow = (helpers, label, leftValue, rightValue) => {
  const { createTextElement, formatStatValue, parseStatNumber } = helpers;
  const row = createTextElement('div', 'player-compare-row');
  row.appendChild(
    createTextElement('span', 'player-compare-value player-compare-value--left', formatStatValue(leftValue, 'N/A'))
  );

  const middle = createTextElement('div', 'player-compare-middle');
  middle.appendChild(createTextElement('span', 'player-compare-label', label));

  const bar = createTextElement('div', 'player-compare-bar');
  const leftFill = createTextElement('span', 'player-compare-fill player-compare-fill--left');
  const rightFill = createTextElement('span', 'player-compare-fill player-compare-fill--right');
  const leftNumber = parseStatNumber(leftValue);
  const rightNumber = parseStatNumber(rightValue);

  if (leftNumber !== null || rightNumber !== null) {
    const total = Math.max((leftNumber || 0) + (rightNumber || 0), 1);
    leftFill.style.width = `${Math.max(0, ((leftNumber || 0) / total) * 100)}%`;
    rightFill.style.width = `${Math.max(0, ((rightNumber || 0) / total) * 100)}%`;
  } else {
    leftFill.style.width = '50%';
    rightFill.style.width = '50%';
  }

  bar.append(leftFill, rightFill);
  middle.appendChild(bar);
  row.appendChild(middle);
  row.appendChild(
    createTextElement('span', 'player-compare-value player-compare-value--right', formatStatValue(rightValue, 'N/A'))
  );
  return row;
};

const buildPlayerCompareSection = (helpers, profile, compareState) => {
  const { createTextElement } = helpers;
  const section = createTextElement('section', 'player-compare-shell');
  const header = createTextElement('div', 'player-profile-section-header');
  header.appendChild(createTextElement('span', 'player-profile-section-kicker', 'Player Compare'));
  header.appendChild(createTextElement('h3', 'player-profile-section-title', 'Head to head lab'));
  section.appendChild(header);

  const stage = createTextElement('div', 'player-compare-stage');
  stage.appendChild(buildPlayerCompareCard(helpers, profile, { title: 'Locked player' }));
  stage.appendChild(createTextElement('div', 'player-compare-vs', 'VS'));

  const selector = createTextElement('div', 'player-compare-selector');
  if (compareState.targetProfile) {
    selector.appendChild(buildPlayerCompareCard(helpers, compareState.targetProfile, { title: 'Selected player', searchable: true }));
    const clearButton = createTextElement('button', 'player-compare-clear', 'Remove');
    clearButton.type = 'button';
    clearButton.dataset.action = 'clear-player-compare';
    selector.appendChild(clearButton);
  } else {
    const inputWrap = createTextElement('label', 'player-compare-search');
    inputWrap.appendChild(createTextElement('span', 'player-compare-search-label', 'Type another player'));
    const input = document.createElement('input');
    input.className = 'player-compare-input';
    input.type = 'search';
    input.placeholder = 'Search by player or club';
    input.value = compareState.query || '';
    input.autocomplete = 'off';
    input.dataset.action = 'player-compare-query';
    inputWrap.appendChild(input);
    selector.appendChild(inputWrap);

    if (compareState.loading) {
      selector.appendChild(createTextElement('div', 'player-compare-empty', 'Loading players...'));
    } else {
      selector.appendChild(
        createTextElement('div', 'player-compare-empty', 'Pick the second player and we will line up the season numbers side by side.')
      );
    }

    if (compareState.results?.length) {
      const resultsList = createTextElement('div', 'player-compare-results');
      compareState.results.forEach((entry) => resultsList.appendChild(buildPlayerCompareResult(helpers, entry)));
      selector.appendChild(resultsList);
    } else if (compareState.query && !compareState.loading) {
      selector.appendChild(createTextElement('div', 'player-compare-empty is-subtle', 'No players found for that search yet.'));
    }
  }

  stage.appendChild(selector);
  section.appendChild(stage);

  if (compareState.targetProfile) {
    const statsCard = createTextElement('div', 'player-compare-stats');
    [
      ['Age', profile.age, compareState.targetProfile.age],
      ['Apps', profile.currentSeason.appearances, compareState.targetProfile.currentSeason.appearances],
      ['Goals', profile.currentSeason.goals, compareState.targetProfile.currentSeason.goals],
      ['Assists', profile.currentSeason.assists, compareState.targetProfile.currentSeason.assists],
      ['Minutes', profile.currentSeason.minutes, compareState.targetProfile.currentSeason.minutes],
      ['G+A', profile.currentSeason.goalContributions, compareState.targetProfile.currentSeason.goalContributions],
      ['Rating', profile.currentSeason.rating, compareState.targetProfile.currentSeason.rating]
    ].forEach(([label, left, right]) => {
      statsCard.appendChild(buildPlayerCompareMetricRow(helpers, label, left, right));
    });
    section.appendChild(statsCard);
  }

  return section;
};

export const createPlayerProfileView = ({
  profile,
  isFollowed,
  compareState,
  buildFollowButton,
  buildCompareButton,
  createTextElement,
  getInitials,
  formatStatValue,
  parseStatNumber,
  positionMapLayout
}) => {
  const helpers = {
    createTextElement,
    getInitials,
    formatStatValue,
    parseStatNumber,
    positionMapLayout
  };

  const wrapper = createTextElement('div', 'player-profile-shell');
  wrapper.dataset.playerKey = profile.key;

  const hero = createTextElement('div', 'player-profile-hero');
  const exitButton = createTextElement('button', 'team-exit', 'Back');
  exitButton.type = 'button';
  exitButton.dataset.action = 'exit-player-profile';
  hero.appendChild(exitButton);
  hero.appendChild(buildCompareButton(Boolean(compareState?.open)));
  hero.appendChild(
    buildFollowButton({
      active: isFollowed,
      type: 'player'
    })
  );

  const logoTrack = createTextElement('div', 'player-profile-logo-track');
  if (profile.teamLogo) {
    const logo = document.createElement('img');
    logo.className = 'player-profile-club-logo';
    logo.src = profile.teamLogo;
    logo.alt = profile.teamName || 'Club';
    logoTrack.appendChild(logo);
  }
  hero.appendChild(logoTrack);

  const heroLayout = createTextElement('div', 'player-profile-hero-layout');
  const photoWrap = createTextElement('div', 'player-profile-photo');
  if (profile.photo) {
    const image = document.createElement('img');
    image.src = profile.photo;
    image.alt = profile.name;
    image.loading = 'lazy';
    image.decoding = 'async';
    photoWrap.appendChild(image);
  } else {
    photoWrap.appendChild(createTextElement('span', 'player-profile-photo-fallback', getInitials(profile.name)));
  }

  const summary = createTextElement('div', 'player-profile-summary');
  summary.appendChild(createTextElement('span', 'player-profile-kicker', profile.position || 'Player'));
  summary.appendChild(createTextElement('h2', 'player-profile-name', profile.name));

  const meta = createTextElement('div', 'player-profile-meta');
  if (profile.flagUrl) {
    const flag = document.createElement('img');
    flag.className = 'player-profile-flag';
    flag.src = profile.flagUrl;
    flag.alt = profile.nationality || '';
    meta.appendChild(flag);
  }
  meta.appendChild(createTextElement('span', '', profile.nationality || '—'));
  meta.appendChild(createTextElement('span', '', `Age ${profile.age || '—'}`));
  if (profile.teamName) {
    meta.appendChild(createTextElement('span', '', profile.teamName));
  }
  summary.appendChild(meta);

  if (profile.notes) {
    summary.appendChild(createTextElement('p', 'player-profile-note', profile.notes));
  }

  heroLayout.append(photoWrap, summary);
  hero.appendChild(heroLayout);
  wrapper.appendChild(hero);

  if (compareState?.open) {
    wrapper.appendChild(buildPlayerCompareSection(helpers, profile, compareState));
  }

  const insightsGrid = createTextElement('section', 'player-profile-insights-grid');

  const intelCard = createTextElement('article', 'player-profile-panel');
  const intelHeader = createTextElement('div', 'player-profile-section-header');
  intelHeader.appendChild(createTextElement('span', 'player-profile-section-kicker', 'Player Intel'));
  intelHeader.appendChild(createTextElement('h3', 'player-profile-section-title', 'Bio + market'));
  intelCard.appendChild(intelHeader);
  const intelList = createTextElement('div', 'player-profile-intel-list');
  intelList.appendChild(buildPlayerIntelRow(helpers, 'Preferred foot', profile.preferredFoot, true));
  intelList.appendChild(buildPlayerIntelRow(helpers, 'Height', profile.height));
  intelList.appendChild(buildPlayerIntelRow(helpers, 'Market value', profile.marketValue));
  intelList.appendChild(buildPlayerIntelRow(helpers, 'Shirt no.', profile.shirtNumber));
  intelList.appendChild(buildPlayerIntelRow(helpers, 'Home grown', profile.homeGrown));
  intelCard.appendChild(intelList);
  insightsGrid.appendChild(intelCard);

  insightsGrid.appendChild(buildPositionMapCard(helpers, profile));
  insightsGrid.appendChild(buildRecentFormCard(helpers, profile));
  insightsGrid.appendChild(buildTrophiesCard(helpers, profile));
  wrapper.appendChild(insightsGrid);

  const currentSeasonCard = createTextElement('section', 'player-profile-season-card');
  const currentSeasonHeader = createTextElement('div', 'player-profile-section-header');
  currentSeasonHeader.appendChild(createTextElement('span', 'player-profile-section-kicker', 'Season Snapshot'));
  currentSeasonHeader.appendChild(
    createTextElement(
      'h3',
      'player-profile-section-title',
      `${profile.currentSeason.season} · ${profile.currentSeason.club}`
    )
  );
  currentSeasonCard.appendChild(currentSeasonHeader);

  const currentSeasonGrid = createTextElement('div', 'player-profile-stats-grid');
  currentSeasonGrid.appendChild(buildPlayerStatChip(helpers, 'Appearances', profile.currentSeason.appearances));
  currentSeasonGrid.appendChild(buildPlayerStatChip(helpers, 'Goals', profile.currentSeason.goals));
  currentSeasonGrid.appendChild(buildPlayerStatChip(helpers, 'Assists', profile.currentSeason.assists));
  currentSeasonGrid.appendChild(buildPlayerStatChip(helpers, 'Minutes', profile.currentSeason.minutes));
  currentSeasonGrid.appendChild(buildPlayerStatChip(helpers, 'G+A', profile.currentSeason.goalContributions));
  currentSeasonGrid.appendChild(buildPlayerStatChip(helpers, 'Rating', profile.currentSeason.rating));
  currentSeasonCard.appendChild(currentSeasonGrid);
  wrapper.appendChild(currentSeasonCard);

  const seasonsSection = createTextElement('section', 'player-profile-seasons');
  const seasonsHeader = createTextElement('div', 'player-profile-section-header');
  seasonsHeader.appendChild(createTextElement('span', 'player-profile-section-kicker', 'Season Journey'));
  seasonsHeader.appendChild(createTextElement('h3', 'player-profile-section-title', '20/21 to 25/26'));
  seasonsSection.appendChild(seasonsHeader);

  const seasonsList = createTextElement('div', 'player-profile-season-list');
  const seasonsHead = createTextElement('div', 'player-profile-season-row player-profile-season-row--head');
  ['Season', 'Club', 'Apps', 'Goals', 'Assists', 'Minutes', 'G+A', 'Rating'].forEach((label, index) => {
    const cell = createTextElement('div', 'player-profile-season-cell player-profile-season-cell--head', label);
    if (index === 0) cell.classList.add('player-profile-season-cell--season');
    if (index === 1) cell.classList.add('player-profile-season-cell--club');
    seasonsHead.appendChild(cell);
  });
  seasonsList.appendChild(seasonsHead);

  profile.seasons.forEach((season) => {
    const row = createTextElement('article', 'player-profile-season-row');
    if (season.season === profile.currentSeason.season) {
      row.classList.add('is-current');
    }

    const seasonCell = createTextElement('div', 'player-profile-season-cell player-profile-season-cell--season', season.season);
    const clubCell = createTextElement('div', 'player-profile-season-cell player-profile-season-cell--club', season.club || 'Club');
    row.appendChild(seasonCell);
    row.appendChild(clubCell);

    [
      season.appearances,
      season.goals,
      season.assists,
      season.minutes,
      season.goalContributions,
      season.rating
    ].forEach((value) => {
      row.appendChild(createTextElement('div', 'player-profile-season-cell', formatStatValue(value, 'N/A')));
    });

    seasonsList.appendChild(row);
  });
  seasonsSection.appendChild(seasonsList);
  wrapper.appendChild(seasonsSection);

  return wrapper;
};
