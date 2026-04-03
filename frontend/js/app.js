import {
  getStoredView,
  initViews,
  showCardgame,
  showHome,
  showLeagues,
  showNews,
  showPlayers,
  showQuiz,
  showStats
} from './core/views.js';
import { onEvent } from './core/events.js';
import { initHome } from './modules/home.js';
import { initLeagues } from './modules/leagues.js';
import { initPlayers } from './modules/players.js';
import { initStats } from './modules/stats.js';
import { initQuiz } from './modules/quiz.js';
import { initNews } from './modules/news.js';
import { initSettings } from './modules/settings.js';
import { initProfile } from './modules/profile.js';
import { initGlobalSearch } from './modules/global-search.js';
import { initAuth } from './modules/auth.js';
import { initSidebar } from './modules/sidebar.js';
import { initHomeCards } from './modules/home-cards.js';
import { initCardgame, openInventoryStage, restorePackState } from './modules/cardgame.js';
import { initMatch } from './modules/match.js';
import { initPreferences } from './modules/preferences.js';
import { initOnboarding } from './modules/onboarding.js';
import { initNotifications } from './modules/notifications.js';
import { initFollows } from './modules/follows.js';

const pageParams = new URLSearchParams(window.location.search);
const isEmbeddedMatch = pageParams.get('embedMatch') === '1';
const isMobileEmbeddedMatch = pageParams.get('mobileMatch') === '1';
const isEmbeddedPlayers = pageParams.get('embedPlayers') === '1';
const isEmbeddedQuiz = pageParams.get('embedQuiz') === '1';
const isEmbeddedCardgame = pageParams.get('embedCardgame') === '1';
const requestedView = pageParams.get('view');

if (isEmbeddedMatch) {
  document.body.classList.add('match-embed-mode');
  document.documentElement.classList.add('match-embed-mode');
  document.querySelector('.app')?.classList.add('match-embed-mode');
  const field = document.querySelector('.field');
  const homeBench = document.querySelector('.bench-left');
  const awayBench = document.querySelector('.bench-right');
  const scoresheetHome = document.querySelector('#scoresheet-home-list');
  const scoresheetAway = document.querySelector('#scoresheet-away-list');

  if (field) {
    field.innerHTML = '<div class="field-empty-state">Loading lineups...</div>';
  }
  if (homeBench) {
    homeBench.innerHTML = Array.from({ length: 7 }, () => '<div class="bench-slot bench-slot--home bench-slot--empty"></div>').join('');
  }
  if (awayBench) {
    awayBench.innerHTML = Array.from({ length: 7 }, () => '<div class="bench-slot bench-slot--away bench-slot--empty"></div>').join('');
  }
  if (scoresheetHome) {
    scoresheetHome.innerHTML =
      '<div class="scoresheet-item scoresheet-item--empty">Loading scorers...</div>';
  }
  if (scoresheetAway) {
    scoresheetAway.innerHTML =
      '<div class="scoresheet-item scoresheet-item--empty">Loading scorers...</div>';
  }
}

if (isMobileEmbeddedMatch) {
  document.body.classList.add('match-mobile-embed-mode');
  document.documentElement.classList.add('match-mobile-embed-mode');
  document.querySelector('.app')?.classList.add('match-mobile-embed-mode');
}

if (isEmbeddedPlayers) {
  document.body.classList.add('players-embed-mode');
  document.documentElement.classList.add('players-embed-mode');
  document.querySelector('.app')?.classList.add('players-embed-mode');
}

if (isEmbeddedQuiz) {
  document.body.classList.add('quiz-embed-mode');
  document.documentElement.classList.add('quiz-embed-mode');
  document.querySelector('.app')?.classList.add('quiz-embed-mode');
}

if (isEmbeddedCardgame) {
  document.body.classList.add('cardgame-embed-mode');
  document.documentElement.classList.add('cardgame-embed-mode');
  document.querySelector('.app')?.classList.add('cardgame-embed-mode');
}

