# FOD Mobile Version

This folder is a separate mobile-first app shell so we can work on phone design without breaking the desktop web.

## Structure

- `mobile-version/index.html`
  - main mobile entry point
- `mobile-version/css/`
  - `variables.css`: colors, spacing, radii
  - `base.css`: reset, fonts, body styling
  - `app-shell.css`: phone shell and hero block
  - `topbar.css`: only topbar styles
  - `view-switcher.css`: all app sections in a separate mobile row
  - `competition-strip.css`: quick competition rail
  - `competition-sections.css`: separate league boxes such as `prem-box`, `ucl-box`, `worldcup-box`
  - `bottom-nav.css`: sticky phone nav
- `mobile-version/js/`
  - `app.js`: bootstraps the mobile app
  - `data/competitions.js`: all mobile home data and asset paths
  - `modules/renderTopbar.js`
  - `modules/renderViewSwitcher.js`
  - `modules/renderCompetitionStrip.js`
  - `modules/renderCompetitionSections.js`
  - `modules/renderBottomNav.js`

## Component Debugging

Each big mobile block is isolated:

- `topbar`
- `view-switcher`
- `competition-strip`
- `prem-box`
- `ucl-box`
- `laliga-box`
- `seriea-box`
- `championship-box`
- `worldcup-box`
- `bottom-nav`

So if something breaks, we know exactly which file/component to check first.

## Current Scope

This is the first mobile foundation:

- phone-sized layout
- separated sections
- competition cards with fixtures
- isolated styling files

Next step can be wiring each box to the real live app data one by one.
