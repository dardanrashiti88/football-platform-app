import { leagueAccentMap } from '../data/leagues.js';

const statsLeagueButtons = document.querySelectorAll('.stats-league');
const statsScopeButtons = document.querySelectorAll('.stats-toggle-btn');
const statsGrid = document.querySelector('.stats-grid');
const statsSearchInput = document.querySelector('#stats-view .stats-search input');

const PREMIER_PLAYER_STATS_URL = new URL(
  '../../../db-api/data/competitions/premier-league/player-stats.json',
  import.meta.url
);
const CHAMPIONSHIP_PLAYER_STATS_URL = new URL(
  '../../../db-api/data/competitions/championship/player-stats.json',
  import.meta.url
);
const PREMIER_TEAM_STATS_URL = new URL(
  '../../../db-api/data/competitions/premier-league/team-stats.json',
  import.meta.url
);
const SERIEA_TEAM_STATS_URL = new URL(
  '../../../db-api/data/competitions/serie-a/team-stats.json',
  import.meta.url
);
const LALIGA_TEAM_STATS_URL = new URL(
  '../../../db-api/data/competitions/la-liga/team-stats.json',
  import.meta.url
);
const BUNDESLIGA_TEAM_STATS_URL = new URL(
  '../../../db-api/data/competitions/bundesliga/team-stats.json',
  import.meta.url
);
const LIGUE1_TEAM_STATS_URL = new URL(
  '../../../db-api/data/competitions/ligue-1/team-stats.json',
  import.meta.url
);
const UCL_TEAM_STATS_URL = new URL(
  '../../../db-api/data/competitions/champions-league/team-stats.json',
  import.meta.url
);

const PREMIER_TEAM_LOGOS = {
  'afc-bournemouth': new URL('../../../images/Teams-logos/Premier-league/bournemouth.svg', import.meta.url)
    .href,
  arsenal: new URL('../../../images/Teams-logos/Premier-league/arsenal.svg', import.meta.url).href,
  'aston-villa': new URL('../../../images/Teams-logos/Premier-league/astonvilla.svg', import.meta.url).href,
  brentford: new URL('../../../images/Teams-logos/Premier-league/brentford.svg', import.meta.url).href,
  'brighton-and-hove-albion': new URL('../../../images/Teams-logos/Premier-league/brighton.svg', import.meta.url)
    .href,
  burnley: new URL('../../../images/Teams-logos/Premier-league/burnley.svg', import.meta.url).href,
  chelsea: new URL('../../../images/Teams-logos/Premier-league/chelsea.svg', import.meta.url).href,
  'crystal-palace': new URL('../../../images/Teams-logos/Premier-league/crystalpalace.svg', import.meta.url)
    .href,
  everton: new URL('../../../images/Teams-logos/Premier-league/everton.svg', import.meta.url).href,
  fulham: new URL('../../../images/Teams-logos/Premier-league/fulham.svg', import.meta.url).href,
  'leeds-united': new URL('../../../images/Teams-logos/Premier-league/leeds.svg', import.meta.url).href,
  liverpool: new URL('../../../images/Teams-logos/Premier-league/liverpool.svg', import.meta.url).href,
  'manchester-city': new URL('../../../images/Teams-logos/Premier-league/mancity.svg', import.meta.url).href,
  'manchester-united': new URL('../../../images/Teams-logos/Premier-league/Manu.svg', import.meta.url).href,
  'newcastle-united': new URL('../../../images/Teams-logos/Premier-league/newcastle.svg', import.meta.url).href,
  'nottingham-forest': new URL('../../../images/Teams-logos/Premier-league/forest.svg', import.meta.url).href,
  sunderland: new URL('../../../images/Teams-logos/Premier-league/sunderland.svg', import.meta.url).href,
  'tottenham-hotspur': new URL('../../../images/Teams-logos/Premier-league/tottenham.svg', import.meta.url)
    .href,
  'west-ham-united': new URL('../../../images/Teams-logos/Premier-league/westham.svg', import.meta.url).href,
  'wolverhampton-wanderers': new URL('../../../images/Teams-logos/Premier-league/wolves.svg', import.meta.url)
    .href
};

