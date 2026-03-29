export const renderCompetitionStrip = (
  root,
  competitions = [],
  { activeId = competitions[0]?.id, onSelect = null } = {}
) => {
  if (!root) return;

  root.innerHTML = `
    <div class="mobile-comp-strip" data-component="competition-strip">
      ${competitions
        .map(
          (competition) => `
            <button
              class="mobile-sidebar-item${competition.id === activeId ? ' active' : ''} ${competition.themeClass || ''}"
              type="button"
              data-target="${competition.id}"
              aria-label="Jump to ${competition.title}"
              title="${competition.title}"
            >
              <img src="${competition.logo}" alt="${competition.title}" />
            </button>
          `
        )
        .join('')}
    </div>
  `;

  root.querySelectorAll('[data-target]').forEach((button) => {
    button.addEventListener('click', () => {
      root.querySelectorAll('.mobile-sidebar-item').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      if (typeof onSelect === 'function') {
        onSelect(button.dataset.target);
        return;
      }
      const target = document.getElementById(`section-${button.dataset.target}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};
