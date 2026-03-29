const renderTeamLogo = (team) => {
  if (team.logo) {
    return `<img class="team-logo" src="${team.logo}" alt="${team.name}" />`;
  }

  return `<span class="team-logo-fallback">${String(team.short || team.name || 'TM').slice(0, 3)}</span>`;
};

const renderFixtureCard = (fixture) => {
  const scoreClass = fixture.state === 'upcoming' ? 'score upcoming-score' : 'score';

  return `
    <article
      class="match-card fixture-card ${fixture.state}${fixture.id ? ' is-clickable' : ''}"
      title="${fixture.meta || ''}"
      ${fixture.id ? `data-match-id="${fixture.id}"` : ''}
      ${fixture.competitionId ? `data-competition-id="${fixture.competitionId}"` : ''}
      ${fixture.home?.name ? `data-home-name="${fixture.home.name}"` : ''}
      ${fixture.away?.name ? `data-away-name="${fixture.away.name}"` : ''}
      ${fixture.id ? 'tabindex="0" role="button"' : ''}
    >
      <div class="team-side">
        ${renderTeamLogo(fixture.home)}
        <span class="team-name">${fixture.home.short}</span>
      </div>
      <span class="${scoreClass}">${fixture.score}</span>
      <div class="team-side right">
        ${renderTeamLogo(fixture.away)}
        <span class="team-name">${fixture.away.short}</span>
      </div>
    </article>
  `;
};

const renderFlag = (competition) => {
  if (!competition.flagClass) return '<span class="flag flag-world" aria-hidden="true"></span>';
  return `<span class="flag ${competition.flagClass}" aria-hidden="true"></span>`;
};

const renderCompetitionBox = (competition) => `
  <section
    class="league-card ${competition.themeClass || ''}"
    id="section-${competition.id}"
    data-component="${competition.component}"
  >
    <div class="league-header">
      <div class="league-logo">
        <img src="${competition.logo}" alt="${competition.title}" />
      </div>
      ${renderFlag(competition)}
      <div class="league-title">${competition.title}</div>
    </div>

    <div class="matchday-row">
      ${competition.matchdays
        .map(
          (label, index) => `
            <button class="mw-pill${index === 0 ? ' active' : ''}" type="button">${label}</button>
          `
        )
        .join('')}
    </div>

    <div class="fixtures-head">
      <span>${competition.labels?.left || 'Played'}</span>
      <span>${competition.labels?.right || 'Upcoming'}</span>
    </div>

    <div class="match-grid">
      ${competition.fixtures.map(renderFixtureCard).join('')}
    </div>
  </section>
`;

export const renderCompetitionSections = (root, competitions = []) => {
  if (!root) return;

  root.classList.add('mobile-sections');
  root.innerHTML = competitions.map(renderCompetitionBox).join('');
};
