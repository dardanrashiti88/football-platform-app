import { emitEvent, onEvent } from '../core/events.js';
import { storage } from '../core/storage.js';
import { getJson, putJson } from '../core/api.js';
import { buildLayoutFromFavorites, getDefaultCompetitionLayout, normalizeCompetitionLayout } from './competition-catalog.js';

const USER_KEY = 'fodrUser';
const GUEST_KEY = 'fodrPreferences:guest';
const USER_CACHE_PREFIX = 'fodrPreferences:user:';
const LEGACY_HOME_KEY = 'fodrHomeCardsLayout';
const LEGACY_SIDEBAR_KEY_PREFIX = 'fodrSidebarLayout:';

const defaultPreferences = () => ({
  homeLayout: getDefaultCompetitionLayout(),
  sidebarLayout: getDefaultCompetitionLayout(),
  favoriteTeam: '',
  favoriteLeagues: ['premier', 'ucl', 'laliga'],
  prioritizeFavoriteTeams: true,
  accentColor: '#e7c84b',
  notifications: {
    matches: true,
    goals: true,
    social: true,
    directMessages: true
  },
  onboardingComplete: false,
  updatedAt: null
});

const state = {
  preferences: defaultPreferences(),
  initialized: false,
  syncing: false
};

const readCurrentUser = () => {
  try {
    const raw = storage.get(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getUserCacheKey = (user) => {
  if (!user) return null;
  if (user.id) return `${USER_CACHE_PREFIX}${user.id}`;
  if (user.email) return `${USER_CACHE_PREFIX}${String(user.email).toLowerCase()}`;
  return `${USER_CACHE_PREFIX}guest`;
};

const readJsonStorage = (key) => {
  try {
    const raw = storage.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJsonStorage = (key, value) => {
  storage.set(key, JSON.stringify(value));
};

const normalizePreferences = (raw = {}) => {
  const defaults = defaultPreferences();
  return {
    homeLayout: normalizeCompetitionLayout(raw.homeLayout || defaults.homeLayout),
    sidebarLayout: normalizeCompetitionLayout(raw.sidebarLayout || defaults.sidebarLayout),
    favoriteTeam: String(raw.favoriteTeam || '').trim(),
    favoriteLeagues: normalizeCompetitionLayout(raw.favoriteLeagues || defaults.favoriteLeagues).filter(Boolean),
    prioritizeFavoriteTeams: raw.prioritizeFavoriteTeams !== false,
    accentColor: String(raw.accentColor || defaults.accentColor).trim() || defaults.accentColor,
    notifications: {
      matches: raw.notifications?.matches !== false,
      goals: raw.notifications?.goals !== false,
      social: raw.notifications?.social !== false,
      directMessages: raw.notifications?.directMessages !== false
    },
    onboardingComplete: Boolean(raw.onboardingComplete),
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : null
  };
};

const hasMeaningfulCustomization = (preferences) => {
  const defaults = defaultPreferences();
  const left = normalizePreferences(preferences);
  const right = normalizePreferences(defaults);
  return JSON.stringify(left) !== JSON.stringify(right);
};

const readLegacyGuestPreferences = () => {
  const homeLayout = readJsonStorage(LEGACY_HOME_KEY);
  const sidebarLayout = readJsonStorage(`${LEGACY_SIDEBAR_KEY_PREFIX}guest`);
  const merged = {};
  if (homeLayout) merged.homeLayout = homeLayout;
  if (sidebarLayout) merged.sidebarLayout = sidebarLayout;
  return Object.keys(merged).length ? normalizePreferences(merged) : null;
};

const persistLocal = (preferences, user = readCurrentUser()) => {
  if (user?.id || user?.email || user?.username) {
    const cacheKey = getUserCacheKey(user);
    if (cacheKey) writeJsonStorage(cacheKey, preferences);
  } else {
    writeJsonStorage(GUEST_KEY, preferences);
  }
};

const applyPreferences = (preferences, { emit = true } = {}) => {
  state.preferences = normalizePreferences(preferences);
  persistLocal(state.preferences);
  if (emit) {
    emitEvent('fodr:preferences', { preferences: state.preferences });
  }
  return state.preferences;
};

const fetchRemotePreferences = async (userId) => {
  const data = await getJson(`/preferences/${userId}`);
  return normalizePreferences(data?.preferences || {});
};

const pushRemotePreferences = async (userId, preferences) => {
  const data = await putJson(`/preferences/${userId}`, preferences);
  return normalizePreferences(data?.preferences || preferences);
};

export const getPreferences = () => state.preferences;

export const updatePreferences = async (patch, { skipRemote = false } = {}) => {
  const next = normalizePreferences({
    ...state.preferences,
    ...patch,
    updatedAt: new Date().toISOString()
  });

  applyPreferences(next);

  const user = readCurrentUser();
  if (!skipRemote && user?.id) {
    try {
      const remote = await pushRemotePreferences(user.id, next);
      applyPreferences(remote);
    } catch (error) {
      console.warn('Unable to sync preferences to the account yet.', error);
    }
  }

  return state.preferences;
};

export const saveHomeLayout = async (homeLayout) =>
  updatePreferences({ homeLayout: normalizeCompetitionLayout(homeLayout) });

export const saveSidebarLayout = async (sidebarLayout) =>
  updatePreferences({ sidebarLayout: normalizeCompetitionLayout(sidebarLayout) });

export const completeOnboarding = async ({ favoriteTeam = '', favoriteLeagues = [] } = {}) => {
  const leagues = normalizeCompetitionLayout(favoriteLeagues).filter(Boolean);
  const layoutFromFavorites = buildLayoutFromFavorites(leagues.length ? leagues : defaultPreferences().favoriteLeagues);
  return updatePreferences({
    favoriteTeam,
    favoriteLeagues: leagues,
    homeLayout: layoutFromFavorites,
    sidebarLayout: layoutFromFavorites,
    onboardingComplete: true
  });
};

const hydrateGuestPreferences = () => {
  const guest = readJsonStorage(GUEST_KEY);
  if (guest) return normalizePreferences(guest);
  const legacy = readLegacyGuestPreferences();
  if (legacy) {
    writeJsonStorage(GUEST_KEY, legacy);
    return legacy;
  }
  return defaultPreferences();
};

const syncForCurrentUser = async () => {
  const user = readCurrentUser();
  if (!user?.id) {
    applyPreferences(hydrateGuestPreferences());
    return;
  }

  const guestPreferences = hydrateGuestPreferences();
  const cached = readJsonStorage(getUserCacheKey(user));
  if (cached) {
    applyPreferences(cached);
  }

  try {
    state.syncing = true;
    let remote = await fetchRemotePreferences(user.id);
    if (!remote.onboardingComplete && hasMeaningfulCustomization(guestPreferences)) {
      remote = await pushRemotePreferences(user.id, {
        ...remote,
        ...guestPreferences,
        updatedAt: new Date().toISOString()
      });
    }
    applyPreferences(remote);
  } catch (error) {
    console.warn('Unable to load account preferences right now.', error);
    if (!cached) {
      applyPreferences(guestPreferences);
    }
  } finally {
    state.syncing = false;
  }
};

export const initPreferences = () => {
  if (state.initialized) return;
  state.initialized = true;
  applyPreferences(hydrateGuestPreferences(), { emit: false });
  void syncForCurrentUser();

  onEvent('fodr:user', () => {
    void syncForCurrentUser();
  });

  onEvent('fodr:logout', () => {
    applyPreferences(hydrateGuestPreferences());
  });
};
