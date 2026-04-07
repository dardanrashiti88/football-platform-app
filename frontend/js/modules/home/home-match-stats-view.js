let activeMatchStatsPanelState = null;

const MATCH_COMPARISON_METRICS = [
  { key: 'possession', label: 'Possession', format: 'percent' },
  { key: 'passes', label: 'Passes' },
  { key: 'passAccuracy', label: 'Pass Accuracy', format: 'percent' },
  { key: 'shots', label: 'Shots' },
  { key: 'shotsOnTarget', label: 'On Target' },
  { key: 'shotsOffTarget', label: 'Off Target' },
  { key: 'shotsBlocked', label: 'Blocked' },
  { key: 'bigChances', label: 'Big Chances' },
  { key: 'corners', label: 'Corners' },
  { key: 'dribbles', label: 'Dribbles' },
  { key: 'dispossessed', label: 'Dispossessed' },
  { key: 'tackles', label: 'Tackles' },
  { key: 'interceptions', label: 'Interceptions' },
  { key: 'fouls', label: 'Fouls' },
  { key: 'xg', label: 'Expected Goals', format: 'decimal' }
];

const formatComparisonValue = (metric, value) => {
  if (metric.format === 'percent') return `${Math.round(value)}%`;
  if (metric.format === 'decimal') return Number(value).toFixed(2);
  return String(Math.round(value));
};

const buildComparisonRowsMarkup = (summary, clamp) =>
  MATCH_COMPARISON_METRICS.map((metric) => {
    const homeValue = Number(summary.home[metric.key] || 0);
    const awayValue = Number(summary.away[metric.key] || 0);
    const total =
      metric.format === 'percent'
        ? 100
        : metric.format === 'decimal'
          ? Math.max(homeValue + awayValue, 0.1)
          : Math.max(homeValue + awayValue, 1);
    const homeWidth = clamp((homeValue / total) * 100, 0, 100);
    const awayWidth = clamp((awayValue / total) * 100, 0, 100);

    return `
      <div class="match-compare-row">
        <span class="match-compare-value match-compare-value--home">${formatComparisonValue(metric, homeValue)}</span>
        <div class="match-compare-middle">
          <span class="match-compare-label">${metric.label}</span>
          <div class="match-compare-bar">
            <span class="match-compare-fill match-compare-fill--home" style="width:${homeWidth}%;"></span>
            <span class="match-compare-fill match-compare-fill--away" style="width:${awayWidth}%;"></span>
          </div>
        </div>
        <span class="match-compare-value match-compare-value--away">${formatComparisonValue(metric, awayValue)}</span>
      </div>
    `;
  }).join('');

const getSelectedPassMapPlayer = (passMap, selectedPlayerId) =>
  (passMap?.players || []).find((player) => player.id === selectedPlayerId) ||
  (passMap?.players || []).find((player) => player.id === passMap?.defaultPlayerId) ||
  (passMap?.players || [])[0] ||
  null;

const buildPassSelectorMarkup = (passMap, side, selectedPlayerId) => {
  const players = passMap?.players || [];
  if (!players.length) {
    return `
      <label class="match-stats-select-wrap">
        <span class="match-stats-select-label">Player</span>
        <select class="match-stats-select" disabled>
          <option>No player data</option>
        </select>
      </label>
    `;
  }

  const selectedId = getSelectedPassMapPlayer(passMap, selectedPlayerId)?.id || '';
  const optionMarkup = players
    .map(
      (player) =>
        `<option value="${player.id}"${player.id === selectedId ? ' selected' : ''}>${player.shortName}</option>`
    )
    .join('');

  return `
    <label class="match-stats-select-wrap" for="match-stats-${side}-player-select">
      <span class="match-stats-select-label">Player</span>
      <select class="match-stats-select" id="match-stats-${side}-player-select">
        ${optionMarkup}
      </select>
    </label>
  `;
};

