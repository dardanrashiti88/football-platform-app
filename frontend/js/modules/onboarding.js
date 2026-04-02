import { onEvent } from '../core/events.js';
import { loadUser } from './auth.js';
import { COMPETITION_ORDER, getCompetitionConfig } from './competition-catalog.js';
import { completeOnboarding, getPreferences, updatePreferences } from './preferences.js';
import { getTeamOptions } from './search-data.js';

let modal = null;
let favoriteTeamSelect = null;
let leaguesGrid = null;
let statusLine = null;
let pendingAutoOpenForUser = null;
const promptedUsersThisSession = new Set();

const getUserPromptKey = (user = loadUser()) => {
  if (!user) return '';
  if (user.id) return `user:${user.id}`;
  if (user.email) return `email:${String(user.email).toLowerCase()}`;
  if (user.username) return `username:${String(user.username).toLowerCase()}`;
  return '';
};

const buildLeagueOption = (leagueId, selectedSet) => {
  const config = getCompetitionConfig(leagueId);
  if (!config) return '';
  return `
    <label class="onboarding-league-option">
      <input type="checkbox" value="${leagueId}" ${selectedSet.has(leagueId) ? 'checked' : ''} />
      <img src="${config.logo}" alt="${config.label}" />
      <span>${config.label}</span>
    </label>
  `;
};

const renderForm = async () => {
  if (!modal || !favoriteTeamSelect || !leaguesGrid) return;
  const preferences = getPreferences();
  const teamOptions = await getTeamOptions();
  favoriteTeamSelect.innerHTML = '<option value="">No favorite team yet</option>';
  teamOptions.forEach((option) => {
    const node = document.createElement('option');
    node.value = option.value;
    node.textContent = option.label;
    if (preferences.favoriteTeam && preferences.favoriteTeam === option.value) {
      node.selected = true;
    }
    favoriteTeamSelect.appendChild(node);
  });

  const selectedSet = new Set(preferences.favoriteLeagues || []);
  leaguesGrid.innerHTML = COMPETITION_ORDER.map((leagueId) => buildLeagueOption(leagueId, selectedSet)).join('');
  statusLine.textContent = preferences.onboardingComplete
    ? 'You can change this any time.'
    : 'Choose the comps you want pinned first.';
};

export const openOnboarding = async () => {
  if (!modal) return;
  await renderForm();
  modal.classList.remove('is-hidden');
  modal.setAttribute('aria-hidden', 'false');
};

const closeOnboarding = () => {
  if (!modal) return;
  modal.classList.add('is-hidden');
  modal.setAttribute('aria-hidden', 'true');
};

const collectSelectedLeagues = () =>
  Array.from(leaguesGrid?.querySelectorAll('input[type="checkbox"]:checked') || []).map((input) => input.value);

const saveOnboarding = async () => {
  const favoriteTeam = favoriteTeamSelect?.value || '';
  const favoriteLeagues = collectSelectedLeagues();
  statusLine.textContent = 'Saving your setup...';
  await completeOnboarding({ favoriteTeam, favoriteLeagues });
  statusLine.textContent = 'Saved.';
  closeOnboarding();
};

const skipOnboarding = async () => {
  statusLine.textContent = 'Keeping the current defaults...';
  await updatePreferences({ onboardingComplete: true });
  closeOnboarding();
};

export const initOnboarding = () => {
  modal = document.createElement('div');
  modal.className = 'onboarding-modal is-hidden';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="onboarding-window" role="dialog" aria-modal="true" aria-label="First-time setup">
      <div class="onboarding-copy">
        <p class="onboarding-kicker">Welcome to FODR</p>
        <h3>Set up your football home</h3>
        <p>We’ll pin your favorite competitions on the homepage and sidebar so the app feels like yours from the start.</p>
      </div>
      <div class="onboarding-field">
        <label for="onboarding-favorite-team">Favorite team</label>
        <select id="onboarding-favorite-team" class="select"></select>
      </div>
      <div class="onboarding-field">
        <label>Favorite competitions</label>
        <div class="onboarding-leagues"></div>
      </div>
      <div class="onboarding-status"></div>
      <div class="onboarding-actions">
        <button class="setting-btn" type="button" data-onboarding-action="skip">Use Defaults</button>
        <button class="setting-btn" type="button" data-onboarding-action="save">Save Setup</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  favoriteTeamSelect = modal.querySelector('#onboarding-favorite-team');
  leaguesGrid = modal.querySelector('.onboarding-leagues');
  statusLine = modal.querySelector('.onboarding-status');

  modal.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target === modal) {
      closeOnboarding();
      return;
    }
    const action = target.closest('[data-onboarding-action]')?.getAttribute('data-onboarding-action');
    if (action === 'save') {
      void saveOnboarding();
    }
    if (action === 'skip') {
      void skipOnboarding();
    }
  });

  onEvent('fodr:user', (event) => {
    const user = event?.detail?.user || loadUser();
    const promptKey = getUserPromptKey(user);
    if (!promptKey || promptedUsersThisSession.has(promptKey)) {
      pendingAutoOpenForUser = null;
      return;
    }
    pendingAutoOpenForUser = promptKey;
  });

  onEvent('fodr:logout', () => {
    pendingAutoOpenForUser = null;
  });

  onEvent('fodr:preferences', async () => {
    const preferences = getPreferences();
    if (!pendingAutoOpenForUser) return;

    const currentPromptKey = getUserPromptKey();
    if (!currentPromptKey || currentPromptKey !== pendingAutoOpenForUser) return;

    pendingAutoOpenForUser = null;
    if (!preferences.onboardingComplete) {
      promptedUsersThisSession.add(currentPromptKey);
      await openOnboarding();
    }
  });
};
