# Theme Platform

> **TL;DR for the Product Owner**
> *What*: TailwindSpark supports multiple interchangeable named design systems (themes), each with light/dark variants, switchable without changing app structure or logic.
> *Why*: Lets the showcase demonstrate several design languages (material, minimal, brutalist, ...) against the same components and app surfaces.
> *Status*: Shipped and in active use — this describes the system as it stands, not the change that built it.
> *Decision needed*: none.

Harvested from the completed `001-multi-theme-platform` feature (shipped 2026-04-13, critic gate: pass, risk posture green). Work products (plan, tasks, quickstart, research, gate reports) are archived at `.archive/2026-07-09-001-multi-theme-platform/` — this doc is what a future feature actually needs.

## Data model

**ThemeProfile** — a selectable named design system (e.g. material, minimal, brutalist): `id`, `label`, `description`, `defaultMode`, `supportedModes`, `tokenSet`, `componentRecipes`, optional `metadata`. `id` must be unique and safe for `data-theme`; every theme must satisfy the full token contract (below); every shipped theme defines values or fallbacks for color, typography, spacing, radius, elevation, motion, and layout density. Owns one or more `ThemeModeProfile`s; referenced by many `ThemePreference` records over time.

**ThemeModeProfile** — a luminance/appearance variant (light/dark) within a theme: `mode`, `isDarkCompatible`, `colorScheme`, `tokenOverrides`. Every theme needs at least one mode; any dark-compatible mode must keep readable text, visible focus states, and accessible contrast.

**ThemePreference** — the user's selected theme state in the browser: `themeId`, `mode`, `source` (explicit vs. derived default), optional `updatedAt`. An unresolvable `themeId` falls back to default rather than blocking load. States: `unset` → `defaulted` (no prior preference) → `explicitly-selected` (user picks) → `fallback-applied` (a stored theme becomes invalid).

**TokenContract** — the semantic token categories every theme must provide: color, typography, spacing, radius, elevation, motion, layout, and component tokens. Missing categories fall back to baseline; themes must never bind components directly to raw palette values.

**ThemeableSurface** — a reusable UI area that consumes the shared contract: `surfaceId`, `surfaceType`, `requiredRecipes`, `accessibilityExpectations`. Each depends on one `TokenContract`; multiple components can share a `surfaceType`.

## Contract

- **Root DOM**: the root element is the theme host — `data-theme="<theme-id>"`, optional `.dark` class, correct `color-scheme` hint. Activation is idempotent (repeated application never causes DOM drift).
- **Persistence**: theme preference persists per browser context; an invalid/missing preference falls back to default without blocking startup.
- **Shared components**: consume semantic recipes/component tokens, never raw palette utilities; a new theme must never require duplicate component implementations; keyboard support, focus visibility, and readable hierarchy hold in every theme.
- **Application surfaces**: layout, navigation, lists, cards, forms, prompt/chat surfaces all render through the shared token contract; theme changes affect presentation only — never routes, data loading, or feature availability — and stay consistent across route transitions and async updates.
- **Validation**: every shipped theme satisfies the full token contract before being selectable; restoration is verified for first load and repeat visits.
