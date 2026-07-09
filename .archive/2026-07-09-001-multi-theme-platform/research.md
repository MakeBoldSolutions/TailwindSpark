# Research: Multi-Theme Design System Platform

## Decision 1: Theme activation model

**Decision**: Use `html[data-theme="theme-id"]` as the canonical named-theme switch and keep `.dark` as a derived compatibility flag for themes whose active mode is dark.

**Rationale**: The repository already depends on `.dark` for existing behavior, but `.dark` alone cannot represent multiple named themes. `data-theme` provides a stable selector for named theme overrides while preserving current dark-mode behavior during migration.

**Alternatives considered**:

- `data-theme` only: cleaner long term, but it would force immediate rewrites of existing `.dark` usage.
- `.dark` only: insufficient for multiple named themes.
- Per-component theme classes: increases cascade fragmentation and makes theme contracts harder to enforce.

## Decision 2: Token architecture

**Decision**: Layer tokens into reference tokens, semantic system aliases, theme override blocks, and component recipe tokens. Include motion, density, and typography tokens in the same contract as color, shape, and elevation.

**Rationale**: The current token system mixes raw palette values, semantic aliases, and Tailwind config literals. A layered model reduces drift, keeps themes additive, and lets components consume intent-driven values instead of palette-specific choices.

**Alternatives considered**:

- Flat token file: simpler initially but brittle as new themes and density modes are added.
- Component-only tokens without system aliases: duplicates logic across components.
- Full token rename during migration: high churn with little user value.

## Decision 3: Tailwind v4 integration strategy

**Decision**: Keep `packages/design-tokens/theme.css` and Tailwind v4 `@theme` as the canonical token source, and reduce `packages/design-tokens/tailwind.config.js` to compatibility mappings, plugins, and content scanning support.

**Rationale**: This aligns with the project constitution, Tailwind v4’s CSS-first model, and the existing semantic-token setup while removing duplicated JS literals that would otherwise drift from theme definitions.

**Alternatives considered**:

- Keep JS config as the primary source: preserves duplication and slows multi-theme scaling.
- Immediate CSS-only cutover: desirable eventually, but riskier while the app still depends on shared JS config reuse.

## Decision 4: Component standardization strategy

**Decision**: Standardize shared components and app surfaces around semantic recipes and slot-level component tokens while preserving existing DOM structure and public props where possible.

**Rationale**: Shared primitives such as `Button`, `Card`, `Form`, and `Modal` already provide reusable structure. The problem is that their variants still encode visual decisions directly. Recipe-level semantics let themes change presentation without requiring component rewrites.

**Alternatives considered**:

- Full headless rewrite: too expensive for the current repo.
- Global descendant-only styling: difficult to reason about and test.
- Leave app surfaces ad hoc: creates theme parity drift between shared and app-owned UI.

## Decision 5: Persistence and first-paint hydration

**Decision**: Add a small startup bootstrap that reads persisted theme data before React mounts, sets `data-theme`, applies or removes `.dark` as needed, and updates `color-scheme`. Make `ThemeProvider` initialize from the DOM state rather than deriving theme independently.

**Rationale**: The current theme provider applies theme state in a React effect, which is too late to guarantee the correct first paint once more than two themes are supported.

**Alternatives considered**:

- React-only initialization: simpler but produces wrong-theme flash.
- Delay rendering until theme is resolved: avoids flash but worsens startup UX.
- Server-coordinated theme state: unnecessary for a static SPA deployment.

## Decision 6: Contract and testing strategy

**Decision**: Define a required semantic token contract and validate it with automated checks, plus component/theme matrix tests for shared primitives and core app surfaces.

**Rationale**: Safe theme addition requires an explicit contract. The most valuable checks are token completeness, computed-style resolution, theme restoration behavior, and parity of shared components across all shipped themes.

**Alternatives considered**:

- Snapshotting raw class strings only: brittle and overly tied to implementation detail.
- Manual theme QA alone: too easy to miss missing tokens or parity regressions.
- Full visual regression on every page immediately: useful later, heavier than the contract checks needed first.

## Repository-Specific Risks

- Existing `.dark` and palette usage is still widespread across app pages, so rollout requires a compatibility phase rather than a clean cutover.
- Theme state is currently modeled as a boolean and passed through app props, so migrating to named themes will ripple through context consumers and tests.
- Many tests assert exact utility classes, which will create test churn even when user-visible behavior remains correct.
- Service worker caching can make theme asset rollouts appear inconsistent if CSS and JS are not updated coherently.