const views = [{ id: 'debug', label: 'Debug', active: true, mobileLabel: '1' }];

export const renderViewSwitcher = (root) => {
  if (!root) return;

  root.innerHTML = `
    <div class="mobile-view-switcher" data-component="view-switcher">
      ${views
        .map(
          (view) => `
            <button class="mobile-view-switcher__item${view.active ? ' active' : ''}" type="button" aria-label="${view.label}">
              <span class="mobile-view-switcher__dot"></span>
              <span class="mobile-view-switcher__label">${view.mobileLabel || view.label}</span>
            </button>
          `
        )
        .join('')}
    </div>
  `;
};
