const asset = (path) => new URL(path, import.meta.url).href;

const iconHome = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
  </svg>
`;

const iconUser = `
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="8" r="4"></circle>
    <path d="M4 20c2.5-4 13.5-4 16 0"></path>
  </svg>
`;

const items = [
  { label: 'Home', active: true, type: 'home', view: 'home', icon: iconHome },
  { label: 'Leagues', view: 'leagues', image: asset('../../../images/icons/Copy_of_User-removebg-preview.png') },
  { label: 'Players', view: 'players', image: asset('../../../images/icons/Copy_of_User12-removebg-preview.png') },
  { label: 'Stats', view: 'stats', image: asset('../../../images/icons/Copy_of_User55-removebg-preview.png') },
  { label: 'Quiz', view: 'quiz', image: asset('../../../images/icons/Copy_of_User98-removebg-preview.png') },
  { label: 'News', view: 'news', image: asset('../../../images/icons/Copy_of_Use3r-removebg-preview.png') },
  { label: 'Cards', view: 'cards', image: asset('../../../images/icons/Copy_of_User1-removebg-preview.png') },
  { label: 'Profile', type: 'profile', view: 'profile', icon: iconUser }
];

const renderIcon = (item) => {
  if (item.image) {
    return `<img class="mobile-nav-item__img" src="${item.image}" alt="" />`;
  }

  return `<span class="mobile-nav-item__svg">${item.icon}</span>`;
};

export const renderBottomNav = (root) => {
  if (!root) return;

  root.innerHTML = `
    <div class="mobile-bottom-nav" data-component="bottom-nav">
      <div class="mobile-bottom-nav__grid">
        ${items
          .map(
            (item) => `
              <button
                class="mobile-nav-item${item.active ? ' is-active' : ''}${item.type === 'home' ? ' mobile-nav-item--home' : ''}"
                type="button"
                aria-label="${item.label}"
                data-view="${item.view}"
              >
                <span class="mobile-nav-item__icon-wrap">
                  ${renderIcon(item)}
                </span>
                <span class="mobile-nav-item__label">${item.label}</span>
              </button>
            `
          )
          .join('')}
      </div>
    </div>
  `;
};
