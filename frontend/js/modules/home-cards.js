import { onEvent } from '../core/events.js';
import {
  COMPETITION_ORDER,
  getCompetitionConfig,
  getDefaultCompetitionLayout,
  normalizeCompetitionLayout,
  SLOT_COUNT
} from './competition-catalog.js';
import { getPreferences, saveHomeLayout } from './preferences.js';

const state = {
  layout: [],
  openSlot: null
};

let leagueView = null;
let leagueGrid = null;
let cardMap = new Map();
let pickerModal = null;
let pickerGrid = null;
let pickerTitle = null;
let pickerClearBtn = null;

const getCardConfig = (leagueId) => {
  const config = getCompetitionConfig(leagueId);
  const card = cardMap.get(leagueId);
  const logo = card?.querySelector('.league-logo img');
  const title = card?.querySelector('.league-title')?.textContent?.trim() || config?.label || leagueId;
  return {
    label: title,
    logo: logo?.getAttribute('src') || config?.logo || '',
    alt: logo?.getAttribute('alt') || title
  };
};

const buildPlaceholderCard = (slotIndex) => {
  const placeholder = document.createElement('button');
  placeholder.type = 'button';
  placeholder.className = 'league-card home-card-placeholder';
  placeholder.dataset.slot = String(slotIndex);
  placeholder.setAttribute('aria-label', `Add competition to card ${slotIndex + 1}`);
  placeholder.innerHTML = `
    <span class="home-card-placeholder-plus" aria-hidden="true">+</span>
    <span class="home-card-placeholder-label">Add Competition</span>
  `;
  return placeholder;
};

const renderLayout = () => {
  if (!leagueGrid) return;

  leagueGrid.querySelectorAll('.home-card-placeholder').forEach((node) => node.remove());

  cardMap.forEach((card) => {
    card.classList.add('is-layout-hidden');
    card.removeAttribute('data-layout-slot');
  });

  const fragment = document.createDocumentFragment();

  state.layout.forEach((leagueId, slotIndex) => {
    if (leagueId) {
      const card = cardMap.get(leagueId);
      if (!card) {
        fragment.appendChild(buildPlaceholderCard(slotIndex));
        return;
      }

      card.classList.remove('is-layout-hidden');
      card.dataset.layoutSlot = String(slotIndex);
      fragment.appendChild(card);
      return;
    }

    fragment.appendChild(buildPlaceholderCard(slotIndex));
  });

  leagueGrid.appendChild(fragment);
};

const closePicker = () => {
  if (!pickerModal) return;
  pickerModal.classList.add('is-hidden');
  pickerModal.setAttribute('aria-hidden', 'true');
  state.openSlot = null;
};

const saveAndRender = () => {
  state.layout = normalizeCompetitionLayout(state.layout);
  void saveHomeLayout(state.layout);
  renderLayout();
};

const applyLeagueToSlot = (slotIndex, leagueId) => {
  if (!COMPETITION_ORDER.includes(leagueId)) return;

  const nextLayout = [...state.layout];
  const existingIndex = nextLayout.indexOf(leagueId);

  if (existingIndex !== -1 && existingIndex !== slotIndex) {
    [nextLayout[existingIndex], nextLayout[slotIndex]] = [nextLayout[slotIndex], nextLayout[existingIndex]];
  } else {
    nextLayout[slotIndex] = leagueId;
  }

  state.layout = nextLayout;
  saveAndRender();
  closePicker();
};

const clearSlot = (slotIndex) => {
  state.layout[slotIndex] = null;
  saveAndRender();
  closePicker();
};

const renderPickerOptions = () => {
  if (!pickerGrid || state.openSlot === null) return;

  pickerGrid.innerHTML = '';
  pickerTitle.textContent = `Customize Card ${state.openSlot + 1}`;

  COMPETITION_ORDER.forEach((leagueId) => {
    const config = getCardConfig(leagueId);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sidebar-picker-option';
    button.dataset.league = leagueId;
    if (state.layout[state.openSlot] === leagueId) button.classList.add('is-selected');

    if (config.logo) {
      const logo = document.createElement('img');
      logo.src = config.logo;
      logo.alt = config.alt;
      button.appendChild(logo);
    }

    const label = document.createElement('span');
    label.textContent = config.label;
    button.appendChild(label);
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
  pickerModal.id = 'home-card-picker-modal';
  pickerModal.setAttribute('aria-hidden', 'true');
  pickerModal.innerHTML = `
    <div class="sidebar-picker-window" role="dialog" aria-modal="true" aria-label="Customize home cards">
      <div class="sidebar-picker-head">
        <div class="sidebar-picker-title" id="home-card-picker-title">Customize Card</div>
        <button class="sidebar-picker-close" type="button" aria-label="Close">×</button>
      </div>
      <div class="sidebar-picker-grid" id="home-card-picker-grid"></div>
      <div class="sidebar-picker-actions">
        <button class="sidebar-picker-clear" type="button">Clear Box</button>
      </div>
    </div>
  `;

  document.body.appendChild(pickerModal);
  pickerGrid = pickerModal.querySelector('#home-card-picker-grid');
  pickerTitle = pickerModal.querySelector('#home-card-picker-title');
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
      applyLeagueToSlot(state.openSlot, option.dataset.league);
      return;
    }

    if (target.closest('.sidebar-picker-clear') && state.openSlot !== null) {
      clearSlot(state.openSlot);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && pickerModal && !pickerModal.classList.contains('is-hidden')) {
      closePicker();
    }
  });
};

export const initHomeCards = () => {
  leagueView = document.querySelector('.league-view');
  leagueGrid = document.querySelector('.league-grid');
  if (!leagueView || !leagueGrid) return;

  cardMap = new Map(
    Array.from(leagueGrid.querySelectorAll('.league-card[data-league]')).map((card) => [card.dataset.league, card])
  );

  if (!cardMap.size) return;

  state.layout = normalizeCompetitionLayout(getPreferences().homeLayout || getDefaultCompetitionLayout());
  buildPicker();
  renderLayout();

  leagueView.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const header = target.closest('.league-card[data-layout-slot] .league-header');
    if (header) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const card = header.closest('.league-card[data-layout-slot]');
      if (!card) return;
      openPicker(Number(card.dataset.layoutSlot));
      return;
    }

    const placeholder = target.closest('.home-card-placeholder');
    if (placeholder) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openPicker(Number(placeholder.dataset.slot));
    }
  });

  onEvent('fodr:preferences', () => {
    state.layout = normalizeCompetitionLayout(getPreferences().homeLayout || getDefaultCompetitionLayout());
    renderLayout();
  });
};