const SERIEA_TEAM_LOGOS = {
  'ac-milan': new URL('../../../images/Teams-logos/serie-a/milan.webp', import.meta.url).href,
  'as-roma': new URL('../../../images/Teams-logos/serie-a/roma.webp', import.meta.url).href,
  'atalanta-bc': new URL('../../../images/Teams-logos/serie-a/atalanta.webp', import.meta.url).href,
  'bologna-fc': new URL('../../../images/Teams-logos/serie-a/bologna.webp', import.meta.url).href,
  'cagliari-calcio': new URL('../../../images/Teams-logos/serie-a/cagliari.webp', import.meta.url).href,
  'como-1907': new URL('../../../images/Teams-logos/serie-a/como.webp', import.meta.url).href,
  'genoa-cfc': new URL('../../../images/Teams-logos/serie-a/genoa.webp', import.meta.url).href,
  'inter-milan': new URL('../../../images/Teams-logos/serie-a/inter.webp', import.meta.url).href,
  juventus: new URL('../../../images/Teams-logos/serie-a/juventus.webp', import.meta.url).href,
  'lazio-rome': new URL('../../../images/Teams-logos/serie-a/lazio.webp', import.meta.url).href,
  'pisa-sc': new URL('../../../images/Teams-logos/serie-a/pisa.webp', import.meta.url).href,
  'parma-calcio': new URL('../../../images/Teams-logos/serie-a/parma.webp', import.meta.url).href,
  'sassuolo-calcio': new URL('../../../images/Teams-logos/serie-a/sassuolo.webp', import.meta.url).href,
  'ssc-napoli': new URL('../../../images/Teams-logos/serie-a/napoli.webp', import.meta.url).href,
  'torino-fc': new URL('../../../images/Teams-logos/serie-a/torino.webp', import.meta.url).href,
  'udinese-calcio': new URL('../../../images/Teams-logos/serie-a/udinese.webp', import.meta.url).href,
  'us-cremonese': new URL('../../../images/Teams-logos/serie-a/cremonese.webp', import.meta.url).href,
  'us-lecce': new URL('../../../images/Teams-logos/serie-a/lecce.webp', import.meta.url).href,
  'acf-fiorentina': new URL('../../../images/Teams-logos/serie-a/fiorentina.webp', import.meta.url).href,
  'hellas-verona': new URL('../../../images/Teams-logos/serie-a/verona.webp', import.meta.url).href
};