const buildPassMapMarkup = (passMap = { nodes: [], players: [] }, side = 'home', selectedPlayerId = null) => {
  const selectedPlayer = getSelectedPassMapPlayer(passMap, selectedPlayerId);
  if (!selectedPlayer) {
    return {
      markup: '<div class="match-pass-map-placeholder">No passing data</div>',
      selectedPlayer: null
    };
  }

  const nodeById = new Map((passMap.nodes || []).map((node) => [node.id, node]));
  const targetIdSet = new Set(selectedPlayer.targets.map((target) => target.to));

  const lineMarkup = selectedPlayer.targets
    .map((target) => {
      const from = nodeById.get(selectedPlayer.id);
      const to = nodeById.get(target.to);
      if (!from || !to) return '';
      return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" style="stroke-width:${target.strokeWidth}; opacity:${target.opacity};" />`;
    })
    .join('');

  const nodeMarkup = (passMap.nodes || [])
    .map((node) => {
      const stateClass =
        node.id === selectedPlayer.id
          ? ' is-selected'
          : targetIdSet.has(node.id)
            ? ' is-target'
            : ' is-muted';
      return `
        <div class="pass-map-node pass-map-node--${side}${stateClass}" style="left:${node.x}%; top:${node.y}%;">
          <span class="pass-map-node-dot">${node.number}</span>
          <span class="pass-map-node-label">${node.label}</span>
        </div>
      `;
    })
    .join('');

  return {
    selectedPlayer,
    markup: `
      <div class="match-pass-map-surface">
        <div class="match-pass-pitch" aria-hidden="true">
          <span class="match-pass-pitch-line match-pass-pitch-line--half"></span>
          <span class="match-pass-pitch-circle"></span>
          <span class="match-pass-pitch-spot match-pass-pitch-spot--center"></span>
          <span class="match-pass-pitch-box match-pass-pitch-box--left"></span>
          <span class="match-pass-pitch-box match-pass-pitch-box--right"></span>
          <span class="match-pass-pitch-six match-pass-pitch-six--left"></span>
          <span class="match-pass-pitch-six match-pass-pitch-six--right"></span>
          <span class="match-pass-pitch-spot match-pass-pitch-spot--left"></span>
          <span class="match-pass-pitch-spot match-pass-pitch-spot--right"></span>
        </div>
        <svg class="match-pass-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          ${lineMarkup}
        </svg>
        ${nodeMarkup}
      </div>
    `
  };
};

const buildPassBreakdownMarkup = (passMap = { nodes: [] }, selectedPlayer = null) => {
  if (!selectedPlayer) {
    return '<span class="match-pass-target match-pass-target--empty">No pass data</span>';
  }

  const nodeById = new Map((passMap.nodes || []).map((node) => [node.id, node]));
  const targets = (selectedPlayer.targets || [])
    .filter((target) => target.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 6);

  if (!targets.length) {
    return '<span class="match-pass-target match-pass-target--empty">No completed links</span>';
  }

  return targets
    .map((target) => {
      const recipient = nodeById.get(target.to);
      const recipientName = recipient?.shortName || recipient?.label || 'Team';
      return `
        <span class="match-pass-target">
          <span class="match-pass-target-name">${recipientName}</span>
          <span class="match-pass-target-count">${target.count}</span>
        </span>
      `;
    })
    .join('');
};

export const renderMatchStatsShell = (
  homeTeam,
  awayTeam,
  homeLogoUrl,
  awayLogoUrl,
  getShortTeamLabel
) => {
  const homeLogo = document.querySelector('#match-stats-home-logo');
  const awayLogo = document.querySelector('#match-stats-away-logo');
  const homeName = document.querySelector('#match-stats-home-name');
  const awayName = document.querySelector('#match-stats-away-name');

  if (homeLogo) {
    if (homeLogoUrl) homeLogo.src = homeLogoUrl;
    homeLogo.alt = homeTeam?.name || 'Home team';
    homeLogo.style.visibility = homeLogoUrl ? 'visible' : 'hidden';
  }
  if (awayLogo) {
    if (awayLogoUrl) awayLogo.src = awayLogoUrl;
    awayLogo.alt = awayTeam?.name || 'Away team';
    awayLogo.style.visibility = awayLogoUrl ? 'visible' : 'hidden';
  }
  if (homeName) homeName.textContent = getShortTeamLabel(homeTeam);
  if (awayName) awayName.textContent = getShortTeamLabel(awayTeam);
};

