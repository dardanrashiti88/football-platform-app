export const SLOT_COUNT = 12;

export const COMPETITION_ORDER = [
  'premier',
  'ucl',
  'laliga',
  'bundesliga',
  'seriea',
  'championship',
  'ligue1',
  'facup',
  'carabaocup',
  'europa',
  'conference',
  'worldcup'
];

export const DEFAULT_COMPETITION_LAYOUT = ['premier', 'ucl', 'laliga', 'bundesliga', 'seriea', 'championship'];

export const COMPETITIONS = {
  premier: {
    key: 'premier',
    label: 'Premier League',
    className: 'pl',
    logo: new URL('../../../images/comp-logos/Competition=Men_%20Premier%20League,%20Color=Color.webp', import.meta.url).href
  },
  championship: {
    key: 'championship',
    label: 'EFL Championship',
    className: 'championship',
    logo: new URL('../../../images/comp-logos/EFLchampionship.svg', import.meta.url).href
  },
  facup: {
    key: 'facup',
    label: 'FA Cup',
    className: 'facup',
    logo: new URL('../../../images/comp-logos/facup.png', import.meta.url).href
  },
  carabaocup: {
    key: 'carabaocup',
    label: 'Carabao Cup',
    className: 'carabaocup',
    logo: new URL('../../../images/comp-logos/carabao-cup-crest.svg', import.meta.url).href
  },
  seriea: {
    key: 'seriea',
    label: 'Serie A',
    className: 'seriea',
    logo: new URL('../../../images/comp-logos/seriea-enilive-logo_jssflz.png', import.meta.url).href
  },
  laliga: {
    key: 'laliga',
    label: 'LaLiga',
    className: '',
    logo: new URL('../../../images/comp-logos/Screenshot%202026-03-02%20155633.png', import.meta.url).href
  },
  bundesliga: {
    key: 'bundesliga',
    label: 'Bundesliga',
    className: '',
    logo: new URL('../../../images/comp-logos/bundesliga-app.svg', import.meta.url).href
  },
  ligue1: {
    key: 'ligue1',
    label: 'Ligue 1',
    className: '',
    logo: new URL('../../../images/comp-logos/ligue-1.png', import.meta.url).href
  },
  ucl: {
    key: 'ucl',
    label: 'Champions League',
    className: '',
    logo: new URL('../../../images/comp-logos/Competition=Men_%20Champions%20League,%20Color=Color.webp', import.meta.url).href
  },
  europa: {
    key: 'europa',
    label: 'Europa League',
    className: 'europa',
    logo: new URL('../../../images/comp-logos/europa-league.png', import.meta.url).href
  },
  conference: {
    key: 'conference',
    label: 'Conference League',
    className: 'conference',
    logo: new URL('../../../images/comp-logos/conference-league.svg', import.meta.url).href
  },
  worldcup: {
    key: 'worldcup',
    label: 'World Cup',
    className: 'worldcup',
    logo: new URL('../../../images/comp-logos/2026-World-Cup.webp', import.meta.url).href
  }
};

const COMPETITION_ALIASES = {
  'premier-league': 'premier',
  premierleague: 'premier',
  'champions-league': 'ucl',
  championsleague: 'ucl',
  ucl: 'ucl',
  'la-liga': 'laliga',
  'serie-a': 'seriea',
  'efl-championship': 'championship',
  'fa-cup': 'facup',
  'carabao-cup': 'carabaocup',
  'europa-league': 'europa',
  'conference-league': 'conference',
  'world-cup': 'worldcup'
};

export const normalizeCompetitionKey = (value) => {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!raw) return '';
  return COMPETITIONS[raw] ? raw : (COMPETITION_ALIASES[raw] || '');
};

export const normalizeCompetitionLayout = (layout, slotCount = SLOT_COUNT) => {
  const seen = new Set();
  return Array.from({ length: slotCount }, (_, index) => {
    const raw = Array.isArray(layout) ? layout[index] : null;
    const leagueId = normalizeCompetitionKey(raw);
    if (!leagueId || !COMPETITIONS[leagueId] || seen.has(leagueId)) return null;
    seen.add(leagueId);
    return leagueId;
  });
};

export const getDefaultCompetitionLayout = (slotCount = SLOT_COUNT) =>
  normalizeCompetitionLayout([
    ...DEFAULT_COMPETITION_LAYOUT,
    ...Array.from({ length: Math.max(0, slotCount - DEFAULT_COMPETITION_LAYOUT.length) }, () => null)
  ], slotCount);

export const buildLayoutFromFavorites = (favorites = [], slotCount = SLOT_COUNT) => {
  const preferred = normalizeCompetitionLayout(favorites.filter(Boolean), slotCount).filter(Boolean);
  const remainder = COMPETITION_ORDER.filter((leagueId) => !preferred.includes(leagueId));
  return normalizeCompetitionLayout(
    [...preferred, ...remainder, ...Array.from({ length: slotCount }, () => null)],
    slotCount
  );
};

export const getCompetitionConfig = (leagueId) => COMPETITIONS[leagueId] || null;
