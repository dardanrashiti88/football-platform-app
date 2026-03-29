import { competitions as mobileCompetitions } from '../data/competitions.js';
import { getLogoByName } from '../../../frontend/js/modules/players.js';

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

const COMPETITIONS = mobileCompetitions.map((competition) => ({
  key: competition.id,
  label: competition.title,
  logo: competition.logo
}));

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

const renderEmpty = (root, text) => {
  if (!root) return;
  root.innerHTML = `<div class="mobile-search-empty">${text}</div>`;
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
        ? `<img class="mobile-search-item__icon" src="${item.logo}" alt="${label}" />`
        : `<span class="mobile-search-item__icon mobile-search-item__icon--fallback">${initials || '?'}</span>`;
      return `
        <button
          class="mobile-search-item"
          type="button"
          data-type="${item.type}"
          data-league="${item.leagueKey || ''}"
          data-team="${item.teamId || ''}"
          data-team-name="${item.teamName || item.name || ''}"
          data-label="${label}"
        >
          <span class="mobile-search-item__content">
            ${iconMarkup}
            <span class="mobile-search-item__label">${label}</span>
          </span>
          <span class="mobile-search-item__meta">${item.meta || ''}</span>
        </button>
      `;
    })
    .join('');

  return `
    <div class="mobile-search-section">
      <div class="mobile-search-section__title">${title}</div>
      ${rows}
    </div>
  `;
};

const renderResults = (root, competitions, teams, players) => {
  if (!root) return;
  const html = [
    renderSection('Competitions', competitions),
    renderSection('Teams', teams),
    renderSection('Players', players)
  ]
    .filter(Boolean)
    .join('');

  if (!html) {
    renderEmpty(root, 'No results');
    return;
  }

  root.innerHTML = html;
};

const openResults = (resultsRoot) => {
  resultsRoot?.classList.remove('is-hidden');
};

const closeResults = (resultsRoot) => {
  resultsRoot?.classList.add('is-hidden');
};

const searchIndex = async (query, resultsRoot) => {
  const clean = normalize(query);
  if (!clean) {
    renderEmpty(resultsRoot, 'Start typing to search...');
    return;
  }

  renderEmpty(resultsRoot, 'Loading...');
  openResults(resultsRoot);

  const [teams, players] = await Promise.all([loadTeamsIndex(), loadPlayersIndex()]);

  const competitionMatches = COMPETITIONS.filter((comp) => normalize(comp.label).startsWith(clean))
    .slice(0, 6)
    .map((comp) => ({
      type: 'competition',
      leagueKey: comp.key,
      label: comp.label,
      meta: 'Competition',
      logo: comp.logo
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
        teamName: team.name,
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
        teamName: player.teamName,
        meta: player.teamName,
        logo: await getLogoByName(player.leagueKey, player.teamName)
      }))
  );

  renderResults(resultsRoot, competitionMatches, teamMatches, playerMatches);
};

export const initMobileSearch = () => {
  const input = document.querySelector('#mobile-global-search-input');
  const resultsRoot = document.querySelector('#mobile-global-search-results');
  const searchWrap = document.querySelector('.mobile-search-wrap');
  if (!input || !resultsRoot || !searchWrap) return;

  let timer = null;

  const navigateToTeam = (leagueKey, teamId, teamName, playerName = '') => {
    const params = new URLSearchParams({
      league: leagueKey || '',
      teamId: teamId || '',
      teamName: teamName || '',
      v: 'mobile45'
    });
    if (playerName) params.set('playerName', playerName);
    window.location.href = `/mobile-version/player.html?${params.toString()}`;
  };

  const navigateToCompetition = (leagueKey) => {
    const params = new URLSearchParams({
      view: 'leagues',
      league: leagueKey || '',
      v: 'mobile45'
    });
    window.location.href = `/mobile-version/index.html?${params.toString()}`;
  };

  input.addEventListener('focus', () => {
    openResults(resultsRoot);
    if (!input.value.trim()) {
      renderEmpty(resultsRoot, 'Start typing to search...');
    }
  });

  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      searchIndex(input.value || '', resultsRoot);
    }, 150);
  });

  resultsRoot.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const item = target.closest('.mobile-search-item');
    if (!item) return;

    const type = item.dataset.type;
    const leagueKey = item.dataset.league;
    const teamId = item.dataset.team;
    const teamName = item.dataset.teamName;
    const label = item.dataset.label;

    closeResults(resultsRoot);

    if (type === 'competition') {
      navigateToCompetition(leagueKey);
      return;
    }

    if ((type === 'team' || type === 'player') && leagueKey && teamId) {
      navigateToTeam(leagueKey, teamId, teamName, type === 'player' ? label : '');
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest('.mobile-search-wrap')) {
      closeResults(resultsRoot);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeResults(resultsRoot);
    }
  });
};
