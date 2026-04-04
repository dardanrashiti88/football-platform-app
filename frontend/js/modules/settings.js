import { deleteJson, putJson } from '../core/api.js';
import { emitEvent, onEvent } from '../core/events.js';
import { showHome, showSettings } from '../core/views.js';
import { loadUser, logoutCurrentUser, openAuthModal, syncSessionUser } from './auth.js';
import { COMPETITION_ORDER, getCompetitionConfig } from './competition-catalog.js';
import { initNewsAdmin } from './news-admin.js';
import { openOnboarding } from './onboarding.js';
import { getPreferences, resetPreferences, updatePreferences } from './preferences.js';
import { getTeamOptions } from './search-data.js';
import { storage } from '../core/storage.js';

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
const notifyQuietToggle = document.querySelector('#settings-notify-quiet');
const notifyAutoReadToggle = document.querySelector('#settings-notify-auto-read');
const darkModeToggle = document.querySelector('#settings-dark-mode');
const animationsToggle = document.querySelector('#settings-animations');
const compactModeToggle = document.querySelector('#settings-compact-mode');
const searchShortcutToggle = document.querySelector('#settings-search-shortcut');
const defaultViewSelect = document.querySelector('#settings-default-view');
const rememberLastViewToggle = document.querySelector('#settings-remember-last-view');
const cardgameConfirmSellToggle = document.querySelector('#settings-cardgame-confirm-sell');
const cardgameConfirmDiscardToggle = document.querySelector('#settings-cardgame-confirm-discard');
const cardgameOpenInventoryToggle = document.querySelector('#settings-cardgame-open-inventory');
const privateProfileToggle = document.querySelector('#settings-private-profile');
const showFollowCountsToggle = document.querySelector('#settings-show-follow-counts');
const showOnlineStatusToggle = document.querySelector('#settings-show-online-status');
const showEmailProfileToggle = document.querySelector('#settings-show-email-profile');
const preferencesStatus = document.querySelector('#settings-preferences-status');
const accountStatus = document.querySelector('#settings-account-status');
const savePreferencesBtn = document.querySelector('#settings-save-preferences');
const openOnboardingBtn = document.querySelector('#settings-open-onboarding');
const clearNotificationsBtn = document.querySelector('#settings-clear-notifications');
const resetPreferencesBtn = document.querySelector('#settings-reset-preferences');
const editUsernameBtn = document.querySelector('#settings-edit-username');
const editEmailBtn = document.querySelector('#settings-edit-email');
const changePasswordBtn = document.querySelector('#settings-change-password');
const avatarInput = document.querySelector('#settings-avatar-input');
const deleteAccountBtn = document.querySelector('#settings-delete-account');

const PROFILE_IMAGE_KEY = 'fodrProfileImage';
const PROFILE_FRAME_KEY = 'fodrProfileFrame';

const setPreferencesStatus = (text) => {
  if (preferencesStatus) preferencesStatus.textContent = text;
};

const setAccountStatus = (text) => {
  if (accountStatus) accountStatus.textContent = text;
};

const getProfileImageKey = (user) => `${PROFILE_IMAGE_KEY}:${user?.username || 'guest'}`;
const getProfileFrameKey = (user) => `${PROFILE_FRAME_KEY}:${user?.username || 'guest'}`;

const migrateIdentityStorage = (previousUser, nextUser) => {
  if (!previousUser?.username || !nextUser?.username || previousUser.username === nextUser.username) return;

  const previousImageKey = getProfileImageKey(previousUser);
  const nextImageKey = getProfileImageKey(nextUser);
  const previousFrameKey = getProfileFrameKey(previousUser);
  const nextFrameKey = getProfileFrameKey(nextUser);

  const previousImage = storage.get(previousImageKey);
  if (previousImage && !storage.get(nextImageKey)) {
    storage.set(nextImageKey, previousImage);
    storage.remove(previousImageKey);
  }

  const previousFrame = storage.get(previousFrameKey);
  if (previousFrame && !storage.get(nextFrameKey)) {
    storage.set(nextFrameKey, previousFrame);
    storage.remove(previousFrameKey);
  }
};

