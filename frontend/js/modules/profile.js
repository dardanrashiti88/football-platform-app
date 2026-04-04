import { storage } from '../core/storage.js';
import { onEvent } from '../core/events.js';
import { loadUser } from './auth.js';
import { closeProfile, showSettings } from '../core/views.js';
import { getPreferences } from './preferences.js';
import { getFollowedPlayers, getFollowedTeams } from './follows.js';

const PROFILE_IMAGE_KEY = 'fodrProfileImage';
const PROFILE_FRAME_KEY = 'fodrProfileFrame';
const DEFAULT_AVATAR = '../images/icons/Copy_of_User-removebg-preview.png';
const DEFAULT_FRAME = 'classic';

const getImageKey = (user) => {
  const username = user?.username || 'guest';
  return `${PROFILE_IMAGE_KEY}:${username}`;
};

const getFrameKey = (user) => {
  const username = user?.username || 'guest';
  return `${PROFILE_FRAME_KEY}:${username}`;
};

const setTopbarAvatar = (src) => {
  const dot = document.querySelector('.avatar-dot');
  if (!dot) return;
  if (src) {
    dot.style.backgroundImage = `url('${src}')`;
    dot.classList.add('has-avatar');
  } else {
    dot.style.backgroundImage = '';
    dot.classList.remove('has-avatar');
  }
};

const setText = (el, value) => {
  if (!el) return;
  el.textContent = value;
};

const normalizeFrameValue = (value) => {
  const allowed = new Set(['classic', 'royal', 'pulse', 'emerald', 'midnight']);
  return allowed.has(value) ? value : DEFAULT_FRAME;
};

const applyProfileFrame = (value) => {
  const frame = document.querySelector('.profile-avatar-frame');
  const options = document.querySelectorAll('[data-profile-frame]');
  const normalized = normalizeFrameValue(value);
  if (frame) {
    frame.classList.remove(
      'frame-classic',
      'frame-royal',
      'frame-pulse',
      'frame-emerald',
      'frame-midnight'
    );
    frame.classList.add(`frame-${normalized}`);
  }
  options.forEach((option) => {
    option.classList.toggle('is-active', option.dataset.profileFrame === normalized);
  });
  return normalized;
};

const saveProfileFrame = (frame) => {
  const user = loadUser();
  storage.set(getFrameKey(user), normalizeFrameValue(frame));
};

const loadProfileFrame = (user) => {
  const stored = storage.get(getFrameKey(user));
  return applyProfileFrame(stored || DEFAULT_FRAME);
};

const formatJoinedLabel = (user) => {
  if (!user?.created_at) return 'Member: Guest Mode';
  const date = new Date(user.created_at);
  if (Number.isNaN(date.getTime())) return 'Member: FOD Account';
  return `Member: ${date.toLocaleDateString([], { month: 'short', year: 'numeric' })}`;
};

const buildIdentityLine = (user, preferences) => {
  if (!user) {
    return 'You are browsing as a guest. Log in to sync your football identity, cardgame progress, and preferences.';
  }

  const firstName = String(user.first_name || '').trim();
  const lastName = String(user.last_name || '').trim();
  const favoriteTeam = String(preferences.favoriteTeam || '').trim();
  const namePart = [firstName, lastName].filter(Boolean).join(' ');

  if (namePart && favoriteTeam) {
    return `${namePart} is building a profile around ${favoriteTeam}, custom alerts, and a tailored football home screen.`;
  }

  if (favoriteTeam) {
    return `This profile is tuned around ${favoriteTeam}, followed teams, player alerts, and your football setup.`;
  }

  return 'This profile is ready to hold your favorite clubs, alert setup, search preferences, and cardgame progress.';
};

