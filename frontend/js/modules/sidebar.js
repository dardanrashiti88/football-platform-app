import { onEvent } from '../core/events.js';
import { storage } from '../core/storage.js';

const USER_KEY = 'fodrUser';
const SIDEBAR_LAYOUT_KEY = 'fodrSidebarLayout';
const SIDEBAR_ACTIVE_KEY = 'fodrSidebarActiveLeague';
const SLOT_COUNT = 12;
const DEFAULT_LAYOUT = ['premier', 'ucl', 'laliga', 'bundesliga', 'seriea', 'championship'];

const COMPETITIONS = {
  premier: {
    label: 'Premier League',
    className: 'pl',
    logo: new URL('../../../images/comp-logos/Competition=Men_%20Premier%20League,%20Color=Color.webp', import.meta.url)
      .href
  },
  championship: {
    label: 'EFL Championship',
    className: 'championship',
    logo: new URL('../../../images/comp-logos/EFLchampionship.svg', import.meta.url).href
  },
  facup: {
    label: 'FA Cup',
    className: 'facup',
    logo: new URL('../../../images/comp-logos/facup.png', import.meta.url).href
  },
  carabaocup: {
    label: 'Carabao Cup',
    className: 'carabaocup',
    logo: new URL('../../../images/comp-logos/carabao-cup-crest.svg', import.meta.url).href
  },
  seriea: {
    label: 'Serie A',
    className: 'seriea',
    logo: new URL('../../../images/comp-logos/seriea-enilive-logo_jssflz.png', import.meta.url).href
  },
  laliga: {
    label: 'LaLiga',
    className: '',
    logo: new URL('../../../images/comp-logos/Screenshot%202026-03-02%20155633.png', import.meta.url).href
  },
  bundesliga: {
    label: 'Bundesliga',
    className: '',
    logo: new URL('../../../images/comp-logos/bundesliga-app.svg', import.meta.url).href
  },
  ligue1: {
    label: 'Ligue 1',
    className: '',
    logo: new URL('../../../images/comp-logos/ligue-1.png', import.meta.url).href
  },
  ucl: {
    label: 'UEFA Champions League',
    className: '',
    logo: new URL('../../../images/comp-logos/Competition=Men_%20Champions%20League,%20Color=Color.webp', import.meta.url)
      .href
  },
  europa: {
    label: 'UEFA Europa League',
    className: 'europa',
    logo: new URL('../../../images/comp-logos/europa-league.png', import.meta.url).href
  },
  conference: {
    label: 'UEFA Europa Conference League',
    className: 'conference',
    logo: new URL('../../../images/comp-logos/conference-league.svg', import.meta.url).href
  },
  worldcup: {
    label: 'FIFA World Cup 2026',
    className: 'worldcup',
    logo: new URL('../../../images/comp-logos/2026-World-Cup.webp', import.meta.url).href
  }
};