const applyAppearancePreview = () => {
  const root = document.documentElement;
  const body = document.body;
  const app = document.querySelector('.app');
  const accent = Array.from(accentRadios).find((radio) => radio.checked)?.value || '#e7c84b';
  const darkMode = Boolean(darkModeToggle?.checked);
  const compactMode = Boolean(compactModeToggle?.checked);
  const reduceMotion = animationsToggle?.checked === false;

  root.style.setProperty('--ui-accent', accent);
  root.classList.toggle('theme-night', darkMode);
  body.classList.toggle('theme-night', darkMode);
  app?.classList.toggle('theme-night', darkMode);
  root.classList.toggle('compact-ui', compactMode);
  body.classList.toggle('compact-ui', compactMode);
  app?.classList.toggle('compact-ui', compactMode);
  root.classList.toggle('reduce-motion', reduceMotion);
  body.classList.toggle('reduce-motion', reduceMotion);
  app?.classList.toggle('reduce-motion', reduceMotion);
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
  if (notifyQuietToggle) notifyQuietToggle.checked = preferences.notifications.quietMode === true;
  if (notifyAutoReadToggle) notifyAutoReadToggle.checked = preferences.notifications.autoReadOnOpen === true;
  if (darkModeToggle) darkModeToggle.checked = preferences.ui.darkMode === true;
  if (animationsToggle) animationsToggle.checked = preferences.ui.animationsEnabled !== false;
  if (compactModeToggle) compactModeToggle.checked = preferences.ui.compactMode === true;
  if (searchShortcutToggle) searchShortcutToggle.checked = preferences.ui.searchShortcutEnabled !== false;
  if (defaultViewSelect) defaultViewSelect.value = preferences.launch.defaultView || 'home';
  if (rememberLastViewToggle) rememberLastViewToggle.checked = preferences.launch.rememberLastView !== false;
  if (cardgameConfirmSellToggle) cardgameConfirmSellToggle.checked = preferences.cardgame.confirmQuickSell !== false;
  if (cardgameConfirmDiscardToggle) cardgameConfirmDiscardToggle.checked = preferences.cardgame.confirmDiscard !== false;
  if (cardgameOpenInventoryToggle) cardgameOpenInventoryToggle.checked = preferences.cardgame.openInventoryAfterSave === true;
  if (privateProfileToggle) privateProfileToggle.checked = preferences.privacy.profileVisibility === 'private';
  if (showFollowCountsToggle) showFollowCountsToggle.checked = preferences.privacy.showFollowCounts !== false;
  if (showOnlineStatusToggle) showOnlineStatusToggle.checked = preferences.privacy.showOnlineStatus !== false;
  if (showEmailProfileToggle) showEmailProfileToggle.checked = preferences.privacy.showEmailOnProfile !== false;

  accentRadios.forEach((radio) => {
    radio.checked = radio.value === preferences.accentColor;
  });

  applyAppearancePreview();
  setPreferencesStatus(
    preferences.updatedAt
      ? `Last synced ${new Date(preferences.updatedAt).toLocaleString()}`
      : 'Ready'
  );
};

const collectSelectedLeagues = () =>
  Array.from(favoriteLeaguesRoot?.querySelectorAll('input[type="checkbox"]:checked') || []).map((input) => input.value);

