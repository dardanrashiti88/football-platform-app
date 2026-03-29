import { storage } from '../../../frontend/js/core/storage.js';
import { postJson } from '../../../frontend/js/core/api.js';
import { emitEvent } from '../../../frontend/js/core/events.js';

const USER_KEY = 'fodrUser';
const PROFILE_IMAGE_KEY = 'fodrProfileImage';

let callbacks = {
  onProfileRequested: null,
  onSettingsRequested: null,
  refreshProfile: null
};
let isBound = false;

const getProfileImageKey = (user) => {
  const username = user?.username || 'guest';
  return `${PROFILE_IMAGE_KEY}:${username}`;
};

export const loadMobileUser = () => {
  try {
    const raw = storage.get(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getMobileProfileImage = (user = loadMobileUser()) => {
  if (!user) return null;
  return storage.get(getProfileImageKey(user));
};

const getUserInitials = (user) => {
  const username = String(user?.username || 'FD').trim();
  return username.slice(0, 2).toUpperCase();
};

const syncTopbarUserPill = () => {
  const user = loadMobileUser();
  const label = document.querySelector('.mobile-user-pill__label');
  const pill = document.querySelector('.mobile-user-pill');
  const avatar = document.querySelector('.mobile-avatar-dot');

  if (label) {
    label.textContent = user?.username ? String(user.username).toUpperCase() : 'LOGIN';
  }

  if (pill) {
    pill.setAttribute('aria-label', user?.username ? `Logged in as ${user.username}` : 'Open login');
  }

  if (!avatar) return;
  const profileImage = getMobileProfileImage(user);
  if (profileImage) {
    avatar.style.backgroundImage = `url('${profileImage}')`;
    avatar.textContent = '';
    avatar.classList.add('has-avatar');
  } else {
    avatar.style.backgroundImage = '';
    avatar.textContent = user ? getUserInitials(user) : '';
    avatar.classList.toggle('has-avatar', false);
  }
};

const ensureAuthChrome = () => {
  if (document.querySelector('#mobile-auth-modal')) return;

  document.body.insertAdjacentHTML(
    'beforeend',
    `
      <div class="mobile-auth-menu is-hidden" id="mobile-auth-menu" role="menu" aria-label="Profile menu">
        <button class="mobile-auth-menu__item" type="button" data-mobile-menu-action="profile">
          <span>Profile</span>
        </button>
        <button class="mobile-auth-menu__item" type="button" data-mobile-menu-action="settings">
          <span>Account Settings</span>
        </button>
        <button class="mobile-auth-menu__item mobile-auth-menu__item--danger" type="button" data-mobile-menu-action="logout">
          <span>Log out</span>
        </button>
      </div>

      <div class="mobile-auth-modal is-hidden" id="mobile-auth-modal" aria-hidden="true">
        <div class="mobile-auth-window" role="dialog" aria-modal="true" aria-label="Authentication">
          <button class="mobile-auth-close" type="button" id="mobile-auth-close" aria-label="Close">×</button>

          <div class="mobile-auth-tabs">
            <button class="mobile-auth-tab is-active" type="button" data-mobile-auth-tab="login">Login</button>
            <button class="mobile-auth-tab" type="button" data-mobile-auth-tab="signup">Sign Up</button>
          </div>

          <div class="mobile-auth-message" id="mobile-auth-message"></div>

          <div class="mobile-auth-panel" data-mobile-auth-panel="login">
            <form class="mobile-auth-form" id="mobile-login-form">
              <input class="mobile-auth-input" type="email" name="email" placeholder="Email" required />
              <input class="mobile-auth-input" type="password" name="password" placeholder="Password" required />
              <button class="mobile-auth-submit" type="submit">Log In</button>
            </form>
            <button class="mobile-auth-switch" type="button" data-mobile-auth-switch="signup">
              Don’t have an account? Sign up
            </button>
          </div>

          <div class="mobile-auth-panel is-hidden" data-mobile-auth-panel="signup">
            <form class="mobile-auth-form" id="mobile-signup-form">
              <input class="mobile-auth-input" type="text" name="username" placeholder="Username" required />
              <input class="mobile-auth-input" type="text" name="first_name" placeholder="First Name" />
              <input class="mobile-auth-input" type="text" name="last_name" placeholder="Last Name" />
              <input class="mobile-auth-input" type="email" name="email" placeholder="Email" required />
              <input class="mobile-auth-input" type="email" name="confirm_email" placeholder="Confirm Email" required />
              <input class="mobile-auth-input" type="password" name="password" placeholder="Password" required />
              <input class="mobile-auth-input" type="password" name="confirm_password" placeholder="Confirm Password" required />
              <select class="mobile-auth-input mobile-auth-select" name="gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input class="mobile-auth-input" type="date" name="dob" />
              <button class="mobile-auth-submit" type="submit">Create Account</button>
            </form>
            <button class="mobile-auth-switch" type="button" data-mobile-auth-switch="login">
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    `
  );
};

const getAuthModal = () => document.querySelector('#mobile-auth-modal');
const getAuthMenu = () => document.querySelector('#mobile-auth-menu');
const getAuthMessage = () => document.querySelector('#mobile-auth-message');

const setAuthPanel = (panelId = 'login') => {
  document.querySelectorAll('[data-mobile-auth-tab]').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.mobileAuthTab === panelId);
  });
  document.querySelectorAll('[data-mobile-auth-panel]').forEach((panel) => {
    panel.classList.toggle('is-hidden', panel.dataset.mobileAuthPanel !== panelId);
  });
  const message = getAuthMessage();
  if (message) {
    message.textContent = '';
    message.classList.remove('success');
  }
};

export const openMobileAuthModal = (panelId = 'login') => {
  ensureAuthChrome();
  setAuthPanel(panelId);
  getAuthModal()?.classList.remove('is-hidden');
};

