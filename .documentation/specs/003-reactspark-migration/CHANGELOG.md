# ReactSpark Migration Changelog

All notable implementation updates for feature `003-reactspark-migration` are documented in this file.

## 2026-03-07

### Added

- Mini-app route architecture under `/apps`, including Projects, Articles, Joke, Weather, and AI Chat pages
- Shared service layer for projects, RSS articles, jokes, weather, PromptSpark variants, and SignalR chat
- Accessibility smoke tests using axe for the app shell and mini-app pages
- Route precaching for the mini-app suite in the service worker
- Shared fetch option helpers for anonymous public API requests

### Changed

- Extended the main layout navigation with Apps discovery and keyboard-accessible menu behavior
- Migrated demo-app routing and page structure to support the ReactSpark mini-app experience alongside existing showcase routes
- Updated testing guidance and enforcement to use a temporary 40% coverage threshold for this feature
- Refined pagination, responsive layouts, and heading structure for the migrated mini-app pages
- Adjusted cache-clearing behavior so browser caches are only cleared during explicit hard-refresh flows
- Split framework, maps, markdown, and SignalR dependencies into dedicated build chunks so all gzipped chunks stay below the 100KB target

### Fixed

- Resolved SignalR connection handling by extracting reusable chat service helpers
- Fixed accessibility issues including unlabeled controls and heading-order violations
- Removed lingering production `console.log` usage in the migrated app code
- Ensured service worker route caching is visible and verifiable in-browser for the mini-app routes

### Validation

- ESLint passes for the demo app after migration cleanup
- Coverage passes the temporary spec threshold
- Keyboard navigation, dark mode, mobile, and tablet checks completed for the mini-app suite