const savePreferences = async () => {
  setPreferencesStatus('Saving...');
  const next = await updatePreferences({
    favoriteTeam: favoriteTeamSelect?.value || '',
    favoriteLeagues: collectSelectedLeagues(),
    prioritizeFavoriteTeams: Boolean(prioritizeFavoriteTeamsToggle?.checked),
    accentColor: Array.from(accentRadios).find((radio) => radio.checked)?.value || '#e7c84b',
    notifications: {
      matches: Boolean(notifyMatchesToggle?.checked),
      goals: Boolean(notifyGoalsToggle?.checked),
      social: Boolean(notifySocialToggle?.checked),
      directMessages: Boolean(notifyDirectToggle?.checked),
      quietMode: Boolean(notifyQuietToggle?.checked),
      autoReadOnOpen: Boolean(notifyAutoReadToggle?.checked)
    },
    ui: {
      darkMode: Boolean(darkModeToggle?.checked),
      compactMode: Boolean(compactModeToggle?.checked),
      animationsEnabled: Boolean(animationsToggle?.checked),
      searchShortcutEnabled: Boolean(searchShortcutToggle?.checked)
    },
    launch: {
      defaultView: defaultViewSelect?.value || 'home',
      rememberLastView: Boolean(rememberLastViewToggle?.checked)
    },
    cardgame: {
      confirmQuickSell: Boolean(cardgameConfirmSellToggle?.checked),
      confirmDiscard: Boolean(cardgameConfirmDiscardToggle?.checked),
      openInventoryAfterSave: Boolean(cardgameOpenInventoryToggle?.checked)
    },
    privacy: {
      profileVisibility: privateProfileToggle?.checked ? 'private' : 'public',
      showOnlineStatus: Boolean(showOnlineStatusToggle?.checked),
      showFollowCounts: Boolean(showFollowCountsToggle?.checked),
      showEmailOnProfile: Boolean(showEmailProfileToggle?.checked)
    }
  });

  applyAppearancePreview();
  setPreferencesStatus(
    next.updatedAt
      ? `Saved · ${new Date(next.updatedAt).toLocaleTimeString()}`
      : 'Saved.'
  );
};

const requireAccount = () => {
  const user = loadUser();
  if (user?.id) return user;
  openAuthModal('login');
  setAccountStatus('Log in first to change account settings.');
  return null;
};

const updateAccount = async (payload, successMessage) => {
  const previousUser = requireAccount();
  if (!previousUser) return;
  setAccountStatus('Saving account changes...');
  try {
    const data = await putJson(`/account/${previousUser.id}`, payload);
    const nextUser = data?.user || previousUser;
    migrateIdentityStorage(previousUser, nextUser);
    syncSessionUser(nextUser, { reason: 'account-update' });
    setAccountStatus(successMessage);
  } catch (error) {
    setAccountStatus(error.message || 'Account update failed.');
  }
};

const handleUsernameEdit = async () => {
  const user = requireAccount();
  if (!user) return;
  const nextUsername = window.prompt('Enter your new username:', user.username || '');
  if (!nextUsername || nextUsername.trim() === user.username) return;
  await updateAccount({ username: nextUsername.trim() }, 'Username updated.');
};

const handleEmailEdit = async () => {
  const user = requireAccount();
  if (!user) return;
  const nextEmail = window.prompt('Enter your new email:', user.email || '');
  if (!nextEmail || nextEmail.trim().toLowerCase() === String(user.email || '').toLowerCase()) return;
  const currentPassword = window.prompt('Enter your current password to confirm the email change:');
  if (!currentPassword) return;
  await updateAccount(
    { email: nextEmail.trim().toLowerCase(), currentPassword },
    'Email updated.'
  );
};

const handlePasswordChange = async () => {
  const user = requireAccount();
  if (!user) return;
  const currentPassword = window.prompt('Enter your current password:');
  if (!currentPassword) return;
  const nextPassword = window.prompt('Enter your new password (min 6 characters):');
  if (!nextPassword) return;
  await updateAccount(
    { currentPassword, newPassword: nextPassword },
    'Password updated.'
  );
};

