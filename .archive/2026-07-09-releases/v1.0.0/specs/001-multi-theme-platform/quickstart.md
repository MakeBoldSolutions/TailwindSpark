# Quickstart: Multi-Theme Design System Platform

## Goal

Implement and verify a multi-theme design-system platform for TailwindSpark without changing application structure or business logic.

## Prerequisites

- Node 18 or newer
- Workspace dependencies installed from the repository root
- Feature branch `001-multi-theme-platform` checked out

## Primary Files Expected to Change

- `packages/design-tokens/theme.css`
- `packages/design-tokens/tailwind.config.js`
- `packages/ui-components/src/components/Button.tsx`
- `packages/ui-components/src/components/Card.tsx`
- `packages/ui-components/src/components/Form.tsx`
- `packages/ui-components/src/components/Modal.tsx`
- `apps/demo-app/index.html`
- `apps/demo-app/tailwind.config.js`
- `apps/demo-app/src/index.css`
- `apps/demo-app/src/contexts/ThemeContext.tsx`
- `apps/demo-app/src/components/`
- `apps/demo-app/src/pages/AboutPage.tsx`
- `apps/demo-app/src/pages/AnalyticsPage.tsx`
- `apps/demo-app/src/pages/AppsHubPage.tsx`
- `apps/demo-app/src/pages/DashboardPage.tsx`
- `apps/demo-app/src/pages/DemosPage.tsx`
- `apps/demo-app/src/pages/DesignSystemPage.tsx`
- `apps/demo-app/src/pages/EcommercePage.tsx`
- `apps/demo-app/src/pages/HomePage.tsx`
- `apps/demo-app/src/pages/MarketingPage.tsx`
- `apps/demo-app/src/pages/SettingsPage.tsx`
- `apps/demo-app/src/pages/UsersPage.tsx`

## Recommended Implementation Order

1. Define the token contract and named theme blocks in `packages/design-tokens/theme.css`.
2. Align Tailwind configuration with CSS-variable-driven semantics and remove duplicated hardcoded visual values where practical.
3. Add theme bootstrap and named-theme runtime support in the demo app.
4. Refactor shared UI primitives to consume semantic recipes and component tokens.
5. Migrate app-level layout and high-visibility surfaces that still depend on dark-only or palette-specific assumptions.
6. Add or update tests for persistence, theme matrix rendering, and token completeness.

## Development Commands

From the repository root:

```powershell
npm install
npm run dev
```

Quality checks:

```powershell
npm run lint
npm run type-check
npm run test
```

Focused package checks when iterating:

```powershell
npm run test --workspace=@tailwindspark/ui-components
npm run test --workspace=@tailwindspark/demo-app
```

## Manual Verification Checklist

1. Start the demo app and verify the default theme loads without a visible wrong-theme flash.
2. Switch between material, minimal, and brutalist themes and confirm layout structure and feature behavior do not change.
3. Reload the page and verify the previously selected theme is restored.
4. Visit dashboard, analytics, marketing, ecommerce, settings, users, about, apps hub, design system, and demos routes to confirm the semantic theme contract applies consistently.
5. Visit project list, article list, repository, weather, joke, and prompt or chat flows to confirm they remain functional under each theme.
6. Confirm keyboard focus indicators, navigation, and readable text remain intact across all shipped themes.
7. Trigger a service-worker-managed reload after a theme asset change and confirm no manual cache clear is required.
8. Add a temporary test theme definition and verify it can be activated without rewriting components.

## Add-Theme Checklist

1. Add a new `html[data-theme='<theme-id>'][data-theme-mode='light']` block in `packages/design-tokens/theme.css`.
2. Add a matching dark-mode block for the same theme id.
3. Define semantic colors, typography, shape, motion, and component recipe variables for both blocks.
4. Register the new profile in `apps/demo-app/src/utils/themeRegistry.ts` with label, description, default mode, and metadata.
5. Verify the theme selector, persistence, and a representative shared component still render correctly.

## Rollout Recovery Notes

- The service worker uses `THEME_RUNTIME_VERSION` in `apps/demo-app/public/sw.js` to coordinate cache invalidation for theme runtime changes.
- After changing theme boot or token behavior, verify that a refreshed client receives the current service-worker version and recovers without a manual cache clear.
- Use the existing focused workspace checks first, then perform a browser reload test against a service-worker-controlled session.
- Verified locally on 2026-04-14 against a production-style `/TailwindSpark/` dist server: the active service worker reported `theme-platform-v1`, a simulated stale-version message cleared existing caches automatically, and a reload restored a healthy `runtime-theme-platform-v1` / `static-theme-platform-v1` / `images-theme-platform-v1` cache set without manual cache clearing.

## Exit Criteria

- Named themes are selectable and persistent.
- Shared components and core app surfaces consume the semantic theme contract.
- Existing user journeys remain functionally unchanged.
- Lint, type-check, and test commands pass.
- The implementation remains compliant with semantic-token, accessibility, and source-artifact separation requirements.