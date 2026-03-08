# Tailwind CSS v4 Upgrade Implementation Plan

Date: 2025-09-07
Session: 2025-09-07

## Objectives

1. Unify all packages on Tailwind CSS v4.x.
2. Centralize design tokens and avoid duplication across configs.
3. Adopt v4 CSS entrypoint (`@import "tailwindcss";`) and begin gradual migration toward the new `@theme` token pattern.
4. Remove deprecated / legacy utilities and redundant handcrafted classes when native utilities exist.
5. Ensure plugin support (forms, typography, aspect-ratio) is correctly declared and installed.
6. Maintain backward compatibility for existing components while laying groundwork for future token-driven theming.

## Summary of Changes (Planned & Executed Incrementally)

| Area | Action | Status |
|------|--------|--------|
| Versions | Align `tailwindcss` to ^4.1.x across root, design-tokens, ui-components, demo-app | Pending update commit |
| Plugins | Add `@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/aspect-ratio` to root devDeps (single source) | Pending |
| Config Duplication | Replace duplicated color/font setup in `apps/demo-app/tailwind.config.js` with re-export of design-tokens config | Pending |
| ESM Consistency | Convert `packages/ui-components/tailwind.config.js` from CJS to ESM | Pending |
| CSS Entry | Replace three-part imports with single `@import "tailwindcss";` in `apps/demo-app/src/index.css` | Pending |
| Theme Tokens | Introduce initial `@theme` block (non-breaking) for colors & spacing in `index.css` | Pending |
| Legacy Utilities | Remove custom `.aspect-w-4` (replace with `aspect-[4/3]` utility) & keep a note for any component updates | Pending |
| Animations | Keep existing keyframes; future step: move to `@layer utilities` or tokenize durations | Deferred |
| Docs | Add this plan + update future migration notes in session summary | In progress |

## Rationale & Best Practices (Tailwind v4)

Tailwind v4 emphasizes:

- Config optionality: leaner configs; token definition can live in CSS via `@theme`.
- Faster builds via the new on-demand engine; fewer deep `content` globs when possible.
- Encouraging design tokens as first-class citizens (CSS custom properties mapping directly to utilities).
- Simplified entrypoint (`@import "tailwindcss";`) replacing the previous layered triple import.

## Implementation Details

### 1. Dependency Alignment

All packages will use a consistent Tailwind version to avoid mismatched processing between local dev, library build, and consuming apps.

### 2. Plugin Declaration

Rather than scattering plugin dependencies across multiple packages, they are declared once at the workspace root and consumed through the centralized design tokens config.

### 3. Central Config Reuse

`apps/demo-app/tailwind.config.js` will import and spread `@tailwindspark/design-tokens/tailwind.config.js` to eliminate palette duplication.

### 4. CSS Token Introduction

An initial `@theme` block will declare tokens for colors, spacing, radii—mirroring the existing JS `theme.extend` values. This is additive; later we may remove JS definitions once confidence is high.

### 5. Legacy Utility Cleanup

The handcrafted `.aspect-w-4` wrapper is replaced by native `aspect-[4/3]`. A TODO will be added for scanning components still referencing the old class (transitional period).

### 6. Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Build fails due to missing plugins | Install plugins at root before running builds |
| Unused duplicated classes linger | Add TODO & grep follow-up task |
| Components relying on removed class | Provide compatibility shim temporarily (commented) |

### 7. Follow-Up Opportunities (Deferred)

- Full migration of theme values to `@theme` + removal from JS config.
- Introduce semantic alias tokens (e.g. `--color-surface`, `--color-border-muted`).
- Add safelist strategy documentation if future dynamic class generation is introduced.
- Performance audit of bundle size before/after migration.

## Validation Plan

1. Run `npm install` to ensure dependency graph resolves.
2. `npm run build:ci` to exercise all package builds.
3. `npm run test` to confirm no regressions.
4. Manual smoke of demo app (`npm run dev` in `apps/demo-app`).

## Rollback Strategy

If issues arise, revert:

1. `apps/demo-app/src/index.css` to previous triple import version.
2. Restore previous `tailwind.config.js` in demo app (saved via Git history).
3. Remove `@theme` block if it causes unexpected overrides.

---
Prepared automatically by Copilot session 2025-09-07.
