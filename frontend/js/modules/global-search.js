import { showHome, showLeagues, showNews, showPlayers } from '../core/views.js';
import { activateSidebarLeague } from './sidebar.js';
import { getLogoByName } from './players.js';
import { COMPETITION_ORDER, getCompetitionConfig } from './competition-catalog.js';
import {
  loadFixturesIndex,
  loadNewsIndex,
  loadPlayersIndex,
  loadTeamsIndex,
  normalizeSearchText
} from './search-data.js';

const searchOpenBtn = document.querySelector('#global-search-open');
const searchOverlay = document.querySelector('#global-search');
const searchInput = document.querySelector('#global-search-input');
const searchResults = document.querySelector('#global-search-results');
const searchCloseBtn = document.querySelector('#global-search-close');

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderEmpty = (text) => {
  if (!searchResults) return;
  searchResults.innerHTML = `<div class="search-empty">${text}</div>`;
};

const renderSection = (title, items) => {
  if (!items.length) return '';
  const rows = items
    .map((item) => {
      const label = item.label || item.name;
      const initials = String(label || '')
        .split(' ')
        .map((part) => part[0] || '')
        .join('')
        .slice(0, 2);
      const iconMarkup = item.logo
        ? `<img class="search-item-icon" src="${escapeHtml(item.logo)}" alt="${escapeHtml(label)}" />`
        : `<span class="search-item-icon fallback">${escapeHtml(initials || '?')}</span>`;

      return `
        <button
          class="search-item"
          type="button"
          data-type="${escapeHtml(item.type)}"
          data-league="${escapeHtml(item.leagueKey || '')}"
          data-team="${escapeHtml(item.teamId || '')}"
          data-label="${escapeHtml(label)}"
          data-match-id="${escapeHtml(item.matchId || item.id || '')}"
          data-home-name="${escapeHtml(item.homeName || '')}"
          data-away-name="${escapeHtml(item.awayName || '')}"
          data-article-slug="${escapeHtml(item.slug || '')}"
        >
          <span class="search-item-content">
            ${iconMarkup}
            <span class="search-item-label">${escapeHtml(label)}</span>
          </span>
          <span class="search-item-meta">${escapeHtml(item.meta || '')}</span>
        </button>
      `;
    })
    .join('');

  return `
    <div class="search-section">
      <div class="search-section-title">${title}</div>
      ${rows}
    </div>
  `;
};

const renderResults = (sections) => {
  if (!searchResults) return;
  const markup = sections.map(([title, items]) => renderSection(title, items)).join('');
  if (!markup) {
    renderEmpty('No results');
    return;
  }
  searchResults.innerHTML = markup;
};

const openOverlay = () => {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('is-hidden');
  searchOverlay.setAttribute('aria-hidden', 'false');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  renderEmpty('Start typing to search...');
};

const closeOverlay = () => {
  if (!searchOverlay) return;
  searchOverlay.classList.add('is-hidden');
  searchOverlay.setAttribute('aria-hidden', 'true');
};

const toggleOverlay = () => {
  if (!searchOverlay) return;
  if (searchOverlay.classList.contains('is-hidden')) {
    openOverlay();
  } else {
    closeOverlay();
  }
};

const openTeamProfile = (leagueKey, teamId, playerName) => {
  showPlayers();
  const leagueTab =
    activateSidebarLeague(leagueKey, { ensureVisible: true })
    || document.querySelector(`.sidebar-item[data-league="${leagueKey}"]`);
  if (leagueTab) {
    leagueTab.click();
  }
  const searchInputLocal = document.querySelector('#players-search-input');
  if (searchInputLocal && playerName) {
    searchInputLocal.value = playerName;
    searchInputLocal.dispatchEvent(new Event('input', { bubbles: true }));
  }
  let attempts = 0;
  const tryOpen = () => {
    const pill = document.querySelector(`.team-pill[data-team-id="${teamId}"]`);
    if (pill) {
      pill.click();
      return;
    }
    attempts += 1;
    if (attempts < 12) {
      setTimeout(tryOpen, 150);
    }
  };
  tryOpen();
};

const openFixtureContext = (leagueKey) => {
  showHome();
  const card = document.querySelector(`.league-card[data-league="${leagueKey}"]`);
  if (card && !card.classList.contains('is-layout-hidden')) {
    card.click();
    return;
  }
  showLeagues();
  const leagueTab =
    activateSidebarLeague(leagueKey, { ensureVisible: true })
    || document.querySelector(`.sidebar-item[data-league="${leagueKey}"]`);
  leagueTab?.click();
};

