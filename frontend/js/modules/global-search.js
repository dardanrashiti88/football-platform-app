import { showLeagues, showPlayers } from '../core/views.js';
import { activateSidebarLeague } from './sidebar.js';
import { getLogoByName } from './players.js';

const searchOpenBtn = document.querySelector('#global-search-open');
const searchOverlay = document.querySelector('#global-search');
const searchInput = document.querySelector('#global-search-input');
const searchResults = document.querySelector('#global-search-results');
const searchCloseBtn = document.querySelector('#global-search-close');

const COMPETITIONS = [
  { key: 'premier', label: 'Premier League' },
  { key: 'championship', label: 'EFL Championship' },
  { key: 'facup', label: 'FA Cup' },
  { key: 'carabaocup', label: 'Carabao Cup' },
  { key: 'seriea', label: 'Serie A' },
  { key: 'laliga', label: 'LaLiga' },
  { key: 'bundesliga', label: 'Bundesliga' },
  { key: 'ligue1', label: 'Ligue 1' },
  { key: 'ucl', label: 'Champions League' },
  { key: 'europa', label: 'Europa League' },
  { key: 'conference', label: 'Conference League' },
  { key: 'worldcup', label: 'World Cup' }
];

const COMPETITION_LOGOS = {
  premier: '../images/comp-logos/Competition=Men_%20Premier%20League,%20Color=Color.webp',
  championship: '../images/comp-logos/EFLchampionship.svg',
  facup: '../images/comp-logos/facup.png',
  carabaocup: '../images/comp-logos/carabao-cup-crest.svg',
  seriea: '../images/comp-logos/seriea-enilive-logo_jssflz.png',
  laliga: '../images/comp-logos/Screenshot%202026-03-02%20155633.png',
  bundesliga: '../images/comp-logos/bundesliga-app.svg',
  ligue1: '../images/comp-logos/ligue-1.png',
  ucl: '../images/comp-logos/Competition=Men_%20Champions%20League,%20Color=Color.webp',
  europa: '../images/comp-logos/europa-league.png',
  conference: '../images/comp-logos/conference-league.svg',
  worldcup: '../images/comp-logos/2026-World-Cup.webp'
};

const TEAM_SOURCES = [
  {
    leagueKey: 'premier',
    label: 'Premier League',
    url: new URL('../../../db-api/data/competitions/premier-league/teams.json', import.meta.url)
  },
  {
    leagueKey: 'championship',
    label: 'EFL Championship',
    url: new URL('../../../db-api/data/competitions/championship/teams.json', import.meta.url)
  },
  {
    leagueKey: 'seriea',
    label: 'Serie A',
    url: new URL('../../../db-api/data/competitions/serie-a/teams.json', import.meta.url)
  },
  {
    leagueKey: 'laliga',
    label: 'LaLiga',
    url: new URL('../../../db-api/data/competitions/la-liga/teams.json', import.meta.url)
  },
  {
    leagueKey: 'bundesliga',
    label: 'Bundesliga',
    url: new URL('../../../db-api/data/competitions/bundesliga/teams.json', import.meta.url)
  },
  {
    leagueKey: 'ligue1',
    label: 'Ligue 1',
    url: new URL('../../../db-api/data/competitions/ligue-1/teams.json', import.meta.url)
  },
  {
    leagueKey: 'ucl',
    label: 'Champions League',
    url: new URL('../../../db-api/data/competitions/champions-league/teams.json', import.meta.url)
  }
];

const PLAYERSINFO_INDEX_URL = new URL('../../../db-api/playersinfo-index.json', import.meta.url);

const normalize = (value = '') =>
  String(value).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

let teamsIndex = null;
let teamsByLeague = null;
let playersIndex = null;
let loadingTeams = null;
let loadingPlayers = null;

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
};

const parseCsv = (text) => {
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const parts = line.split(',');
    if (parts.length > headers.length) {
      const fixed = parts.slice(0, headers.length - 1);
      fixed.push(parts.slice(headers.length - 1).join(','));
      parts.length = 0;
      parts.push(...fixed);
    }
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = (parts[idx] || '').trim();
    });
    return record;
  });
};

const loadTeamsIndex = async () => {
  if (teamsIndex) return teamsIndex;
  if (!loadingTeams) {
    loadingTeams = Promise.all(
      TEAM_SOURCES.map(async (source) => {
        try {
          const data = await fetchJson(source.url);
          return data.map((team) => ({
            leagueKey: source.leagueKey,
            leagueLabel: source.label,
            id: team.id,
            name: team.name || team.shortName || team.id,
            shortName: team.shortName || team.name || team.id
          }));
        } catch {
          return [];
        }
      })
    ).then((lists) => {
      teamsIndex = lists.flat();
      teamsByLeague = teamsIndex.reduce((acc, team) => {
        const key = `${team.leagueKey}:${team.id}`;
        acc.set(key, team.name || team.shortName || team.id);
        return acc;
      }, new Map());
      return teamsIndex;
    });
  }
  return loadingTeams;
};