const CHAMPIONSHIP_TEAM_LOGOS = {
  'birmingham-city': new URL('../../../images/Teams-logos/EFLchampionship/birmingham.png', import.meta.url).href,
  'blackburn-rovers': new URL(
    '../../../images/Teams-logos/EFLchampionship/blackburn rovers.png',
    import.meta.url
  ).href,
  'bristol-city': new URL('../../../images/Teams-logos/EFLchampionship/bristolcity.png', import.meta.url).href,
  'charlton-athletic': new URL('../../../images/Teams-logos/EFLchampionship/charlton.png', import.meta.url)
    .href,
  'coventry-city': new URL(
    '../../../images/Teams-logos/EFLchampionship/coventry city.png',
    import.meta.url
  ).href,
  'derby-county': new URL('../../../images/Teams-logos/EFLchampionship/derbycounty.png', import.meta.url).href,
  'hull-city': new URL('../../../images/Teams-logos/EFLchampionship/hullcity.png', import.meta.url).href,
  'ipswich-town': new URL('../../../images/Teams-logos/EFLchampionship/ipswichtown.png', import.meta.url)
    .href,
  'leicester-city': new URL(
    '../../../images/Teams-logos/EFLchampionship/leicestercity.png',
    import.meta.url
  ).href,
  middlesbrough: new URL('../../../images/Teams-logos/EFLchampionship/middlesbrough.png', import.meta.url)
    .href,
  millwall: new URL('../../../images/Teams-logos/EFLchampionship/millwall.png', import.meta.url).href,
  'norwich-city': new URL('../../../images/Teams-logos/EFLchampionship/norwich.png', import.meta.url).href,
  'oxford-united': new URL('../../../images/Teams-logos/EFLchampionship/oxfordunited.png', import.meta.url)
    .href,
  portsmouth: new URL('../../../images/Teams-logos/EFLchampionship/portsmouth.png', import.meta.url).href,
  'preston-north-end': new URL(
    '../../../images/Teams-logos/EFLchampionship/prestonnorthend.png',
    import.meta.url
  ).href,
  'queens-park-rangers': new URL(
    '../../../images/Teams-logos/EFLchampionship/queenparkrangers.png',
    import.meta.url
  ).href,
  'sheffield-united': new URL(
    '../../../images/Teams-logos/EFLchampionship/sheffieldunited.png',
    import.meta.url
  ).href,
  'sheffield-wednesday': new URL(
    '../../../images/Teams-logos/EFLchampionship/sheffieldwednesday.png',
    import.meta.url
  ).href,
  southampton: new URL('../../../images/Teams-logos/EFLchampionship/southampton.png', import.meta.url).href,
  'stoke-city': new URL('../../../images/Teams-logos/EFLchampionship/stroke.png', import.meta.url).href,
  'swansea-city': new URL('../../../images/Teams-logos/EFLchampionship/swanseacity.png', import.meta.url)
    .href,
  watford: new URL('../../../images/Teams-logos/EFLchampionship/watford.png', import.meta.url).href,
  'west-bromwich-albion': new URL(
    '../../../images/Teams-logos/EFLchampionship/westbromwich albion.png',
    import.meta.url
  ).href,
  wrexham: new URL('../../../images/Teams-logos/EFLchampionship/wrexham.png', import.meta.url).href
};

const BUNDESLIGA_TEAM_LOGOS = {
  'bayern-munich': new URL('../../../images/Teams-logos/bundesliga/bayern.svg', import.meta.url).href,
  'borussia-dortmund': new URL('../../../images/Teams-logos/bundesliga/borussia.svg', import.meta.url).href,
  'rb-leipzig': new URL('../../../images/Teams-logos/bundesliga/rb leipzig.svg', import.meta.url).href,
  'vfb-stuttgart': new URL('../../../images/Teams-logos/bundesliga/stuttgart.svg', import.meta.url).href,
  'tsg-hoffenheim': new URL('../../../images/Teams-logos/bundesliga/hoffenheim.svg', import.meta.url).href,
  'bayer-leverkusen': new URL('../../../images/Teams-logos/bundesliga/leverkusen.svg', import.meta.url).href,
  'eintracht-frankfurt': new URL('../../../images/Teams-logos/bundesliga/frankfurt.svg', import.meta.url).href,
  'sc-freiburg': new URL('../../../images/Teams-logos/bundesliga/freiburg.svg', import.meta.url).href,
  'hamburger-sv': new URL('../../../images/Teams-logos/bundesliga/hamburg.svg', import.meta.url).href,
  'fc-augsburg': new URL('../../../images/Teams-logos/bundesliga/augsburg.svg', import.meta.url).href,
  'union-berlin': new URL('../../../images/Teams-logos/bundesliga/unionberlin.svg', import.meta.url).href,
  'borussia-monchengladbach': new URL('../../../images/Teams-logos/bundesliga/monchengladbach.svg', import.meta.url)
    .href,
  'werder-bremen': new URL('../../../images/Teams-logos/bundesliga/werder.svg', import.meta.url).href,
  'fsv-mainz': new URL('../../../images/Teams-logos/bundesliga/mainz.svg', import.meta.url).href,
  'fc-cologne': new URL('../../../images/Teams-logos/bundesliga/cologne.svg', import.meta.url).href,
  'fc-st-pauli': new URL('../../../images/Teams-logos/bundesliga/stpauli.svg', import.meta.url).href,
  'vfl-wolfsburg': new URL('../../../images/Teams-logos/bundesliga/wolfsburg.svg', import.meta.url).href,
  'fc-heidenheim': new URL('../../../images/Teams-logos/bundesliga/heidenheim.svg', import.meta.url).href
};

