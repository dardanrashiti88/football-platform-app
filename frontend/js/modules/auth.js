import { storage } from '../core/storage.js';
import { postJson } from '../core/api.js';
import { emitEvent } from '../core/events.js';
import { showProfile } from '../core/views.js';

const USER_KEY = 'fodrUser';

const authOpen = document.querySelector('#auth-open');
const profileMenu = document.querySelector('#profile-menu');
const profileItems = document.querySelectorAll('[data-profile-action]');
const authModal = document.querySelector('#auth-modal');
const authClose = document.querySelector('#auth-close');
const authTabs = document.querySelectorAll('[data-auth-tab]');
const authPanels = document.querySelectorAll('[data-auth-panel]');
const authSwitches = document.querySelectorAll('[data-auth-switch]');
const authMessage = document.querySelector('#auth-message');
const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');
const authLabel = document.querySelector('#auth-label');
const logoutBtn = document.querySelector('#logout-btn');

const setAuthPanel = (panelId) => {
  authTabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.authTab === panelId);
  });
  authPanels.forEach((panel) => {
    panel.classList.toggle('is-hidden', panel.dataset.authPanel !== panelId);
  });
  if (authMessage) authMessage.textContent = '';
};

export const openAuthModal = (panelId = 'login') => {
  if (!authModal) return;
  setAuthPanel(panelId);
  authModal.classList.remove('is-hidden');
};

const closeProfileMenu = () => {
  if (!profileMenu) return;
  profileMenu.classList.add('is-hidden');
  authOpen?.setAttribute('aria-expanded', 'false');
};

const toggleProfileMenu = () => {
  if (!profileMenu) return;
  const willOpen = profileMenu.classList.contains('is-hidden');
  profileMenu.classList.toggle('is-hidden', !willOpen);
  authOpen?.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
};

const closeAuthModal = () => {
  if (!authModal) return;
  authModal.classList.add('is-hidden');
};

export const showAuthMessage = (text, type = 'error') => {
  if (!authMessage) return;
  authMessage.textContent = text;
  authMessage.classList.toggle('success', type === 'success');
};

const setUserLabel = (user) => {
  if (!authLabel) return;
  if (user && user.username) {
    authLabel.textContent = user.username.toUpperCase();
    authLabel.parentElement?.setAttribute('aria-label', `Logged in as ${user.username}`);
  } else {
    authLabel.textContent = 'LOGIN';
    authLabel.parentElement?.setAttribute('aria-label', 'Open login');
  }
};

export const loadUser = () => {
  try {
    const raw = storage.get(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveUser = (user) => {
  storage.set(USER_KEY, JSON.stringify(user));
  setUserLabel(user);
  emitEvent('fodr:user', { user });
};

const clearUser = () => {
  storage.remove(USER_KEY);
  setUserLabel(null);
  emitEvent('fodr:logout');
};

export const initAuth = () => {
  if (authOpen) {
    authOpen.addEventListener('click', (event) => {
      event.preventDefault();
      const user = loadUser();
      if (!user) {
        openAuthModal('login');
        return;
      }
      toggleProfileMenu();
    });
  }

  if (authClose) {
    authClose.addEventListener('click', closeAuthModal);
  }

  if (authModal) {
    authModal.addEventListener('click', (event) => {
      if (event.target === authModal) {
        closeAuthModal();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!profileMenu || profileMenu.classList.contains('is-hidden')) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const insideMenu = target.closest('#profile-menu');
    const insideTrigger = target.closest('#auth-open');
    if (!insideMenu && !insideTrigger) {
      closeProfileMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAuthModal();
    }
  });

  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setAuthPanel(tab.dataset.authTab);
    });
  });

  authSwitches.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const target = trigger.dataset.authSwitch;
      openAuthModal(target);
    });
  });

  profileItems.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.dataset.profileAction;
      if (action === 'profile') {
        showProfile();
      }
      if (action === 'settings') {
        document.querySelector('#settings-open')?.click();
      }
      closeProfileMenu();
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(loginForm);
      const email = form.get('email');
      const password = form.get('password');
      try {
        const data = await postJson('/auth/login', { email, password });
        saveUser(data.user);
        showAuthMessage('Logged in successfully.', 'success');
        setTimeout(closeAuthModal, 600);
      } catch (err) {
        showAuthMessage(err.message || 'Login failed');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(signupForm);
      const email = form.get('email');
      const confirmEmail = form.get('confirm_email');
      const password = form.get('password');
      const confirmPassword = form.get('confirm_password');
      if (email !== confirmEmail) {
        showAuthMessage('Emails do not match.');
        return;
      }
      if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match.');
        return;
      }
      const payload = {
        username: form.get('username'),
        email,
        password,
        first_name: form.get('first_name'),
        last_name: form.get('last_name'),
        gender: form.get('gender'),
        dob: form.get('dob')
      };
      try {
        const data = await postJson('/auth/register', payload);
        saveUser(data.user);
        showAuthMessage('Account created.', 'success');
        setTimeout(closeAuthModal, 600);
      } catch (err) {
        showAuthMessage(err.message || 'Signup failed');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearUser();
      closeProfileMenu();
    });
  }

  const currentUser = loadUser();
  setUserLabel(currentUser);
};
