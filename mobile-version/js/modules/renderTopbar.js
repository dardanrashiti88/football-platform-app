const iconSearch = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="6"></circle>
    <path d="M20 20L16.65 16.65"></path>
  </svg>
`;

const iconBell = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M6 8a6 6 0 1112 0c0 7 3 7 3 9H3c0-2 3-2 3-9"></path>
    <path d="M10 21a2 2 0 004 0"></path>
  </svg>
`;

const iconSettings = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-.51A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
`;

const iconCaret = `
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 6l5 5 5-5"></path>
  </svg>
`;

export const renderTopbar = (root) => {
  if (!root) return;

  const logo = new URL('../../../images/web-logo/CUSTOM~1.PNG', import.meta.url).href;

  root.innerHTML = `
    <div class="mobile-topbar" data-component="topbar">
      <div class="mobile-topbar__head">
        <button class="mobile-brand" type="button" aria-label="Go to home">
          <img src="${logo}" alt="FOD" />
        </button>

        <div class="mobile-topbar__actions">
          <button class="mobile-action-btn" type="button" aria-label="Notifications">
            ${iconBell}
          </button>
          <button class="mobile-action-btn" type="button" id="mobile-settings-open" aria-label="Settings">
            ${iconSettings}
          </button>
          <button class="mobile-user-pill" type="button" id="mobile-auth-open" aria-label="Open login or profile">
            <span class="mobile-avatar-dot" aria-hidden="true"></span>
            <span class="mobile-user-pill__label">Login</span>
            ${iconCaret}
          </button>
        </div>
      </div>

      <div class="mobile-search-wrap">
        <label class="mobile-search-pill" aria-label="Search">
          ${iconSearch}
          <input id="mobile-global-search-input" type="text" placeholder="Search teams, players, comps..." />
        </label>
        <div class="mobile-search-results is-hidden" id="mobile-global-search-results">
          <div class="mobile-search-empty">Start typing to search...</div>
        </div>
      </div>
    </div>
  `;
};
