import { showSettings, showHome } from '../core/views.js';
import { onEvent } from '../core/events.js';
import { COMPETITION_ORDER, getCompetitionConfig } from './competition-catalog.js';
import { getPreferences, updatePreferences } from './preferences.js';
import { getTeamOptions } from './search-data.js';
import { initNewsAdmin } from './news-admin.js';
import { openOnboarding } from './onboarding.js';

const settingsOpen = document.querySelector('#settings-open');
const settingsBack = document.querySelector('#settings-back');
const accentRadios = document.querySelectorAll('input[name="accent"]');
const favoriteTeamSelect = document.querySelector('#settings-favorite-team');
const favoriteLeaguesRoot = document.querySelector('#settings-favorite-leagues');
const prioritizeFavoriteTeamsToggle = document.querySelector('#settings-prioritize-favorites');
const notifyMatchesToggle = document.querySelector('#settings-notify-matches');
const notifyGoalsToggle = document.querySelector('#settings-notify-goals');
const notifySocialToggle = document.querySelector('#settings-notify-social');
const notifyDirectToggle = document.querySelector('#settings-notify-direct');
const preferencesStatus = document.querySelector('#settings-preferences-status');
const savePreferencesBtn = document.querySelector('#settings-save-preferences');
const openOnboardingBtn = document.querySelector('#settings-open-onboarding');

const applyAccent = (value) => {
  if (!value) return;
  document.documentElement.style.setProperty('--ui-accent', value);
};

const renderFavoriteLeagueOptions = (selected) => {
  if (!favoriteLeaguesRoot) return;
  const selectedSet = new Set(selected || []);
  favoriteLeaguesRoot.innerHTML = COMPETITION_ORDER.map((leagueId) => {
    const config = getCompetitionConfig(leagueId);
    if (!config) return '';
    return `
      <label><input type="checkbox" value="${leagueId}" ${selectedSet.has(leagueId) ? 'checked' : ''} /> ${config.label}</label>
    `;
  }).join('');
};

const fillSettingsFromPreferences = async () => {
  const preferences = getPreferences();
  if (favoriteTeamSelect && favoriteTeamSelect.options.length <= 1) {
    const teams = await getTeamOptions();
    teams.forEach((option) => {
      const node = document.createElement('option');
      node.value = option.value;
      node.textContent = option.label;
      favoriteTeamSelect.appendChild(node);
    });
  }

  renderFavoriteLeagueOptions(preferences.favoriteLeagues);

  if (favoriteTeamSelect) favoriteTeamSelect.value = preferences.favoriteTeam || '';
  if (prioritizeFavoriteTeamsToggle) prioritizeFavoriteTeamsToggle.checked = preferences.prioritizeFavoriteTeams !== false;
  if (notifyMatchesToggle) notifyMatchesToggle.checked = preferences.notifications.matches !== false;
  if (notifyGoalsToggle) notifyGoalsToggle.checked = preferences.notifications.goals !== false;
  if (notifySocialToggle) notifySocialToggle.checked = preferences.notifications.social !== false;
  if (notifyDirectToggle) notifyDirectToggle.checked = preferences.notifications.directMessages !== false;

  accentRadios.forEach((radio) => {
    radio.checked = radio.value === preferences.accentColor;
  });
  applyAccent(preferences.accentColor);

  if (preferencesStatus) {
    preferencesStatus.textContent = preferences.updatedAt
      ? `Last synced ${new Date(preferences.updatedAt).toLocaleString()}`
      : 'Ready';
  }
};

const collectSelectedLeagues = () =>
  Array.from(favoriteLeaguesRoot?.querySelectorAll('input[type="checkbox"]:checked') || []).map((input) => input.value);

const savePreferences = async () => {
  if (preferencesStatus) preferencesStatus.textContent = 'Saving...';
  const next = await updatePreferences({
    favoriteTeam: favoriteTeamSelect?.value || '',
    favoriteLeagues: collectSelectedLeagues(),
    prioritizeFavoriteTeams: Boolean(prioritizeFavoriteTeamsToggle?.checked),
    accentColor: Array.from(accentRadios).find((radio) => radio.checked)?.value || '#e7c84b',
    notifications: {
      matches: Boolean(notifyMatchesToggle?.checked),
      goals: Boolean(notifyGoalsToggle?.checked),
      social: Boolean(notifySocialToggle?.checked),
      directMessages: Boolean(notifyDirectToggle?.checked)
    }
  });
  applyAccent(next.accentColor);
  if (preferencesStatus) preferencesStatus.textContent = 'Saved.';
};

export const initSettings = () => {
  settingsOpen?.addEventListener('click', () => {
    showSettings();
    void fillSettingsFromPreferences();
  });

  settingsBack?.addEventListener('click', () => {
    showHome();
  });

  accentRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        applyAccent(radio.value);
      }
    });
  });

  savePreferencesBtn?.addEventListener('click', () => {
    void savePreferences();
  });

  openOnboardingBtn?.addEventListener('click', () => {
    void openOnboarding();
  });

  onEvent('fodr:preferences', () => {
    void fillSettingsFromPreferences();
  });

  void fillSettingsFromPreferences();
  initNewsAdmin();
};
