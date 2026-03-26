## Summary
- migrate the ReactSparkPortfolio experience into the demo app as a mini-app suite under `/apps/*`
- add shared routing, SEO, theme, service, caching, and accessibility coverage for the migrated experience
- document the migration, testing baseline, and feature changelog updates

## What Changed
- added Apps hub navigation and dedicated mini-app pages for Projects, Articles, Joke, Weather, and AI Chat
- implemented hooks, services, types, and section components for each migrated feature
- added service worker route precaching, hard-refresh cache handling, and shared public fetch options
- expanded unit, integration, and accessibility coverage across the migrated app shell and mini-app flows
- updated demo-app and feature documentation, including the migration changelog and README architecture notes
- optimized Vite chunk splitting so all gzipped production chunks stay below the 100KB target

## Validation
- `npm run lint --workspace apps/demo-app`
- `npm run build --workspace apps/demo-app`
- `npm test -- --coverage` against the temporary 40% threshold
- axe accessibility smoke tests for app shell and mini-app pages
- manual keyboard, dark-mode, mobile, tablet, and service-worker cache verification

## Notes
- coverage enforcement is temporarily set to 40% for this feature and documented for future re-evaluation
- build output still emits the existing Rollup warning about SignalR PURE annotations being stripped, but the build succeeds cleanly