const openNewsArticle = (slug) => {
  showNews();
  requestAnimationFrame(() => {
    document.querySelector(`[data-article-id="${slug}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

const searchIndex = async (query) => {
  const clean = normalizeSearchText(query);
  if (!clean) {
    renderEmpty('Start typing to search...');
    return;
  }

  renderEmpty('Loading...');

  const [teams, players, fixtures, articles] = await Promise.all([
    loadTeamsIndex(),
    loadPlayersIndex(),
    loadFixturesIndex(),
    loadNewsIndex()
  ]);

  const competitionMatches = COMPETITION_ORDER
    .filter((leagueId) => normalizeSearchText(getCompetitionConfig(leagueId)?.label || '').includes(clean))
    .slice(0, 6)
    .map((leagueId) => {
      const config = getCompetitionConfig(leagueId);
      return {
        type: 'competition',
        leagueKey: leagueId,
        label: config.label,
        meta: 'Competition',
        logo: config.logo
      };
    });

  const teamMatches = await Promise.all(
    teams
      .filter((team) => normalizeSearchText(team.name).includes(clean))
      .slice(0, 8)
      .map(async (team) => ({
        type: 'team',
        leagueKey: team.leagueKey,
        teamId: team.id,
        name: team.name,
        meta: team.leagueLabel,
        logo: await getLogoByName(team.leagueKey, team.name)
      }))
  );

  const playerMatches = await Promise.all(
    players
      .filter((player) => normalizeSearchText(player.name).includes(clean))
      .slice(0, 8)
      .map(async (player) => ({
        type: 'player',
        leagueKey: player.leagueKey,
        teamId: player.teamId,
        name: player.name,
        meta: player.teamName,
        logo: await getLogoByName(player.leagueKey, player.teamName)
      }))
  );

  const fixtureMatches = fixtures
    .filter((fixture) => normalizeSearchText(fixture.label).includes(clean))
    .slice(0, 8)
    .map((fixture) => ({
      type: 'fixture',
      leagueKey: fixture.leagueKey,
      label: fixture.label,
      meta: fixture.leagueLabel,
      logo: getCompetitionConfig(fixture.leagueKey)?.logo || '',
      matchId: fixture.id,
      homeName: fixture.homeName,
      awayName: fixture.awayName
    }));

  const newsMatches = articles
    .filter((article) => {
      const haystack = `${article.title || ''} ${article.excerpt || ''} ${article.meta || ''}`;
      return normalizeSearchText(haystack).includes(clean);
    })
    .slice(0, 6)
    .map((article) => ({
      type: 'news',
      label: article.title,
      meta: article.uploadedAtLabel || article.meta || 'News',
      logo: article.imageUrl || '',
      slug: article.slug
    }));

  renderResults([
    ['Competitions', competitionMatches],
    ['Teams', teamMatches],
    ['Players', playerMatches],
    ['Fixtures', fixtureMatches],
    ['News', newsMatches]
  ]);
};

const handleResultClick = (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const item = target.closest('.search-item');
  if (!item) return;

  const type = item.dataset.type;
  const leagueKey = item.dataset.league;
  const teamId = item.dataset.team;
  const label = item.dataset.label;
  const articleSlug = item.dataset.articleSlug;

  if (type === 'competition' && leagueKey) {
    showLeagues();
    const leagueTab =
      activateSidebarLeague(leagueKey, { ensureVisible: true })
      || document.querySelector(`.sidebar-item[data-league="${leagueKey}"]`);
    leagueTab?.click();
    closeOverlay();
    return;
  }

  if ((type === 'team' || type === 'player') && leagueKey && teamId) {
    openTeamProfile(leagueKey, teamId, type === 'player' ? label : '');
    closeOverlay();
    return;
  }

  if (type === 'fixture' && leagueKey) {
    openFixtureContext(leagueKey);
    closeOverlay();
    return;
  }

  if (type === 'news' && articleSlug) {
    openNewsArticle(articleSlug);
    closeOverlay();
  }
};

export const initGlobalSearch = () => {
  searchOpenBtn?.addEventListener('click', toggleOverlay);
  searchCloseBtn?.addEventListener('click', closeOverlay);
  searchOverlay?.addEventListener('click', (event) => {
    if (event.target === searchOverlay) closeOverlay();
  });
  searchResults?.addEventListener('click', handleResultClick);
  searchInput?.addEventListener('input', (event) => {
    void searchIndex(event.target.value);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeOverlay();
    }
  });
};