const LIGUE1_TEAM_LOGOS = {
  'racing-lens': new URL(
    '../../../images/Teams-logos/Ligue-1/ecc223ea-c63a-4ccc-8d1e-845e9cda0363.png',
    import.meta.url
  ).href,
  'paris-saint-germain': new URL('../../../images/Teams-logos/Ligue-1/psg.png', import.meta.url).href,
  'olympique-marseille': new URL('../../../images/Teams-logos/Ligue-1/marseille.png', import.meta.url).href,
  'olympique-lyon': new URL('../../../images/Teams-logos/Ligue-1/lyon.png', import.meta.url).href,
  'lille-osc': new URL('../../../images/Teams-logos/Ligue-1/losc.png', import.meta.url).href,
  'as-monaco': new URL('../../../images/Teams-logos/Ligue-1/monaco.png', import.meta.url).href,
  'stade-rennais': new URL('../../../images/Teams-logos/Ligue-1/rennais.png', import.meta.url).href,
  strasbourg: new URL('../../../images/Teams-logos/Ligue-1/strasbourg.png', import.meta.url).href,
  'toulouse-fc': new URL('../../../images/Teams-logos/Ligue-1/toulouse.png', import.meta.url).href,
  'fc-lorient': new URL('../../../images/Teams-logos/Ligue-1/lorient.png', import.meta.url).href,
  'stade-brest': new URL('../../../images/Teams-logos/Ligue-1/brest.png', import.meta.url).href,
  'angers-sco': new URL('../../../images/Teams-logos/Ligue-1/angers sco.png', import.meta.url).href,
  'paris-fc': new URL('../../../images/Teams-logos/Ligue-1/parisfc.png', import.meta.url).href,
  'le-havre-ac': new URL('../../../images/Teams-logos/Ligue-1/havre.png', import.meta.url).href,
  'ogc-nice': new URL('../../../images/Teams-logos/Ligue-1/nice.png', import.meta.url).href,
  'aj-auxerre': new URL('../../../images/Teams-logos/Ligue-1/auxerre.png', import.meta.url).href,
  'fc-nantes': new URL('../../../images/Teams-logos/Ligue-1/nantes.png', import.meta.url).href,
  'fc-metz': new URL('../../../images/Teams-logos/Ligue-1/metz.png', import.meta.url).href
};

const LALIGA_TEAM_LOGOS = {
  'fc-barcelona': new URL('../../../images/Teams-logos/laliga/BCN.png', import.meta.url).href,
  'real-madrid': new URL('../../../images/Teams-logos/laliga/RMD.png', import.meta.url).href,
  'villarreal-cf': new URL('../../../images/Teams-logos/laliga/VIL.png', import.meta.url).href,
  'atletico-madrid': new URL('../../../images/Teams-logos/laliga/ATM.png', import.meta.url).href,
  'real-betis': new URL('../../../images/Teams-logos/laliga/BET.png', import.meta.url).href,
  'rc-celta-vigo': new URL('../../../images/Teams-logos/laliga/CLV.png', import.meta.url).href,
  'real-sociedad': new URL('../../../images/Teams-logos/laliga/RSO.png', import.meta.url).href,
  'getafe-cf': new URL('../../../images/Teams-logos/laliga/GET.png', import.meta.url).href,
  'espanyol-barcelona': new URL('../../../images/Teams-logos/laliga/ESP.png', import.meta.url).href,
  'ca-osasuna': new URL('../../../images/Teams-logos/laliga/OSA.png', import.meta.url).href,
  'athletic-bilbao': new URL('../../../images/Teams-logos/laliga/ATH.png', import.meta.url).href,
  'girona-fc': new URL('../../../images/Teams-logos/laliga/GIR.png', import.meta.url).href,
  'rayo-vallecano': new URL('../../../images/Teams-logos/laliga/RAY.png', import.meta.url).href,
  'valencia-cf': new URL('../../../images/Teams-logos/laliga/VAL.png', import.meta.url).href,
  'sevilla-fc': new URL('../../../images/Teams-logos/laliga/SEV.png', import.meta.url).href,
  'elche-cf': new URL('../../../images/Teams-logos/laliga/ELC.png', import.meta.url).href,
  'deportivo-alaves': new URL('../../../images/Teams-logos/laliga/CDA.png', import.meta.url).href,
  'rcd-mallorca': new URL('../../../images/Teams-logos/laliga/MLL.png', import.meta.url).href,
  'levante-ud': new URL('../../../images/Teams-logos/laliga/LEV.png', import.meta.url).href,
  'real-oviedo': new URL('../../../images/Teams-logos/laliga/OVI.png', import.meta.url).href
};