const COMPETITION_ORDER = [
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

const state = {
  layout: [],
  activeLeague: 'premier',
  openSlot: null
};

let sidebar = null;
let slotEls = [];
let pickerModal = null;
let pickerGrid = null;
let pickerTitle = null;
let pickerClearBtn = null;

const readCurrentUser = () => {
  try {
    const raw = storage.get(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getSubjectKey = () => {
  const user = readCurrentUser();
  if (user?.id) return `user:${user.id}`;
  if (user?.email) return `user-email:${String(user.email).toLowerCase()}`;
  if (user?.username) return `user-name:${String(user.username).toLowerCase()}`;
  return 'guest';
};

const getLayoutStorageKey = () => `${SIDEBAR_LAYOUT_KEY}:${getSubjectKey()}`;
const getActiveStorageKey = () => `${SIDEBAR_ACTIVE_KEY}:${getSubjectKey()}`;

const normalizeLayout = (layout) => {
  const seen = new Set();
  const normalized = Array.from({ length: SLOT_COUNT }, (_, index) => {
    const raw = Array.isArray(layout) ? layout[index] : null;
    const leagueId = typeof raw === 'string' ? raw.trim() : '';
    if (!leagueId || !COMPETITIONS[leagueId] || seen.has(leagueId)) return null;
    seen.add(leagueId);
    return leagueId;
  });
  return normalized;
};

const getDefaultLayout = () => normalizeLayout([...DEFAULT_LAYOUT, ...Array.from({ length: SLOT_COUNT - DEFAULT_LAYOUT.length }, () => null)]);

const readStoredLayout = () => {
  try {
    const raw = storage.get(getLayoutStorageKey());
    if (!raw) return getDefaultLayout();
    const parsed = JSON.parse(raw);
    const normalized = normalizeLayout(parsed);
    return normalized.some(Boolean) ? normalized : getDefaultLayout();
  } catch {
    return getDefaultLayout();
  }
};

const writeStoredLayout = () => {
  storage.set(getLayoutStorageKey(), JSON.stringify(normalizeLayout(state.layout)));
};

const readStoredActiveLeague = () => {
  const stored = storage.get(getActiveStorageKey());
  return stored && COMPETITIONS[stored] ? stored : null;
};

const writeStoredActiveLeague = () => {
  if (state.activeLeague && COMPETITIONS[state.activeLeague]) {
    storage.set(getActiveStorageKey(), state.activeLeague);
  }
};

const ensureActiveLeague = () => {
  if (state.activeLeague && state.layout.includes(state.activeLeague)) return;
  state.activeLeague = state.layout.find(Boolean) || 'premier';
};

const getSlotEl = (slotIndex) => slotEls.find((slot) => Number(slot.dataset.slot) === slotIndex) || null;

const buildSidebarSlotContent = (slotEl, leagueId, slotIndex) => {
  slotEl.innerHTML = '';
  slotEl.className = 'sidebar-item';
  if (leagueId) {
    const config = COMPETITIONS[leagueId];
    if (config.className) slotEl.classList.add(config.className);
    if (leagueId === state.activeLeague) slotEl.classList.add('active');
    slotEl.setAttribute('aria-label', config.label);
    slotEl.setAttribute('title', config.label);

    const img = document.createElement('img');
    img.src = config.logo;
    img.alt = config.label;
    img.className = 'sidebar-item-logo';
    slotEl.appendChild(img);
  } else {
    slotEl.classList.add('is-empty');
    slotEl.setAttribute('aria-label', `Add competition to slot ${slotIndex + 1}`);
    slotEl.setAttribute('title', 'Add competition');
    const placeholder = document.createElement('span');
    placeholder.className = 'sidebar-item-placeholder';
    placeholder.textContent = '+';
    slotEl.appendChild(placeholder);
  }

  slotEl.dataset.league = leagueId || '';
  slotEl.setAttribute('role', 'button');
  slotEl.setAttribute('tabindex', '0');

  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'sidebar-slot-edit';
  edit.dataset.slot = String(slotIndex);
  edit.setAttribute('aria-label', leagueId ? 'Change competition' : 'Add competition');
  edit.textContent = '+';
  slotEl.appendChild(edit);
};

const renderSidebar = () => {
  ensureActiveLeague();
  slotEls.forEach((slotEl, slotIndex) => {
    buildSidebarSlotContent(slotEl, state.layout[slotIndex] || null, slotIndex);
  });
};

const closePicker = () => {
  if (!pickerModal) return;
  pickerModal.classList.add('is-hidden');
  pickerModal.setAttribute('aria-hidden', 'true');
  state.openSlot = null;
};

const saveAndRender = () => {
  state.layout = normalizeLayout(state.layout);
  ensureActiveLeague();
  writeStoredLayout();
  writeStoredActiveLeague();
  renderSidebar();
};

const applyLeagueToSlot = (slotIndex, leagueId) => {
  if (!COMPETITIONS[leagueId]) return;
  const nextLayout = [...state.layout];
  const existingIndex = nextLayout.indexOf(leagueId);

  if (existingIndex !== -1 && existingIndex !== slotIndex) {
    [nextLayout[existingIndex], nextLayout[slotIndex]] = [nextLayout[slotIndex], nextLayout[existingIndex]];
  } else {
    nextLayout[slotIndex] = leagueId;
  }

  state.layout = nextLayout;
  state.activeLeague = leagueId;
  saveAndRender();
  closePicker();
};

const clearSlot = (slotIndex) => {
  const currentLeague = state.layout[slotIndex];
  if (!currentLeague) return;
  state.layout[slotIndex] = null;
  if (state.activeLeague === currentLeague) {
    state.activeLeague = state.layout.find((leagueId) => leagueId && leagueId !== currentLeague) || 'premier';
  }
  saveAndRender();
  closePicker();
  if (state.activeLeague) {
    const activeSlot = slotEls.find((slot) => slot.dataset.league === state.activeLeague);
    activeSlot?.click();
  }
};

const renderPickerOptions = () => {
  if (!pickerGrid || state.openSlot === null) return;
  pickerGrid.innerHTML = '';
  pickerTitle.textContent = `Customize Box ${state.openSlot + 1}`;

  COMPETITION_ORDER.forEach((leagueId) => {
    const config = COMPETITIONS[leagueId];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sidebar-picker-option';
    button.dataset.league = leagueId;
    if (state.layout[state.openSlot] === leagueId) button.classList.add('is-selected');

    const logo = document.createElement('img');
    logo.src = config.logo;
    logo.alt = config.label;
    button.appendChild(logo);
    button.appendChild(Object.assign(document.createElement('span'), { textContent: config.label }));
    pickerGrid.appendChild(button);
  });

  pickerClearBtn.disabled = !state.layout[state.openSlot];
};

const openPicker = (slotIndex) => {
  state.openSlot = slotIndex;
  renderPickerOptions();
  pickerModal.classList.remove('is-hidden');
  pickerModal.setAttribute('aria-hidden', 'false');
};

const buildPicker = () => {
  pickerModal = document.createElement('div');
  pickerModal.className = 'sidebar-picker-modal is-hidden';
  pickerModal.id = 'sidebar-picker-modal';
  pickerModal.setAttribute('aria-hidden', 'true');
  pickerModal.innerHTML = `
    <div class="sidebar-picker-window" role="dialog" aria-modal="true" aria-label="Customize competitions">
      <div class="sidebar-picker-head">
        <div class="sidebar-picker-title" id="sidebar-picker-title">Customize Box</div>
        <button class="sidebar-picker-close" type="button" aria-label="Close">×</button>
      </div>
      <div class="sidebar-picker-grid" id="sidebar-picker-grid"></div>
      <div class="sidebar-picker-actions">
        <button class="sidebar-picker-clear" type="button">Clear Box</button>
        <button class="sidebar-picker-reset" type="button">Reset Defaults</button>
      </div>
    </div>
  `;

  document.body.appendChild(pickerModal);
  pickerGrid = pickerModal.querySelector('#sidebar-picker-grid');
  pickerTitle = pickerModal.querySelector('#sidebar-picker-title');
  pickerClearBtn = pickerModal.querySelector('.sidebar-picker-clear');

  pickerModal.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target === pickerModal || target.closest('.sidebar-picker-close')) {
      closePicker();
      return;
    }

    const option = target.closest('.sidebar-picker-option');
    if (option && state.openSlot !== null) {
      const slotIndex = state.openSlot;
      applyLeagueToSlot(slotIndex, option.dataset.league);
      getSlotEl(slotIndex)?.click();
      return;
    }

    if (target.closest('.sidebar-picker-clear') && state.openSlot !== null) {
      clearSlot(state.openSlot);
      return;
    }

    if (target.closest('.sidebar-picker-reset')) {
      state.layout = getDefaultLayout();
      state.activeLeague = state.layout.find(Boolean) || 'premier';
      saveAndRender();
      closePicker();
      const activeSlot = slotEls.find((slot) => slot.dataset.league === state.activeLeague);
      activeSlot?.click();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && pickerModal && !pickerModal.classList.contains('is-hidden')) {
      closePicker();
    }
  });
};

const hydrateStateFromStorage = () => {
  state.layout = readStoredLayout();
  state.activeLeague = readStoredActiveLeague() || state.layout.find(Boolean) || 'premier';
  ensureActiveLeague();
};

export const activateSidebarLeague = (leagueId, options = {}) => {
  if (!COMPETITIONS[leagueId]) return null;

  let slotIndex = state.layout.indexOf(leagueId);
  if (slotIndex === -1 && options.ensureVisible) {
    slotIndex = state.layout.indexOf(null);
    if (slotIndex === -1) slotIndex = state.layout.length - 1;
    applyLeagueToSlot(slotIndex, leagueId);
  }

  if (slotIndex === -1) return null;

  state.activeLeague = leagueId;
  writeStoredActiveLeague();
  renderSidebar();
  return getSlotEl(slotIndex);
};

export const initSidebar = () => {
  sidebar = document.querySelector('#league-sidebar');
  if (!sidebar) return;

  slotEls = Array.from(sidebar.querySelectorAll('.sidebar-item[data-slot]'));
  buildPicker();
  hydrateStateFromStorage();
  renderSidebar();

  sidebar.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const editButton = target.closest('.sidebar-slot-edit');
    if (editButton) {
      event.stopPropagation();
      event.preventDefault();
      openPicker(Number(editButton.dataset.slot));
      return;
    }

    const slot = target.closest('.sidebar-item[data-slot]');
    if (!slot) return;
    const slotIndex = Number(slot.dataset.slot);
    const leagueId = state.layout[slotIndex];

    if (!leagueId) {
      openPicker(slotIndex);
      return;
    }

    state.activeLeague = leagueId;
    writeStoredActiveLeague();
    renderSidebar();
  });

  sidebar.addEventListener('keydown', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const slot = target.closest('.sidebar-item[data-slot]');
    if (!slot) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    slot.click();
  });

  onEvent('fodr:user', () => {
    hydrateStateFromStorage();
    renderSidebar();
  });

  onEvent('fodr:logout', () => {
    hydrateStateFromStorage();
    renderSidebar();
  });
};
