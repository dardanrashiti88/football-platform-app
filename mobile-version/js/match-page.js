import { renderTopbar } from './modules/renderTopbar.js';
import { renderBottomNav } from './modules/renderBottomNav.js';
import { initMobileAuth } from './modules/mobileAuth.js';
import { initMobileSearch } from './modules/mobileSearch.js';

const topbarRoot = document.getElementById('mobile-topbar');
const bottomNavRoot = document.getElementById('mobile-bottom-nav');
const backButton = document.getElementById('mobile-match-back');
const iframe = document.getElementById('mobile-match-frame');
const title = document.querySelector('.mobile-match-page__title');

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
const matchId = params.get('matchId');
const competitionId = params.get('competitionId');
const homeName = params.get('homeName');
const awayName = params.get('awayName');
const isIOSDevice =
  /iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (matchId && iframe) {
  const iframeParams = new URLSearchParams({
    matchId,
    embedMatch: '1',
    mobileMatch: '1',
    v: 'mobile45'
  });
  if (competitionId) iframeParams.set('competitionId', competitionId);
  if (homeName) iframeParams.set('homeName', homeName);
  if (awayName) iframeParams.set('awayName', awayName);
  const targetUrl = `/frontend/index.html?${iframeParams.toString()}`;
  if (isIOSDevice) {
    window.location.replace(targetUrl);
  } else {
    iframe.src = targetUrl;
  }
} else if (title) {
  title.textContent = 'Match Not Found';
  if (iframe) {
    iframe.remove();
  }
}

backButton?.addEventListener('click', () => {
  window.location.href = '/mobile-version/index.html?v=mobile45';
});

document.querySelector('.mobile-brand')?.addEventListener('click', () => {
  window.location.href = '/mobile-version/index.html?v=mobile45';
});
