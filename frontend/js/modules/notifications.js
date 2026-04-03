import { onEvent } from '../core/events.js';
import { storage } from '../core/storage.js';
import { showNews, showSettings } from '../core/views.js';
import { loadUser, openAuthModal } from './auth.js';
import { getPreferences } from './preferences.js';

const GUEST_KEY = 'fodrNotifications:guest';
const USER_PREFIX = 'fodrNotifications:user:';
const MAX_ITEMS = 30;

const bellButton = document.querySelector('#notifications-open');
const bellCount = document.querySelector('#notifications-count');
const menu = document.querySelector('#notifications-menu');
const meta = document.querySelector('#notifications-meta');
const list = document.querySelector('#notifications-list');
const readAllButton = document.querySelector('#notifications-read-all');
const clearButton = document.querySelector('#notifications-clear');

const state = {
  open: false,
  items: [],
  bootstrappedKey: null
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const readJson = (key) => {
  try {
    const raw = storage.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJson = (key, value) => {
  storage.set(key, JSON.stringify(value));
};

const getScopeKey = (user = loadUser()) => {
  if (user?.id) return `${USER_PREFIX}${user.id}`;
  if (user?.email) return `${USER_PREFIX}${String(user.email).toLowerCase()}`;
  if (user?.username) return `${USER_PREFIX}${String(user.username).toLowerCase()}`;
  return GUEST_KEY;
};

const formatRelativeTime = (value) => {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'Just now';
  const delta = Date.now() - timestamp;
  const minutes = Math.max(1, Math.round(delta / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString();
};

const saveState = () => {
  writeJson(getScopeKey(), state.items.slice(0, MAX_ITEMS));
};

const buildNotification = ({
  id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title,
  message,
  category = 'System',
  action = null,
  read = false,
  createdAt = new Date().toISOString()
}) => ({
  id,
  title: String(title || 'Update'),
  message: String(message || ''),
  category: String(category || 'System'),
  action: action ? String(action) : null,
  read: Boolean(read),
  createdAt
});

const render = () => {
  if (!list || !meta || !bellCount) return;
  const unreadCount = state.items.filter((item) => !item.read).length;
  meta.textContent = `${unreadCount} unread · ${state.items.length} total`;

  bellCount.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
  bellCount.classList.toggle('is-hidden', unreadCount === 0);

  if (!state.items.length) {
    list.innerHTML = '<div class="notification-empty">You do not have any notifications yet.</div>';
    return;
  }

  list.innerHTML = state.items
    .map(
      (item) => `
        <button
          class="notification-item${item.read ? '' : ' is-unread'}"
          type="button"
          data-notification-id="${item.id}"
          data-notification-action="${item.action || ''}"
        >
          <div class="notification-item__head">
            <div class="notification-item__title">${escapeHtml(item.title)}</div>
            <div class="notification-item__time">${formatRelativeTime(item.createdAt)}</div>
          </div>
          <p class="notification-item__message">${escapeHtml(item.message)}</p>
          <div class="notification-item__footer">
            <span class="notification-item__pill">${escapeHtml(item.category)}</span>
            ${item.action ? '<span class="notification-item__hint">Open</span>' : ''}
          </div>
        </button>
      `
    )
    .join('');
};

const openMenu = () => {
  if (!menu || !bellButton) return;
  state.open = true;
  menu.classList.remove('is-hidden');
  menu.setAttribute('aria-hidden', 'false');
  bellButton.setAttribute('aria-expanded', 'true');
};

const closeMenu = () => {
  if (!menu || !bellButton) return;
  state.open = false;
  menu.classList.add('is-hidden');
  menu.setAttribute('aria-hidden', 'true');
  bellButton.setAttribute('aria-expanded', 'false');
};

const toggleMenu = () => {
  if (state.open) {
    closeMenu();
  } else {
    openMenu();
  }
};

const markRead = (id) => {
  let changed = false;
  state.items = state.items.map((item) => {
    if (item.id !== id || item.read) return item;
    changed = true;
    return { ...item, read: true };
  });
  if (changed) {
    saveState();
    render();
  }
};

const runNotificationAction = (action) => {
  switch (action) {
    case 'login':
      openAuthModal('login');
      break;
    case 'settings':
      showSettings();
      break;
    case 'news':
      showNews();
      break;
    default:
      break;
  }
};

export const pushMainNotification = (payload) => {
  const notification = buildNotification(payload);
  const existingIndex = notification.id
    ? state.items.findIndex((item) => item.id === notification.id)
    : -1;

  if (existingIndex >= 0) {
    state.items[existingIndex] = {
      ...state.items[existingIndex],
      ...notification
    };
    saveState();
    render();
    return state.items[existingIndex];
  }

  state.items = [notification, ...state.items].slice(0, MAX_ITEMS);
  saveState();
  render();
  return notification;
};

const bootstrapScope = () => {
  const user = loadUser();
  const key = getScopeKey(user);
  const storedItems = readJson(key);
  state.items = Array.isArray(storedItems) ? storedItems : [];

  if (!state.items.length) {
    const preferences = getPreferences();
    const starter = [];

    if (!user) {
      starter.push(
        buildNotification({
          title: 'Browse As Guest',
          message: 'Log in if you want your cards, preferences, and future messages saved to your account.',
          category: 'Account',
          action: 'login'
        })
      );
    } else {
      starter.push(
        buildNotification({
          title: `Welcome, ${String(user.username || 'Manager')}`,
          message: 'Your account is ready. Open Settings any time to tune alerts and preferences.',
          category: 'Account',
          action: 'settings'
        })
      );
    }

    if (preferences.favoriteTeam && preferences.notifications.matches !== false) {
      starter.push(
        buildNotification({
          title: 'Match Alerts Ready',
          message: `We will keep this profile centered around ${preferences.favoriteTeam}.`,
          category: 'Matches',
          action: 'settings',
          read: true
        })
      );
    }

    if (!preferences.onboardingComplete) {
      starter.push(
        buildNotification({
          title: 'Finish Your Setup',
          message: 'Pick your favorite team and competitions once so the web feels more personal.',
          category: 'Setup',
          action: 'settings'
        })
      );
    }

    state.items = starter.concat(state.items).slice(0, MAX_ITEMS);
    saveState();
  }

  state.bootstrappedKey = key;
  render();
};

const handleNotificationClick = (target) => {
  const item = target.closest('[data-notification-id]');
  if (!(item instanceof HTMLElement)) return;
  const id = item.dataset.notificationId;
  const action = item.dataset.notificationAction || '';
  if (id) {
    markRead(id);
  }
  closeMenu();
  if (action) {
    runNotificationAction(action);
  }
};

export const initNotifications = () => {
  if (!bellButton || !menu || !list) return;

  bootstrapScope();

  bellButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMenu();
  });

  list.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    handleNotificationClick(target);
  });

  readAllButton?.addEventListener('click', () => {
    state.items = state.items.map((item) => ({ ...item, read: true }));
    saveState();
    render();
  });

  clearButton?.addEventListener('click', () => {
    state.items = [];
    saveState();
    render();
  });

  document.addEventListener('click', (event) => {
    if (!state.open) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest('#notifications-open') && !target.closest('#notifications-menu')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  onEvent('fodr:user', (event) => {
    bootstrapScope();
    const user = event?.detail?.user;
    if (user?.username) {
      pushMainNotification({
        title: 'Signed In',
        message: `${user.username} is now logged in on this device.`,
        category: 'Account'
      });
    }
  });

  onEvent('fodr:logout', () => {
    bootstrapScope();
  });

  onEvent('fodr:news-updated', (event) => {
    const preferences = getPreferences();
    if (preferences.notifications.social === false) return;
    const title = event?.detail?.article?.title || 'A news story was updated.';
    pushMainNotification({
      title: 'News Updated',
      message: title,
      category: 'News',
      action: 'news'
    });
  });

  window.addEventListener('storage', (event) => {
    if (event.key && event.key === getScopeKey()) {
      bootstrapScope();
    }
  });
};