export const renderMatchStatsPlaceholder = (
  homeTeam,
  awayTeam,
  homeLogoUrl,
  awayLogoUrl,
  message,
  getShortTeamLabel
) => {
  activeMatchStatsPanelState = null;
  renderMatchStatsShell(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, getShortTeamLabel);
  const compare = document.querySelector('#match-stats-compare');
  const homeMap = document.querySelector('#match-stats-home-map');
  const awayMap = document.querySelector('#match-stats-away-map');
  const homePassCount = document.querySelector('#match-stats-home-pass-count');
  const awayPassCount = document.querySelector('#match-stats-away-pass-count');
  const homePassText = document.querySelector('#match-stats-home-pass-text');
  const awayPassText = document.querySelector('#match-stats-away-pass-text');
  const homeControls = document.querySelector('#match-stats-home-controls');
  const awayControls = document.querySelector('#match-stats-away-controls');
  const homePassBreakdown = document.querySelector('#match-stats-home-pass-breakdown');
  const awayPassBreakdown = document.querySelector('#match-stats-away-pass-breakdown');

  if (homeMap) homeMap.innerHTML = `<div class="match-pass-map-placeholder">${message}</div>`;
  if (awayMap) awayMap.innerHTML = `<div class="match-pass-map-placeholder">${message}</div>`;
  if (compare) compare.innerHTML = `<div class="match-stats-placeholder">${message}</div>`;
  if (homePassCount) homePassCount.textContent = '0';
  if (awayPassCount) awayPassCount.textContent = '0';
  if (homePassText) homePassText.textContent = 'completed passes';
  if (awayPassText) awayPassText.textContent = 'completed passes';
  if (homeControls) homeControls.innerHTML = buildPassSelectorMarkup({ players: [] }, 'home', null);
  if (awayControls) awayControls.innerHTML = buildPassSelectorMarkup({ players: [] }, 'away', null);
  if (homePassBreakdown) homePassBreakdown.innerHTML = '<span class="match-pass-target match-pass-target--empty">No pass data</span>';
  if (awayPassBreakdown) awayPassBreakdown.innerHTML = '<span class="match-pass-target match-pass-target--empty">No pass data</span>';
};

const bindMatchStatsControls = () => {
  const homeSelect = document.querySelector('#match-stats-home-player-select');
  const awaySelect = document.querySelector('#match-stats-away-player-select');

  if (homeSelect) {
    homeSelect.onchange = (event) => {
      if (!activeMatchStatsPanelState) return;
      activeMatchStatsPanelState.selectedHomePlayerId = event.currentTarget.value;
      renderMatchStatsPanel(
        activeMatchStatsPanelState.homeTeam,
        activeMatchStatsPanelState.awayTeam,
        activeMatchStatsPanelState.homeLogoUrl,
        activeMatchStatsPanelState.awayLogoUrl,
        activeMatchStatsPanelState.summary,
        activeMatchStatsPanelState.selectedHomePlayerId,
        activeMatchStatsPanelState.selectedAwayPlayerId,
        activeMatchStatsPanelState.helpers
      );
    };
  }

  if (awaySelect) {
    awaySelect.onchange = (event) => {
      if (!activeMatchStatsPanelState) return;
      activeMatchStatsPanelState.selectedAwayPlayerId = event.currentTarget.value;
      renderMatchStatsPanel(
        activeMatchStatsPanelState.homeTeam,
        activeMatchStatsPanelState.awayTeam,
        activeMatchStatsPanelState.homeLogoUrl,
        activeMatchStatsPanelState.awayLogoUrl,
        activeMatchStatsPanelState.summary,
        activeMatchStatsPanelState.selectedHomePlayerId,
        activeMatchStatsPanelState.selectedAwayPlayerId,
        activeMatchStatsPanelState.helpers
      );
    };
  }
};

