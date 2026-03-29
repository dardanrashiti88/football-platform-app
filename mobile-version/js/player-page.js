import { renderTopbar } from './modules/renderTopbar.js';
import { renderBottomNav } from './modules/renderBottomNav.js';
import { initMobileAuth } from './modules/mobileAuth.js';
import { initMobileSearch } from './modules/mobileSearch.js';

const topbarRoot = document.getElementById('mobile-topbar');
const bottomNavRoot = document.getElementById('mobile-bottom-nav');
const iframe = document.getElementById('mobile-player-frame');

renderTopbar(topbarRoot);
renderBottomNav(bottomNavRoot);
initMobileSearch();
initMobileAuth({
  onProfileRequested: () => {
    window.location.href = '/mobile-version/index.html?view=profile&v=mobile45';
  },
  onSettingsRequested: () => {
    window.location.href = '/mobile-version/index.html?view=settings&v=mobile45';
  }
});

const params = new URLSearchParams(window.location.search);
const league = params.get('league');
const teamId = params.get('teamId');
const teamName = params.get('teamName');
const playerName = params.get('playerName');

if (league && teamId && iframe) {
  const iframeParams = new URLSearchParams({
    view: 'players',
    playersLeague: league,
    playersTeam: teamId,
    playersTeamName: teamName || '',
    playersPlayer: playerName || '',
    embedPlayers: '1',
    mobilePlayer: '1',
    v: 'mobile45'
  });
  iframe.src = `/frontend/index.html?${iframeParams.toString()}`;
} else {
  iframe?.remove();
}

const goMobileView = (view = 'players') => {
  const params = new URLSearchParams({
    view,
    v: 'mobile45'
  });
  window.location.href = `/mobile-version/index.html?${params.toString()}`;
};

document.querySelector('.mobile-brand')?.addEventListener('click', () => {
  goMobileView('home');
});

bottomNavRoot?.querySelectorAll('.mobile-nav-item').forEach((button) => {
  const view = button.getAttribute('data-view') || 'home';
  button.classList.toggle('is-active', view === 'players');
  button.addEventListener('click', () => {
    goMobileView(view);
  });
});