const formatFavoriteLeagues = (preferences) => {
  const leagues = Array.isArray(preferences?.favoriteLeagues) ? preferences.favoriteLeagues : [];
  if (!leagues.length) return 'No favorite competitions chosen yet';
  return leagues
    .map((league) =>
      ({
        premier: 'Premier League',
        ucl: 'Champions League',
        laliga: 'LaLiga',
        bundesliga: 'Bundesliga',
        seriea: 'Serie A',
        championship: 'Championship',
        ligue1: 'Ligue 1',
        facup: 'FA Cup',
        carabaocup: 'Carabao Cup',
        europa: 'Europa League',
        conference: 'Conference League',
        worldcup: 'World Cup'
      }[league] || league)
    )
    .join(' · ');
};

const formatAlertSummary = (preferences) => {
  const notifications = preferences?.notifications || {};
  const enabled = [
    notifications.matches !== false,
    notifications.goals !== false,
    notifications.social !== false,
    notifications.directMessages !== false
  ].filter(Boolean).length;
  return `Alerts: ${enabled}/4 active`;
};

const formatDateValue = (value) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
};

const copyProfileHandle = async () => {
  const handle = document.querySelector('#profile-handle')?.textContent?.trim();
  if (!handle) return;
  try {
    await navigator.clipboard.writeText(handle);
    const statusTitle = document.querySelector('#profile-status-title');
    const statusCopy = document.querySelector('#profile-status-copy');
    setText(statusTitle, 'Handle copied');
    setText(statusCopy, `${handle} is now in your clipboard, ready to share.`);
  } catch {
    // ignore clipboard issues
  }
};

const applyProfileData = (user) => {
  const avatar = document.querySelector('#profile-avatar');
  const nameEl = document.querySelector('#profile-name');
  const handleEl = document.querySelector('#profile-handle');
  const postsEl = document.querySelector('#profile-posts');
  const followersEl = document.querySelector('#profile-followers');
  const followingEl = document.querySelector('#profile-following');
  const memberSinceEl = document.querySelector('#profile-member-since');
  const favoriteTeamEl = document.querySelector('#profile-favorite-team');
  const alertSummaryEl = document.querySelector('#profile-alert-summary');
  const favoriteLeaguesEl = document.querySelector('#profile-favorite-leagues');
  const followedTeamsEl = document.querySelector('#profile-followed-teams-count');
  const followedPlayersEl = document.querySelector('#profile-followed-players-count');
  const emailEl = document.querySelector('#profile-account-email');
  const accountNameEl = document.querySelector('#profile-account-name');
  const dobEl = document.querySelector('#profile-account-dob');
  const genderEl = document.querySelector('#profile-account-gender');
  const identityLineEl = document.querySelector('#profile-identity-line');
  const statusTitleEl = document.querySelector('#profile-status-title');
  const statusCopyEl = document.querySelector('#profile-status-copy');
  const shareBtn = document.querySelector('#profile-share-btn');
  const preferences = getPreferences();
  const followedTeams = getFollowedTeams();
  const followedPlayers = getFollowedPlayers();
  const isPrivateProfile = preferences?.privacy?.profileVisibility === 'private';
  const showFollowCounts = preferences?.privacy?.showFollowCounts !== false;
  const showOnlineStatus = preferences?.privacy?.showOnlineStatus !== false;
  const showEmailOnProfile = preferences?.privacy?.showEmailOnProfile !== false;

  const username = user?.username ? String(user.username) : 'Guest';
  setText(nameEl, username.toUpperCase());
  setText(handleEl, `@${username.toLowerCase()}`);
  setText(memberSinceEl, formatJoinedLabel(user));
  setText(
    favoriteTeamEl,
    `Favorite team: ${preferences.favoriteTeam ? preferences.favoriteTeam : 'Not set'}`
  );
  setText(alertSummaryEl, formatAlertSummary(preferences));
  setText(favoriteLeaguesEl, formatFavoriteLeagues(preferences));
  setText(followedTeamsEl, showFollowCounts ? String(followedTeams.length) : 'Hidden');
  setText(followedPlayersEl, showFollowCounts ? String(followedPlayers.length) : 'Hidden');
  setText(emailEl, showEmailOnProfile ? (user?.email ? String(user.email) : 'Guest session') : 'Hidden');
  setText(
    accountNameEl,
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || (user?.username ? String(user.username) : 'Guest')
  );
  setText(dobEl, formatDateValue(user?.dob));
  setText(genderEl, user?.gender ? String(user.gender) : 'Not set');
  setText(identityLineEl, buildIdentityLine(user, preferences));
  setText(
    statusTitleEl,
    user ? 'Profile synced and ready' : 'Guest mode is active'
  );
  setText(
    statusCopyEl,
    user
      ? `${followedTeams.length} followed teams and ${followedPlayers.length} followed players are shaping your alerts right now.`
      : 'Log in when you want this profile, your follows, and your cardgame state to stick to the account.'
  );

  if (shareBtn instanceof HTMLButtonElement) {
    shareBtn.disabled = isPrivateProfile;
    shareBtn.textContent = isPrivateProfile ? 'Private Profile' : 'Share Handle';
  }

  if (user?.posts) {
    setText(postsEl, user.posts);
  }
  if (user?.followers) {
    setText(followersEl, showFollowCounts ? user.followers : 'Hidden');
  }
  if (user?.following) {
    setText(followingEl, showFollowCounts ? user.following : 'Hidden');
  }

  if (!user) {
    setText(postsEl, '0');
    setText(followersEl, showFollowCounts ? '0' : 'Hidden');
    setText(followingEl, showFollowCounts ? '0' : 'Hidden');
  }

  if (user && isPrivateProfile) {
    setText(statusTitleEl, 'Private profile enabled');
    setText(
      statusCopyEl,
      'Handle sharing is locked right now and profile-facing counts stay limited to your own view.'
    );
  } else if (user && !showOnlineStatus) {
    setText(statusTitleEl, 'Online status hidden');
    setText(
      statusCopyEl,
      `${followedTeams.length} followed teams and ${followedPlayers.length} followed players are still shaping your alerts, but your online presence stays hidden.`
    );
  } else if (user && showOnlineStatus) {
    setText(statusTitleEl, 'Profile synced and online');
    setText(
      statusCopyEl,
      `${followedTeams.length} followed teams and ${followedPlayers.length} followed players are shaping your alerts right now.`
    );
  }

  if (!avatar) return;
  const storedImage = user ? storage.get(getImageKey(user)) : null;
  avatar.src = storedImage || DEFAULT_AVATAR;
  setTopbarAvatar(storedImage);
  loadProfileFrame(user);
};