export const renderMatchStatsPanel = (
  homeTeam,
  awayTeam,
  homeLogoUrl,
  awayLogoUrl,
  summary,
  selectedHomePlayerId = null,
  selectedAwayPlayerId = null,
  helpers = {}
) => {
  const { clamp, getShortTeamLabel } = helpers;

  renderMatchStatsShell(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, getShortTeamLabel);

  const compare = document.querySelector('#match-stats-compare');
  const homeMap = document.querySelector('#match-stats-home-map');
  const awayMap = document.querySelector('#match-stats-away-map');
  const homePassCount = document.querySelector('#match-stats-home-pass-count');
  const awayPassCount = document.querySelector('#match-stats-away-pass-count');
  const homePassText = document.querySelector('#match-stats-home-pass-text');
  const awayPassText = document.querySelector('#match-stats-away-pass-text');
  const homeControls = document.querySelector('#match-stats-home-controls');
  const awayControls = document.querySelector('#match-stats-away-controls');
  const homePassBreakdown = document.querySelector('#match-stats-home-pass-breakdown');
  const awayPassBreakdown = document.querySelector('#match-stats-away-pass-breakdown');

  if (!summary) {
    renderMatchStatsPlaceholder(homeTeam, awayTeam, homeLogoUrl, awayLogoUrl, 'Detailed stats after full time', getShortTeamLabel);
    return;
  }

  const homeSelectedPlayer =
    selectedHomePlayerId || activeMatchStatsPanelState?.selectedHomePlayerId || summary.home.passMap.defaultPlayerId;
  const awaySelectedPlayer =
    selectedAwayPlayerId || activeMatchStatsPanelState?.selectedAwayPlayerId || summary.away.passMap.defaultPlayerId;

  activeMatchStatsPanelState = {
    homeTeam,
    awayTeam,
    homeLogoUrl,
    awayLogoUrl,
    summary,
    selectedHomePlayerId: homeSelectedPlayer,
    selectedAwayPlayerId: awaySelectedPlayer,
    helpers
  };

  if (compare) {
    compare.innerHTML = `
      <div class="match-stats-title">Match Statistics</div>
      <div class="match-compare-list">
        ${buildComparisonRowsMarkup(summary, clamp)}
      </div>
    `;
  }
  if (homeControls) {
    homeControls.innerHTML = buildPassSelectorMarkup(summary.home.passMap, 'home', homeSelectedPlayer);
  }
  if (awayControls) {
    awayControls.innerHTML = buildPassSelectorMarkup(summary.away.passMap, 'away', awaySelectedPlayer);
  }

  const homePassMap = buildPassMapMarkup(summary.home.passMap, 'home', homeSelectedPlayer);
  const awayPassMap = buildPassMapMarkup(summary.away.passMap, 'away', awaySelectedPlayer);

  if (homeMap) homeMap.innerHTML = homePassMap.markup;
  if (awayMap) awayMap.innerHTML = awayPassMap.markup;
  if (homePassCount) homePassCount.textContent = String(homePassMap.selectedPlayer?.totalPasses || 0);
  if (awayPassCount) awayPassCount.textContent = String(awayPassMap.selectedPlayer?.totalPasses || 0);
  if (homePassText) {
    homePassText.textContent = homePassMap.selectedPlayer
      ? `completed by ${homePassMap.selectedPlayer.shortName}`
      : 'completed passes';
  }
  if (awayPassText) {
    awayPassText.textContent = awayPassMap.selectedPlayer
      ? `completed by ${awayPassMap.selectedPlayer.shortName}`
      : 'completed passes';
  }
  if (homePassBreakdown) {
    homePassBreakdown.innerHTML = buildPassBreakdownMarkup(summary.home.passMap, homePassMap.selectedPlayer);
  }
  if (awayPassBreakdown) {
    awayPassBreakdown.innerHTML = buildPassBreakdownMarkup(summary.away.passMap, awayPassMap.selectedPlayer);
  }

  bindMatchStatsControls();
};