const handleAvatarUpload = () => {
  const user = loadUser();
  const file = avatarInput?.files?.[0];
  if (!file || !avatarInput) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = typeof reader.result === 'string' ? reader.result : '';
    if (!dataUrl) return;
    storage.set(getProfileImageKey(user), dataUrl);
    const avatar = document.querySelector('#profile-avatar');
    if (avatar instanceof HTMLImageElement) {
      avatar.src = dataUrl;
    }
    const dot = document.querySelector('.avatar-dot');
    if (dot instanceof HTMLElement) {
      dot.style.backgroundImage = `url('${dataUrl}')`;
      dot.classList.add('has-avatar');
    }
    setAccountStatus('Profile picture updated.');
    if (user) {
      syncSessionUser(user, { reason: 'avatar-update' });
    }
    avatarInput.value = '';
  };
  reader.readAsDataURL(file);
};

const handleDeleteAccount = async () => {
  const user = requireAccount();
  if (!user) return;
  const confirmation = window.prompt('Type DELETE to remove your account permanently:');
  if (!confirmation) return;
  const currentPassword = window.prompt('Enter your current password to confirm account deletion:');
  if (!currentPassword) return;

  setAccountStatus('Deleting account...');
  try {
    await deleteJson(`/account/${user.id}`, {
      confirmation,
      currentPassword
    });
    logoutCurrentUser();
    setAccountStatus('Account deleted.');
    showHome();
  } catch (error) {
    setAccountStatus(error.message || 'Account deletion failed.');
  }
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
      applyAppearancePreview();
      setPreferencesStatus('Unsaved changes');
    });
  });

  [darkModeToggle, animationsToggle, compactModeToggle].forEach((input) => {
    input?.addEventListener('change', () => {
      applyAppearancePreview();
      setPreferencesStatus('Unsaved changes');
    });
  });

  [
    favoriteTeamSelect,
    prioritizeFavoriteTeamsToggle,
    notifyMatchesToggle,
    notifyGoalsToggle,
    notifySocialToggle,
    notifyDirectToggle,
    notifyQuietToggle,
    notifyAutoReadToggle,
    defaultViewSelect,
    rememberLastViewToggle,
    searchShortcutToggle,
    cardgameConfirmSellToggle,
    cardgameConfirmDiscardToggle,
    cardgameOpenInventoryToggle,
    privateProfileToggle,
    showFollowCountsToggle,
    showOnlineStatusToggle,
    showEmailProfileToggle
  ].forEach((input) => {
    input?.addEventListener('change', () => {
      setPreferencesStatus('Unsaved changes');
    });
  });

  favoriteLeaguesRoot?.addEventListener('change', () => {
    setPreferencesStatus('Unsaved changes');
  });

  savePreferencesBtn?.addEventListener('click', () => {
    void savePreferences();
  });

  openOnboardingBtn?.addEventListener('click', () => {
    void openOnboarding();
  });

  clearNotificationsBtn?.addEventListener('click', () => {
    emitEvent('fodr:notifications:clear');
    setPreferencesStatus('Notification history cleared');
  });

  resetPreferencesBtn?.addEventListener('click', () => {
    const confirmed = window.confirm('Reset your saved settings, favorites, and layout back to default?');
    if (!confirmed) return;
    void resetPreferences().then(() => {
      applyAppearancePreview();
      setPreferencesStatus('Preferences reset to default');
    });
  });

  editUsernameBtn?.addEventListener('click', () => {
    void handleUsernameEdit();
  });

  editEmailBtn?.addEventListener('click', () => {
    void handleEmailEdit();
  });

  changePasswordBtn?.addEventListener('click', () => {
    void handlePasswordChange();
  });

  avatarInput?.addEventListener('change', handleAvatarUpload);

  deleteAccountBtn?.addEventListener('click', () => {
    void handleDeleteAccount();
  });

  onEvent('fodr:preferences', () => {
    void fillSettingsFromPreferences();
  });

  onEvent('fodr:user', () => {
    setAccountStatus('Ready');
  });

  onEvent('fodr:logout', () => {
    setAccountStatus('Ready');
    void fillSettingsFromPreferences();
  });

  void fillSettingsFromPreferences();
  initNewsAdmin();
};
