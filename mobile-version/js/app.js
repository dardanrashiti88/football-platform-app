import { competitions } from './data/competitions.js';
import { renderTopbar } from './modules/renderTopbar.js';
import { renderCompetitionStrip } from './modules/renderCompetitionStrip.js';
import { renderCompetitionSections } from './modules/renderCompetitionSections.js';
import { renderBottomNav } from './modules/renderBottomNav.js';
import { initMobileAuth } from './modules/mobileAuth.js';
import { initMobileSearch } from './modules/mobileSearch.js';
import {
  renderCardgameView,
  renderLeaguesView,
  renderNewsView,
  renderPlayersView,
  renderProfileView,
  renderQuizView,
  renderSettingsView,
  renderStatsView
} from './modules/renderMobileViews.js';

const topbarRoot = document.getElementById('mobile-topbar');
const stripRoot = document.getElementById('competition-strip');
const sectionsRoot = document.getElementById('competition-sections');
const bottomNavRoot = document.getElementById('mobile-bottom-nav');
const mobileViewRoots = {
  home: document.getElementById('mobile-view-home'),
  leagues: document.getElementById('mobile-view-leagues'),
  players: document.getElementById('mobile-view-players'),
  stats: document.getElementById('mobile-view-stats'),
  quiz: document.getElementById('mobile-view-quiz'),
  news: document.getElementById('mobile-view-news'),
  cards: document.getElementById('mobile-view-cards'),
  profile: document.getElementById('mobile-view-profile'),
  settings: document.getElementById('mobile-view-settings')
};
const pageParams = new URLSearchParams(window.location.search);
const requestedMobileView = pageParams.get('view');
const requestedLeagueId = pageParams.get('league');

const FIXTURES_URL = new URL('../data/fixtures.json?v=mobile45', import.meta.url);
const isIOSDevice = () => {
  const userAgent = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const loadCompetitionFixtures = async () => {
  const response = await fetch(FIXTURES_URL);
  if (!response.ok) {
    throw new Error(`Mobile fixtures request failed (${response.status})`);
  }
  return response.json();
};

const bindFixtureNavigation = () => {
  const openFixture = (fixtureCard) => {
    const matchId = fixtureCard?.dataset?.matchId;
    if (!matchId) return;
    const params = new URLSearchParams();
    params.set('matchId', matchId);
    if (fixtureCard?.dataset?.competitionId) params.set('competitionId', fixtureCard.dataset.competitionId);
    if (fixtureCard?.dataset?.homeName) params.set('homeName', fixtureCard.dataset.homeName);
    if (fixtureCard?.dataset?.awayName) params.set('awayName', fixtureCard.dataset.awayName);
    params.set('v', 'mobile45');
    const targetUrl = isIOSDevice()
      ? `/frontend/index.html?${new URLSearchParams({
          ...Object.fromEntries(params.entries()),
          embedMatch: '1',
          mobileMatch: '1'
        }).toString()}`
      : `/mobile-version/match.html?${params.toString()}`;
    window.location.href = targetUrl;
  };

  sectionsRoot?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const fixtureCard = target.closest('.fixture-card[data-match-id]');
    if (!fixtureCard) return;
    openFixture(fixtureCard);
  });

  sectionsRoot?.addEventListener('keydown', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const fixtureCard = target.closest('.fixture-card[data-match-id]');
    if (!fixtureCard) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openFixture(fixtureCard);
  });
};

const mergeCompetitionData = (baseCompetitions, fixtureData = {}) =>
  baseCompetitions.map((competition) => {
    const hydrated = fixtureData?.[competition.id];
    if (!hydrated) return competition;
    return {
      ...competition,
      matchdays: Array.isArray(hydrated.matchdays) && hydrated.matchdays.length ? hydrated.matchdays : competition.matchdays,
      labels: hydrated.labels || competition.labels,
      fixtures: Array.isArray(hydrated.fixtures) && hydrated.fixtures.length ? hydrated.fixtures : competition.fixtures
    };
  });

const getOrderedCompetitions = (competitionList, activeId) => {
  if (!activeId) return competitionList;
  const activeCompetition = competitionList.find((competition) => competition.id === activeId);
  if (!activeCompetition) return competitionList;
  return [
    activeCompetition,
    ...competitionList.filter((competition) => competition.id !== activeId)
  ];
};

const setActiveMobileView = (view) => {
  Object.entries(mobileViewRoots).forEach(([key, root]) => {
    root?.classList.toggle('is-active', key === view);
  });

  bottomNavRoot?.querySelectorAll('.mobile-nav-item').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === view);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const bindBottomNav = () => {
  bottomNavRoot?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest('.mobile-nav-item[data-view]');
    if (!button) return;
    setActiveMobileView(button.dataset.view);
  });
};

const bindPlayersNavigation = () => {
  const playersRoot = mobileViewRoots.players;
  playersRoot?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const teamCard = target.closest('.mobile-player-team-card[data-player-team-id][data-player-league]');
    if (!teamCard) return;
    const params = new URLSearchParams({
      league: teamCard.dataset.playerLeague || '',
      teamId: teamCard.dataset.playerTeamId || ''
    });
    if (teamCard.dataset.playerTeamName) params.set('teamName', teamCard.dataset.playerTeamName);
    params.set('v', 'mobile45');
    window.location.href = `/mobile-version/player.html?${params.toString()}`;
  });
};

const renderExtraViews = async (mobileCompetitions) => {
  await renderLeaguesView(mobileViewRoots.leagues, mobileCompetitions, {
    preferredLeagueId: requestedLeagueId
  });
  await renderPlayersView(mobileViewRoots.players, mobileCompetitions);
  renderStatsView(mobileViewRoots.stats, mobileCompetitions);
  renderSettingsView(mobileViewRoots.settings);
  renderQuizView(mobileViewRoots.quiz);
  await renderNewsView(mobileViewRoots.news);
  renderCardgameView(mobileViewRoots.cards);
  renderProfileView(mobileViewRoots.profile);
};

const bootstrap = async () => {
  renderTopbar(topbarRoot);
  renderBottomNav(bottomNavRoot);

  let mobileCompetitions = competitions;

  try {
    const fixtureData = await loadCompetitionFixtures();
    mobileCompetitions = mergeCompetitionData(competitions, fixtureData);
  } catch (error) {
    console.warn('Unable to hydrate mobile competition fixtures.', error);
  }

  let activeCompetitionId = mobileCompetitions[0]?.id || null;

  const renderHomeCompetitions = () => {
    const orderedCompetitions = getOrderedCompetitions(mobileCompetitions, activeCompetitionId);
    renderCompetitionStrip(stripRoot, mobileCompetitions, {
      activeId: activeCompetitionId,
      onSelect: (competitionId) => {
        activeCompetitionId = competitionId;
        renderHomeCompetitions();
        if (mobileViewRoots.home?.classList.contains('is-active')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
    renderCompetitionSections(sectionsRoot, orderedCompetitions);
  };

  renderHomeCompetitions();
  await renderExtraViews(mobileCompetitions);
  initMobileAuth({
    onProfileRequested: () => setActiveMobileView('profile'),
    onSettingsRequested: () => setActiveMobileView('settings'),
    refreshProfile: () => renderProfileView(mobileViewRoots.profile)
  });
  initMobileSearch();
  bindFixtureNavigation();
  bindPlayersNavigation();
  bindBottomNav();
  document.querySelector('.mobile-brand')?.addEventListener('click', () => setActiveMobileView('home'));
  setActiveMobileView(mobileViewRoots[requestedMobileView] ? requestedMobileView : 'home');
};

bootstrap();