const LEAGUE_CONFIGS = {
  premier: {
    playerStatsUrl: PREMIER_PLAYER_STATS_URL,
    teamStatsUrl: PREMIER_TEAM_STATS_URL,
    teamLogos: PREMIER_TEAM_LOGOS
  },
  championship: {
    playerStatsUrl: CHAMPIONSHIP_PLAYER_STATS_URL,
    teamLogos: CHAMPIONSHIP_TEAM_LOGOS
  },
  seriea: {
    teamStatsUrl: SERIEA_TEAM_STATS_URL,
    teamLogos: SERIEA_TEAM_LOGOS
  },
  laliga: {
    teamStatsUrl: LALIGA_TEAM_STATS_URL,
    teamLogos: LALIGA_TEAM_LOGOS
  },
  bundesliga: {
    teamStatsUrl: BUNDESLIGA_TEAM_STATS_URL,
    teamLogos: BUNDESLIGA_TEAM_LOGOS
  },
  ligue1: {
    teamStatsUrl: LIGUE1_TEAM_STATS_URL,
    teamLogos: LIGUE1_TEAM_LOGOS
  },
  ucl: {
    teamStatsUrl: UCL_TEAM_STATS_URL
  }
};

const PLAYER_STAT_CARDS = [
  { key: 'goals', title: 'Goals' },
  { key: 'penaltyGoals', title: 'Penalty goals' },
  { key: 'assists', title: 'Assists' },
  { key: 'expectedAssists', title: 'Expected assists', format: (value) => formatDecimal(value) },
  { key: 'expectedGoals', title: 'Expected goals', format: (value) => formatDecimal(value) },
  { key: 'cleanSheets', title: 'Clean sheets' },
  { key: 'yellowCards', title: 'Yellow cards' },
  { key: 'redCards', title: 'Red cards' },
  { key: 'duelsWon', title: 'Duels won' },
  { key: 'minutesPlayed', title: 'Minutes played' }
];

const TEAM_STAT_CARDS = [
  { key: 'goals', title: 'Goals' },
  { key: 'assists', title: 'Assists' },
  { key: 'expectedGoals', title: 'Expected goals', format: (value) => formatDecimal(value) },
  { key: 'cleanSheets', title: 'Clean sheets' },
  { key: 'yellowCards', title: 'Yellow cards' },
  { key: 'redCards', title: 'Red cards' },
  { key: 'possession', title: 'Possession', format: (value) => formatPercentage(value) },
  { key: 'successfulShortPasses', title: 'Successful short passes' },
  { key: 'successfulLongPasses', title: 'Successful long passes' },
  { key: 'cornersTaken', title: 'Corners taken' },
  { key: 'totalShots', title: 'Total shots' },
  { key: 'hitWoodwork', title: 'Hit woodwork' },
  { key: 'offsides', title: 'Offsides' },
  { key: 'interceptions', title: 'Interceptions' },
  { key: 'duelsWon', title: 'Duels won' },
  { key: 'blocks', title: 'Blocks' },
  { key: 'clearances', title: 'Clearances' },
  { key: 'totalPasses', title: 'Total passes' },
  { key: 'foulsPerGame', title: 'Fouls per game', format: (value) => formatDecimal(value) },
  { key: 'turnoversPerGame', title: 'Turnovers per game', format: (value) => formatDecimal(value) },
  { key: 'penaltiesWon', title: 'Penalties won' },
  { key: 'minutesPlayed', title: 'Minutes played' }
];

