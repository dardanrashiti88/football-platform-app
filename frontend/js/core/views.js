import { storage } from './storage.js';
import { setStatsAccent } from '../modules/stats.js';
import { setQuizAccent } from '../modules/quiz.js';

const VIEW_KEY = 'fodrView';

const viewEls = {
  home: document.querySelector('.league-view'),
  leagues: document.querySelector('#leagues-view'),
  players: document.querySelector('#players-view'),
  stats: document.querySelector('#stats-view'),
  quiz: document.querySelector('#quiz-view'),
  news: document.querySelector('#news-view'),
  cardgame: document.querySelector('#cardgame-view'),
  match: document.querySelector('.match-view'),
  settings: document.querySelector('#settings-view'),
  profile: document.querySelector('#profile-view')
};

const navActions = document.querySelectorAll('.nav-action');
const navEls = {
  home: document.querySelector('.nav-home'),
  leagues: document.querySelector('#nav-leagues'),
  players: document.querySelector('#nav-players'),
  stats: document.querySelector('#nav-stats'),
  quiz: document.querySelector('#nav-quiz'),
  news: document.querySelector('#nav-news'),
  cardgame: document.querySelector('#nav-cardgame')
};

const beforeViewChange = new Set();
let lastNonProfileView = 'home';

const getCurrentViewKey = () => {
  for (const [key, el] of Object.entries(viewEls)) {
    if (!el || key === 'profile') continue;
    if (!el.classList.contains('is-hidden')) return key;
  }
  const stored = getStoredView();
  return stored && stored !== 'profile' ? stored : 'home';
};

const runBeforeChange = () => {
  beforeViewChange.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore cleanup errors
    }
  });
};

const hideAll = () => {
  Object.values(viewEls).forEach((el) => {
    if (el) el.classList.add('is-hidden');
  });

  document.querySelector('.app')?.classList.remove('profile-mode');

  const quizOverlay = document.querySelector('#quiz-overlay');
  if (quizOverlay && !quizOverlay.classList.contains('is-hidden')) {
    quizOverlay.classList.add('is-hidden');
    quizOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('quiz-overlay-open');
  }

  const cupOverlay = document.querySelector('#cup-overlay');
  if (cupOverlay && !cupOverlay.classList.contains('is-hidden')) {
    cupOverlay.classList.add('is-hidden');
    cupOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cup-overlay-open');
  }
};

export const registerBeforeViewChange = (fn) => {
  if (typeof fn === 'function') {
    beforeViewChange.add(fn);
  }
  return () => beforeViewChange.delete(fn);
};

export const setStoredView = (view) => {
  if (!view) return;
  storage.set(VIEW_KEY, view);
};

export const getStoredView = () => storage.get(VIEW_KEY);

export const setActiveNav = (key) => {
  navActions.forEach((item) => item.classList.remove('is-active'));
  if (key && navEls[key]) {
    navEls[key].classList.add('is-active');
  }
};

export const isViewVisible = (key) => {
  const el = viewEls[key];
  if (!el) return false;
  return !el.classList.contains('is-hidden');
};

export const showHome = () => {
  if (!viewEls.home) return;
  runBeforeChange();
  hideAll();
  viewEls.home?.classList.remove('is-hidden');
  setStoredView('home');
  setActiveNav('home');
};

export const showLeagues = () => {
  if (!viewEls.leagues) return;
  runBeforeChange();
  hideAll();
  viewEls.leagues?.classList.remove('is-hidden');
  setStoredView('leagues');
  setActiveNav('leagues');
};

export const showPlayers = () => {
  if (!viewEls.players) return;
  runBeforeChange();
  hideAll();
  viewEls.players?.classList.remove('is-hidden');
  setStoredView('players');
  setActiveNav('players');
};

export const showStats = () => {
  if (!viewEls.stats) return;
  runBeforeChange();
  hideAll();
  viewEls.stats?.classList.remove('is-hidden');
  const activeLeague = document.querySelector('.sidebar-item.active')?.dataset.league;
  if (activeLeague) {
    setStatsAccent(activeLeague);
  }
  setStoredView('stats');
  setActiveNav('stats');
};

export const showQuiz = () => {
  if (!viewEls.quiz) return;
  runBeforeChange();
  hideAll();
  viewEls.quiz?.classList.remove('is-hidden');
  const activeLeague = document.querySelector('.sidebar-item.active')?.dataset.league;
  const quizLeagueSelect = document.querySelector('#quiz-league');
  if (quizLeagueSelect && !quizLeagueSelect.value && activeLeague) {
    quizLeagueSelect.value = activeLeague;
  }
  if (quizLeagueSelect?.value) {
    setQuizAccent(quizLeagueSelect.value);
  }
  setStoredView('quiz');
  setActiveNav('quiz');
};

export const showNews = () => {
  if (!viewEls.news) return;
  runBeforeChange();
  hideAll();
  viewEls.news?.classList.remove('is-hidden');
  setStoredView('news');
  setActiveNav('news');
};

export const showCardgame = () => {
  if (!viewEls.cardgame) return;
  runBeforeChange();
  hideAll();
  viewEls.cardgame?.classList.remove('is-hidden');
  setStoredView('cardgame');
  setActiveNav('cardgame');
};

export const showMatch = () => {
  if (!viewEls.match) return;
  runBeforeChange();
  hideAll();
  viewEls.match?.classList.remove('is-hidden');
};

export const showSettings = () => {
  if (!viewEls.settings) return;
  runBeforeChange();
  hideAll();
  viewEls.settings?.classList.remove('is-hidden');
};

export const showProfile = () => {
  if (!viewEls.profile) return;
  runBeforeChange();
  lastNonProfileView = getCurrentViewKey();
  hideAll();
  viewEls.profile?.classList.remove('is-hidden');
  document.querySelector('.app')?.classList.add('profile-mode');
  setActiveNav(null);
};

export const closeProfile = () => {
  const target = lastNonProfileView || 'home';
  switch (target) {
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
    case 'match':
      showMatch();
      break;
    case 'settings':
      showSettings();
      break;
    default:
      showHome();
  }
};

export const initViews = () => {
  if (navEls.home) {
    navEls.home.addEventListener('click', showHome);
  }
  if (navEls.leagues) {
    navEls.leagues.addEventListener('click', showLeagues);
  }
  if (navEls.players) {
    navEls.players.addEventListener('click', showPlayers);
  }
  if (navEls.stats) {
    navEls.stats.addEventListener('click', showStats);
  }
  if (navEls.quiz) {
    navEls.quiz.addEventListener('click', showQuiz);
  }
  if (navEls.news) {
    navEls.news.addEventListener('click', showNews);
  }
  if (navEls.cardgame) {
    navEls.cardgame.addEventListener('click', showCardgame);
  }
};