const setupAvatarUpload = () => {
  const avatar = document.querySelector('#profile-avatar');
  const input = document.querySelector('#profile-avatar-input');
  const trigger = document.querySelector('#profile-avatar-btn');

  if (!input) return;

  if (trigger) {
    trigger.addEventListener('click', () => {
      input.click();
    });
  }

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const user = loadUser();
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      storage.set(getImageKey(user), dataUrl);
      if (avatar) {
        avatar.src = dataUrl;
      }
      setTopbarAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  });
};

const setupFramePicker = () => {
  const picker = document.querySelector('#profile-frame-picker');
  if (!picker) return;

  picker.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const option = target.closest('[data-profile-frame]');
    if (!(option instanceof HTMLElement)) return;
    const frame = option.dataset.profileFrame || DEFAULT_FRAME;
    applyProfileFrame(frame);
    saveProfileFrame(frame);
  });
};

export const initProfile = () => {
  const backBtn = document.querySelector('#profile-back');
  const editBtn = document.querySelector('#profile-edit-btn');
  const shareBtn = document.querySelector('#profile-share-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      closeProfile();
    });
  }

  editBtn?.addEventListener('click', () => {
    showSettings();
  });

  shareBtn?.addEventListener('click', () => {
    void copyProfileHandle();
  });

  setupAvatarUpload();
  setupFramePicker();

  const currentUser = loadUser();
  applyProfileData(currentUser);

  onEvent('fodr:user', (event) => {
    applyProfileData(event?.detail?.user || null);
  });

  onEvent('fodr:logout', () => {
    applyProfileData(null);
  });

  onEvent('fodr:preferences', () => {
    applyProfileData(loadUser());
  });

  onEvent('fodr:follows', () => {
    applyProfileData(loadUser());
  });
};