const loadPlayersIndex = async () => {
  if (playersIndex) return playersIndex;
  if (!loadingPlayers) {
    loadingPlayers = (async () => {
      const index = await fetchJson(PLAYERSINFO_INDEX_URL);
      await loadTeamsIndex();
      const entries = [];
      const tasks = [];
      Object.entries(index || {}).forEach(([leagueKey, teams]) => {
        Object.entries(teams || {}).forEach(([teamId, entry]) => {
          if (!entry?.csv) return;
          const csvUrl = new URL(entry.csv, PLAYERSINFO_INDEX_URL);
          tasks.push(
            fetch(csvUrl)
              .then((res) => (res.ok ? res.text() : ''))
              .then((text) => {
                if (!text) return;
                const rows = parseCsv(text);
                const teamName = teamsByLeague?.get(`${leagueKey}:${teamId}`) || teamId;
                rows.forEach((row) => {
                  const name = row['Player Name'] || row['Name'] || row['Player'] || '';
                  if (!name) return;
                  entries.push({
                    type: 'player',
                    name,
                    leagueKey,
                    teamId,
                    teamName
                  });
                });
              })
              .catch(() => {})
          );
        });
      });
      await Promise.all(tasks);
      playersIndex = entries;
      return playersIndex;
    })();
  }
  return loadingPlayers;
};

const renderEmpty = (text) => {
  if (!searchResults) return;
  searchResults.innerHTML = `<div class="search-empty">${text}</div>`;
};

const renderSection = (title, items) => {
  if (!items.length) return '';
  const rows = items
    .map(
      (item) => {
        const label = item.label || item.name;
        const initials = String(label || '').split(' ').map((part) => part[0] || '').join('').slice(0, 2);
        const iconMarkup = item.logo
          ? `<img class="search-item-icon" src="${item.logo}" alt="${label}" />`
          : `<span class="search-item-icon fallback">${initials || '?'}</span>`;
        return `
        <button class="search-item" type="button" data-type="${item.type}" data-league="${item.leagueKey || ''}" data-team="${item.teamId || ''}" data-label="${label}">
          <span class="search-item-content">
            ${iconMarkup}
            <span class="search-item-label">${label}</span>
          </span>
          <span class="search-item-meta">${item.meta || ''}</span>
        </button>
      `;
      }
    )
    .join('');
  return `
    <div class="search-section">
      <div class="search-section-title">${title}</div>
      ${rows}
    </div>
  `;
};

const renderResults = (query, competitions, teams, players) => {
  if (!searchResults) return;
  const compHtml = renderSection('Competitions', competitions);
  const teamHtml = renderSection('Teams', teams);
  const playerHtml = renderSection('Players', players);
  if (!compHtml && !teamHtml && !playerHtml) {
    renderEmpty('No results');
    return;
  }
  searchResults.innerHTML = `${compHtml}${teamHtml}${playerHtml}`;
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

const searchIndex = async (query) => {
  const clean = normalize(query);
  if (!clean) {
    renderEmpty('Start typing to search...');
    return;
  }

  renderEmpty('Loading...');

  const [teams, players] = await Promise.all([loadTeamsIndex(), loadPlayersIndex()]);

  const competitionMatches = COMPETITIONS.filter((comp) => normalize(comp.label).startsWith(clean))
    .slice(0, 6)
    .map((comp) => ({
      type: 'competition',
      leagueKey: comp.key,
      label: comp.label,
      meta: 'Competition',
      logo: COMPETITION_LOGOS[comp.key]
    }));

  const teamMatches = await Promise.all(
    teams
      .filter((team) => normalize(team.name).startsWith(clean))
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
      .filter((player) => normalize(player.name).startsWith(clean))
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

  renderResults(clean, competitionMatches, teamMatches, playerMatches);
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

const handleResultClick = (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const item = target.closest('.search-item');
  if (!item) return;
  const type = item.dataset.type;
  const leagueKey = item.dataset.league;
  const teamId = item.dataset.team;
  const label = item.dataset.label;

  if (type === 'competition' && leagueKey) {
    showLeagues();
    const leagueTab =
      activateSidebarLeague(leagueKey, { ensureVisible: true })
      || document.querySelector(`.sidebar-item[data-league="${leagueKey}"]`);
    if (leagueTab) leagueTab.click();
    closeOverlay();
    return;
  }

  if (type === 'team' && leagueKey && teamId) {
    openTeamProfile(leagueKey, teamId);
    closeOverlay();
    return;
  }

  if (type === 'player' && leagueKey && teamId) {
    openTeamProfile(leagueKey, teamId, label);
    closeOverlay();
  }
};

export const initGlobalSearch = () => {
  if (searchOpenBtn) {
    searchOpenBtn.addEventListener('click', toggleOverlay);
  }
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeOverlay);
  }
  document.addEventListener('click', (event) => {
    if (!searchOverlay || searchOverlay.classList.contains('is-hidden')) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const insidePanel = target.closest('.global-search-panel');
    const insideTrigger = target.closest('#global-search-open');
    if (!insidePanel && !insideTrigger) {
      closeOverlay();
    }
  });
  if (searchResults) {
    searchResults.addEventListener('click', handleResultClick);
  }
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        searchIndex(searchInput.value || '');
      }, 150);
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && searchOverlay && !searchOverlay.classList.contains('is-hidden')) {
      closeOverlay();
    }
  });
};