document.addEventListener('dragstart', (event) => {
  const target = event.target;
  if (target instanceof HTMLImageElement || target instanceof SVGElement) {
    event.preventDefault();
  }
});

initViews();
initPreferences();
initFollows();
initSidebar();
initHomeCards();
initHome();
initLeagues();
initPlayers();
initStats();
initQuiz();
initNews();
initSettings();
initProfile();
initGlobalSearch();
initAuth();
initCardgame();
initMatch();
initOnboarding();
initNotifications();

const savedView = requestedView || getStoredView();
if (savedView) {
  switch (savedView) {
    case 'inventory':
      showCardgame();
      openInventoryStage();
      break;
    case 'leagues':
      showLeagues();
      break;
    case 'players':
      showPlayers();
      break;
    case 'stats':
      showStats();
      break;
    case 'quiz':
      showQuiz();
      break;
    case 'news':
      showNews();
      break;
    case 'cardgame':
      showCardgame();
      break;
    default:
      showHome();
  }
} else {
  showHome();
}

void restorePackState();

const dashboardOpenBtn = document.querySelector('#dashboard-open');
const dashboardOverlay = document.querySelector('#dashboard-overlay');
const dashboardCloseBtn = document.querySelector('#dashboard-close');
const dashboardIframe = document.querySelector('#dashboard-iframe');
const brandHomeBtn = document.querySelector('#brand-home');

if (brandHomeBtn) {
  brandHomeBtn.addEventListener('click', showHome);
}

const sendDashboardNavigate = (view) => {
  try {
    dashboardIframe?.contentWindow?.postMessage({ type: 'FODR_DASHBOARD_NAVIGATE', view }, '*');
  } catch {
    // ignore
  }
};

const readFodrUser = () => {
  try {
    const raw = localStorage.getItem('fodrUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const sendDashboardUser = (userOverride) => {
  try {
    const user = typeof userOverride === 'undefined' ? readFodrUser() : userOverride;
    dashboardIframe?.contentWindow?.postMessage({ type: 'FODR_DASHBOARD_USER', user }, '*');
  } catch {
    // ignore
  }
};

const sendDashboardInventoryChanged = () => {
  try {
    dashboardIframe?.contentWindow?.postMessage({ type: 'FODR_DASHBOARD_INVENTORY_CHANGED' }, '*');
  } catch {
    // ignore
  }
};

if (typeof BroadcastChannel !== 'undefined') {
  const inventoryChannel = new BroadcastChannel('fodr-inventory');
  inventoryChannel.addEventListener('message', sendDashboardInventoryChanged);
}

const openDashboard = () => {
  if (!dashboardOverlay) return;
  dashboardOverlay.classList.remove('is-hidden');
  dashboardOverlay.setAttribute('aria-hidden', 'false');
  sendDashboardUser();
  sendDashboardNavigate('Realtime Overview');
};

const closeDashboard = () => {
  if (!dashboardOverlay) return;
  dashboardOverlay.classList.add('is-hidden');
  dashboardOverlay.setAttribute('aria-hidden', 'true');
};

if (dashboardOpenBtn && dashboardOverlay) {
  dashboardOpenBtn.addEventListener('click', openDashboard);
  dashboardCloseBtn?.addEventListener('click', closeDashboard);
  dashboardIframe?.addEventListener('load', () => {
    sendDashboardUser();
    sendDashboardNavigate('Realtime Overview');
  });
  dashboardOverlay.addEventListener('click', (event) => {
    if (event.target === dashboardOverlay) {
      closeDashboard();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dashboardOverlay.classList.contains('is-hidden')) {
      closeDashboard();
    }
  });
  window.addEventListener('message', (event) => {
    const type = event?.data?.type;
    if (type === 'FODR_DASHBOARD_CLOSE') closeDashboard();
    if (type === 'FODR_OPEN_LOGIN') document.querySelector('#auth-open')?.click();
  });
}

onEvent('fodr:user', (event) => {
  sendDashboardUser(event?.detail?.user || null);
});
onEvent('fodr:logout', () => {
  sendDashboardUser(null);
});