const closeMobileAuthModal = () => {
  getAuthModal()?.classList.add('is-hidden');
};

const openProfileMenu = () => {
  ensureAuthChrome();
  getAuthMenu()?.classList.remove('is-hidden');
};

const closeProfileMenu = () => {
  getAuthMenu()?.classList.add('is-hidden');
};

const toggleProfileMenu = () => {
  const menu = getAuthMenu();
  if (!menu) return;
  menu.classList.toggle('is-hidden');
};

const showAuthMessage = (text, type = 'error') => {
  const message = getAuthMessage();
  if (!message) return;
  message.textContent = text;
  message.classList.toggle('success', type === 'success');
};

const refreshProfileView = () => {
  callbacks.refreshProfile?.(loadMobileUser());
};

const saveUser = (user) => {
  storage.set(USER_KEY, JSON.stringify(user));
  syncTopbarUserPill();
  refreshProfileView();
  emitEvent('fodr:user', { user });
};

const clearUser = () => {
  storage.remove(USER_KEY);
  syncTopbarUserPill();
  refreshProfileView();
  closeProfileMenu();
  emitEvent('fodr:logout');
};

const handleAvatarFile = (file) => {
  if (!file) return;
  const user = loadMobileUser();
  if (!user) return;
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = typeof reader.result === 'string' ? reader.result : '';
    if (!dataUrl) return;
    storage.set(getProfileImageKey(user), dataUrl);
    syncTopbarUserPill();
    refreshProfileView();
  };
  reader.readAsDataURL(file);
};

const submitLogin = async (form) => {
  const data = new FormData(form);
  try {
    const response = await postJson('/auth/login', {
      email: data.get('email'),
      password: data.get('password')
    });
    saveUser(response.user);
    showAuthMessage('Logged in successfully.', 'success');
    setTimeout(closeMobileAuthModal, 500);
  } catch (error) {
    showAuthMessage(error.message || 'Login failed.');
  }
};

const submitSignup = async (form) => {
  const data = new FormData(form);
  const email = data.get('email');
  const confirmEmail = data.get('confirm_email');
  const password = data.get('password');
  const confirmPassword = data.get('confirm_password');

  if (email !== confirmEmail) {
    showAuthMessage('Emails do not match.');
    return;
  }

  if (password !== confirmPassword) {
    showAuthMessage('Passwords do not match.');
    return;
  }

  try {
    const response = await postJson('/auth/register', {
      username: data.get('username'),
      email,
      password,
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
      gender: data.get('gender'),
      dob: data.get('dob')
    });
    saveUser(response.user);
    showAuthMessage('Account created.', 'success');
    setTimeout(closeMobileAuthModal, 500);
  } catch (error) {
    showAuthMessage(error.message || 'Signup failed.');
  }
};

const bindEvents = () => {
  if (isBound) return;
  isBound = true;

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('#mobile-auth-open')) {
      const user = loadMobileUser();
      if (!user) {
        openMobileAuthModal('login');
      } else {
        toggleProfileMenu();
      }
      return;
    }

    if (target.closest('#mobile-settings-open')) {
      callbacks.onSettingsRequested?.(loadMobileUser());
      return;
    }

    if (target.closest('#mobile-auth-close')) {
      closeMobileAuthModal();
      return;
    }

    if (target.matches('#mobile-auth-modal')) {
      closeMobileAuthModal();
      return;
    }

    const authTab = target.closest('[data-mobile-auth-tab]');
    if (authTab) {
      setAuthPanel(authTab.dataset.mobileAuthTab);
      return;
    }

    const authSwitch = target.closest('[data-mobile-auth-switch]');
    if (authSwitch) {
      openMobileAuthModal(authSwitch.dataset.mobileAuthSwitch);
      return;
    }

    const authTrigger = target.closest('[data-mobile-auth-trigger]');
    if (authTrigger) {
      openMobileAuthModal(authTrigger.dataset.mobileAuthTrigger || 'login');
      return;
    }

    if (target.closest('[data-mobile-profile-avatar-trigger]')) {
      document.querySelector('.mobile-view.is-active [data-mobile-profile-avatar-input]')?.click();
      return;
    }

    if (target.closest('[data-mobile-logout]')) {
      clearUser();
      return;
    }

    const menuAction = target.closest('[data-mobile-menu-action]');
    if (menuAction) {
      const action = menuAction.dataset.mobileMenuAction;
      closeProfileMenu();
      if (action === 'profile') callbacks.onProfileRequested?.(loadMobileUser());
      if (action === 'settings') callbacks.onSettingsRequested?.(loadMobileUser());
      if (action === 'logout') clearUser();
      return;
    }

    const insideMenu = target.closest('#mobile-auth-menu');
    const insideAuthTrigger = target.closest('#mobile-auth-open');
    if (!insideMenu && !insideAuthTrigger) {
      closeProfileMenu();
    }
  });

  document.addEventListener('submit', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement)) return;

    if (target.id === 'mobile-login-form') {
      event.preventDefault();
      submitLogin(target);
    }

    if (target.id === 'mobile-signup-form') {
      event.preventDefault();
      submitSignup(target);
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.matches('[data-mobile-profile-avatar-input]')) {
      handleAvatarFile(target.files?.[0]);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileAuthModal();
      closeProfileMenu();
    }
  });

  window.addEventListener('storage', () => {
    syncTopbarUserPill();
    refreshProfileView();
  });
};

export const initMobileAuth = (nextCallbacks = {}) => {
  callbacks = { ...callbacks, ...nextCallbacks };
  ensureAuthChrome();
  bindEvents();
  syncTopbarUserPill();
  refreshProfileView();
  closeProfileMenu();
};