const state = {
  league: 'premier',
  scope: 'players',
  searchTerm: '',
  statsByLeague: new Map(),
  expandedCards: new Set()
};

const normalizeString = (value = '') => value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const formatDecimal = (value) => {
  if (typeof value !== 'number') return value;
  const formatted = value.toFixed(2);
  return formatted.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
};

const formatPercentage = (value) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${formatDecimal(value)}%`;
  return value;
};

const getStatNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const getLogoUrl = (teamId, logoMap) => logoMap?.[teamId];

const buildStatLine = (entry, card, logoMap, scope) => {
  if (!entry) {
    return `
      <div class="stat-line empty">
        <div class="stat-player"><span>—</span></div>
        <span class="stat-value">—</span>
      </div>
    `;
  }

  const logoUrl = getLogoUrl(entry.teamId, logoMap);
  const label = scope === 'teams' ? entry.teamName || 'Team' : entry.playerName || 'Unknown';
  const teamName = entry.teamName || 'Team';
  const value = entry[card.key] ?? 0;
  const formattedValue = card.format ? card.format(value) : value;

  return `
    <div class="stat-line">
      <div class="stat-player">
        ${logoUrl ? `<img src="${logoUrl}" alt="${teamName}" />` : ''}
        <span>${label}</span>
      </div>
      <span class="stat-value">${formattedValue}</span>
    </div>
  `;
};

const renderStatsGrid = ({ stats, logoMap, statCards, scope }) => {
  if (!statsGrid) return;
  statsGrid.classList.toggle('teams', scope === 'teams');
  if (!stats || stats.length === 0) {
    statsGrid.innerHTML = `
      <div class="stats-card">
        <div class="stats-card-title">No stats yet</div>
        <div class="stats-card-body">
          <div class="stat-line">
            <div class="stat-player"><span>Data coming soon</span></div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const searchTerm = normalizeString(state.searchTerm);
  const filtered = searchTerm
    ? stats.filter((entry) => normalizeString(scope === 'teams' ? entry.teamName : entry.playerName).includes(searchTerm))
    : stats;

  const cardsToRender = statCards.filter((card) =>
    filtered.some((entry) => {
      const value = entry[card.key];
      if (value == null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      return getStatNumber(value) > 0;
    })
  );

  if (cardsToRender.length === 0) {
    statsGrid.innerHTML = `
      <div class="stats-card">
        <div class="stats-card-title">No stats yet</div>
        <div class="stats-card-body">
          <div class="stat-line">
            <div class="stat-player"><span>Data coming soon</span></div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const cards = cardsToRender.map((card) => {
    const expandedKey = `${state.league}-${scope}-${card.key}`;
    const isExpanded = state.expandedCards.has(expandedKey);
    const limit = isExpanded ? 10 : 3;
    const orderKey = `${card.key}Order`;
    const rankKey = `${card.key}Rank`;
    const topEntries = filtered
      .filter((entry) => getStatNumber(entry[card.key]) > 0 || typeof entry[card.key] === 'string')
      .sort((a, b) => {
        const orderA = a[orderKey] ?? a[rankKey];
        const orderB = b[orderKey] ?? b[rankKey];
        if (orderA != null && orderB != null) {
          return Number(orderA) - Number(orderB);
        }
        if (orderA != null) return -1;
        if (orderB != null) return 1;
        const diff = getStatNumber(b[card.key]) - getStatNumber(a[card.key]);
        if (diff !== 0) return diff;
        const labelA = scope === 'teams' ? (a.teamName || '') : (a.playerName || '');
        const labelB = scope === 'teams' ? (b.teamName || '') : (b.playerName || '');
        return labelA.localeCompare(labelB);
      })
      .slice(0, limit);

    let lines = '';
    if (limit === 3) {
      lines = [
        buildStatLine(topEntries[0], card, logoMap, scope),
        buildStatLine(topEntries[1], card, logoMap, scope),
        buildStatLine(topEntries[2], card, logoMap, scope)
      ].join('');
    } else if (topEntries.length > 0) {
      lines = topEntries.map((entry) => buildStatLine(entry, card, logoMap, scope)).join('');
    } else {
      lines = buildStatLine(null, card, logoMap, scope);
    }

    return `
      <div class="stats-card${isExpanded ? ' expanded' : ''}">
        <div class="stats-card-header">
          <div class="stats-card-title">${card.title}</div>
          <button class="stats-card-toggle" type="button" data-card-key="${card.key}" data-scope="${scope}">
            ${isExpanded ? 'Top 3' : 'Top 10'}
          </button>
        </div>
        <div class="stats-card-body">
          ${lines}
        </div>
      </div>
    `;
  });

  statsGrid.innerHTML = cards.join('');
};

const loadStatsForLeague = async (leagueId) => {
  state.league = leagueId;
  const config = LEAGUE_CONFIGS[leagueId];
  const scope = state.scope;
  const statsUrl = scope === 'teams' ? config?.teamStatsUrl : config?.playerStatsUrl;
  const statCards = scope === 'teams' ? TEAM_STAT_CARDS : PLAYER_STAT_CARDS;
  if (!statsUrl) {
    renderStatsGrid({ stats: [], logoMap: {}, statCards, scope });
    return;
  }

  const cacheKey = `${leagueId}-${scope}`;
  if (!state.statsByLeague.has(cacheKey)) {
    try {
      const response = await fetch(statsUrl);
      if (!response.ok) throw new Error('Stats request failed');
      const stats = await response.json();
      state.statsByLeague.set(cacheKey, stats);
    } catch (error) {
      console.error(error);
      state.statsByLeague.set(cacheKey, []);
    }
  }

  renderStatsGrid({
    stats: state.statsByLeague.get(cacheKey) || [],
    logoMap: config.teamLogos,
    statCards,
    scope
  });
};

export const setStatsAccent = (leagueId) => {
  if (!leagueId) return;
  const color = leagueAccentMap[leagueId];
  if (color) {
    document.documentElement.style.setProperty('--stats-accent', color);
  }
  statsLeagueButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.league === leagueId);
  });
};

export const initStats = () => {
  statsLeagueButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const leagueId = button.dataset.league;
      setStatsAccent(leagueId);
      loadStatsForLeague(leagueId);
    });
  });

  statsScopeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const scope = button.dataset.scope;
      state.scope = scope;
      statsScopeButtons.forEach((item) => {
        item.classList.toggle('active', item.dataset.scope === scope);
      });
      loadStatsForLeague(state.league);
    });
  });

  if (statsSearchInput) {
    statsSearchInput.addEventListener('input', (event) => {
      state.searchTerm = event.target.value || '';
      loadStatsForLeague(state.league);
    });
  }

  if (statsGrid) {
    statsGrid.addEventListener('click', (event) => {
      const toggleButton = event.target.closest('.stats-card-toggle');
      if (!toggleButton) return;
      const cardKey = toggleButton.dataset.cardKey;
      const scope = toggleButton.dataset.scope || state.scope;
      if (!cardKey) return;
      const expandedKey = `${state.league}-${scope}-${cardKey}`;
      if (state.expandedCards.has(expandedKey)) {
        state.expandedCards.delete(expandedKey);
      } else {
        state.expandedCards.add(expandedKey);
      }
      loadStatsForLeague(state.league);
    });
  }

  const initialLeague = document.querySelector('.stats-league.active')?.dataset.league
    || document.querySelector('.sidebar-item.active')?.dataset.league
    || 'premier';
  setStatsAccent(initialLeague);
  loadStatsForLeague(initialLeague);
};
