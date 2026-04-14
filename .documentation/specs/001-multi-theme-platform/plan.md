# Implementation Plan: Multi-Theme Design System Platform

**Branch**: `001-multi-theme-platform` | **Date**: 2026-04-13 | **Spec**: `c:\GitHub\MarkHazleton\TailwindSpark\.documentation\specs\001-multi-theme-platform\spec.md`
**Input**: Feature specification from `c:\GitHub\MarkHazleton\TailwindSpark\.documentation\specs\001-multi-theme-platform\spec.md`

## Summary

Evolve TailwindSpark from a semantic light/dark design system into a multi-theme platform that supports named design systems such as material, minimal, and brutalist, each with light and dark variants, without changing application structure or behavior. The implementation will keep CSS variables and Tailwind v4 `@theme` as the canonical token source, introduce named theme activation via `data-theme`, preserve `.dark` compatibility during migration, standardize shared components around semantic recipes, and add contract-driven validation so new themes can be introduced safely.

## Current Execution Status

- **Overall status**: In progress, with foundational platform work complete and the remaining work focused on route coverage, showcase parity, and final validation.
- **Token Foundation**: Complete. Theme layers, semantic aliases, component tokens, and Tailwind mappings for the shipped themes are implemented.
- **Theme Runtime**: Complete for the core runtime. Named theme selection, light/dark mode switching, persistence, legacy migration, and pre-React theme bootstrapping are implemented.
- **Rollout Resilience**: Implemented at runtime. Service-worker version signaling and stale-asset recovery hooks are in place, but post-deploy verification remains open.
- **Shared Component Migration**: Core primitives are migrated and documented. Button, Card, Form, and Modal consume semantic/component tokens and now have theme-matrix regression coverage.
- **Application Surface Migration**: Partially complete. Layout, branding, search, and content-driven cards are aligned; showcase, prompt/chat, and route-wide parity tasks are still open.
- **Verification**: Focused demo-app and ui-components validation succeeded, including new fallback tests, app-shell route smoke coverage, matrix tests, workspace lint/type-check, and root monorepo `lint`, `type-check`, and `test`. Post-deploy verification remains open.
- **Open task IDs**: T017, T018, T026, T027, T030, T031, T035.

## Technical Context

**Language/Version**: TypeScript 6, React 19, modern CSS, Tailwind CSS 4.2  
**Primary Dependencies**: Vite 8, React Router 7, Tailwind CSS 4, `@tailwindspark/design-tokens`, `@tailwindspark/ui-components`, clsx, lucide-react  
**Storage**: Browser `localStorage` for theme preference with backward-compatible migration from legacy `theme=light|dark`; DOM attributes and classes on the root element for active theme state  
**Testing**: Vitest 4, Testing Library, co-located component tests, workspace lint and type-check commands  
**Target Platform**: Browser-based SPA deployed via GitHub Pages with service worker caching on modern desktop and mobile browsers  
**Project Type**: Monorepo web application with shared design-token and UI-component packages  
**Performance Goals**: Theme changes must apply within the current session without blocking interaction; first paint should use the correct persisted theme to avoid visible wrong-theme flash; existing route-level lazy loading and content interactions must remain unchanged  
**Constraints**: Preserve HTML structure and application logic, avoid per-theme component forks, require light and dark support for every shipped theme, keep `.dark` compatibility during migration, migrate existing persisted preferences safely, keep service-worker cache rollouts coherent, keep standard build commands free of tracked-source side effects, maintain semantic token compliance, preserve accessibility and focus states across all themes  
**Scale/Scope**: Repository-wide rollout across `packages/design-tokens`, `packages/ui-components`, and `apps/demo-app`, covering global layout, shared controls, navigation, lists, cards, form surfaces, and prompt or chat experiences

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate Status: PASS

- **Type Safety**: Planned changes remain in strict TypeScript packages and app code. Any new exported APIs in theme utilities or context updates must include explicit typings and return types.
- **Testing Standards**: Plan includes component matrix tests, theme persistence tests, and parity coverage for core surfaces. Existing co-located Vitest patterns remain the standard.
- **Design System & Semantic Tokens**: Plan strengthens compliance by moving more visual decisions into semantic CSS variables and `@theme` definitions. Raw palette usage will be reduced rather than expanded.
- **Accessibility Standards**: Theme rollout explicitly preserves readable text, visible focus indicators, keyboard support, and contrast across all shipped themes.
- **Documentation Standards**: Any exported theme utilities, context contracts, or shared component APIs introduced during implementation must add or update JSDoc.
- **Code Quality & Formatting**: Plan does not require exceptions to ESLint, Prettier, or the custom semantic-token rule.
- **Monorepo Architecture**: Work stays within existing package boundaries: token definitions in `packages/design-tokens`, reusable primitives in `packages/ui-components`, app integration in `apps/demo-app`.
- **CI/CD & Automation**: Validation will use existing workspace commands and must not add hidden build side effects.
- **Source and Build Artifact Separation**: Theme assets remain maintained source files; no standard build step will generate tracked theme artifacts.

### Post-Design Gate Status: PASS

- Research and design artifacts keep the canonical token source in maintained CSS and package source files.
- No constitution violation or unjustified complexity was introduced by the planned architecture.
- The migration path explicitly preserves semantic-token governance while reducing hardcoded visual duplication.

## Project Structure

### Documentation (this feature)

```text
.documentation/specs/001-multi-theme-platform/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── theme-platform-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
└── demo-app/
    ├── index.html
    ├── tailwind.config.js
    └── src/
        ├── App.tsx
        ├── index.css
        ├── main.tsx
        ├── components/
        ├── contexts/
        ├── hooks/
        ├── pages/
        ├── sections/
        ├── services/
        ├── test/
        ├── types/
        └── utils/

packages/
├── design-tokens/
│   ├── theme.css
│   ├── tailwind.config.js
│   └── tokens/
└── ui-components/
    └── src/
        ├── index.ts
        ├── components/
        │   ├── Button.tsx
        │   ├── Card.tsx
        │   ├── Form.tsx
        │   └── Modal.tsx
        └── test/
```

**Structure Decision**: Use the existing monorepo split. The theme platform contract and token hierarchy live in `packages/design-tokens`, shared component recipe migration lives in `packages/ui-components`, and the application-level activation, persistence, and selector integration live in `apps/demo-app`.

## Phase 0: Research Outcomes

Research is captured in `research.md` and resolves the key architecture decisions required for implementation:

1. Use `html[data-theme="<theme-id>"]` as the canonical named-theme switch.
2. Retain `.dark` as a derived compatibility signal for dark variants during migration and ongoing theme support.
3. Introduce layered tokens: reference, semantic, theme override, and component recipe tokens.
4. Keep `theme.css` plus Tailwind v4 `@theme` as the canonical token source and reduce duplicated JS literals in Tailwind config.
5. Migrate shared components to semantic recipes and slot-level token consumption rather than direct visual mappings.
6. Add a pre-React bootstrap path so persisted theme state is applied before first paint, including migration from legacy persisted values.
7. Validate theme parity through token-contract checks, component/theme matrix tests, and route-level smoke coverage.
8. Add service-worker cache versioning and stale asset recovery behavior so rollout remains coherent after deployment.

## Phase 1: Design & Contracts

### Data Model

The conceptual model is documented in `data-model.md` and centers on:

- `ThemeProfile` for each named theme.
- `ThemeModeProfile` for light or dark variants within a theme.
- `ThemePreference` for persisted user selection.
- `TokenContract` for required semantic tokens and component recipes.
- `ThemeableSurface` for reusable UI areas that consume the shared contract.

### Contract Strategy

The platform contract is documented in `contracts/theme-platform-contract.md` and defines:

- The root DOM contract for `data-theme`, `.dark`, and `color-scheme`.
- The required token categories every theme must provide.
- The compatibility rules for shared components and app surfaces.
- The validation expectations for safe theme addition.

### Quickstart Strategy

`quickstart.md` defines the implementation and validation path for developers, including repo commands, expected files to touch, and the manual checks needed to verify theme parity.

## Phase 2: Implementation Strategy

### Workstreams

1. **Token Foundation**
   - Restructure `packages/design-tokens/theme.css` into layered reference, semantic, theme, and component tokens.
   - Introduce named theme blocks for material, minimal, and brutalist with both light and dark variants.
   - Align `packages/design-tokens/tailwind.config.js` and app-level Tailwind config with CSS-variable-driven utilities.

2. **Theme Runtime**
   - Replace boolean-only dark mode state in `apps/demo-app/src/contexts/ThemeContext.tsx` with a named theme-and-mode model that can still expose compatibility helpers.
   - Add early bootstrap logic in `apps/demo-app/index.html` or equivalent startup path so the persisted theme is applied before React hydration.
   - Provide a theme selector utility, dark-mode handling for every shipped theme, shared persistence helpers, and explicit migration from legacy stored values.

3. **Rollout Resilience**
   - Update the service worker and startup integration so updated theme assets do not leave the application in a mixed old/new cache state after deployment.
   - Add stale-asset recovery and deployment verification for service-worker-managed clients.

4. **Shared Component Migration**
   - Refactor high-value shared primitives such as `Button`, `Card`, `Form`, and `Modal` to use semantic recipes and component tokens.
   - Preserve public component structure and props where possible, expanding only where the platform contract requires named appearance variants.

5. **Application Surface Migration**
   - Migrate layout, navigation, lists, and prompt or chat surfaces away from residual palette-specific or dark-mode-specific assumptions.
   - Ensure project lists, article lists, weather, joke, repository, prompt/chat flows, and route-level pages such as dashboard, analytics, marketing, ecommerce, settings, users, about, apps hub, demos, home, and design system retain behavior across all themes and modes.

6. **Verification and Regression Control**
   - Add token presence tests and theme restoration tests.
   - Update component tests that currently assert exact classes so they validate semantic behavior and compatibility across themes and modes.
   - Add route-level smoke validation for representative page classes and mini-app flows.
   - Confirm lint, type-check, and test coverage remain compliant with repository standards.

7. **Documentation Delivery**
   - Distribute JSDoc work across foundational, runtime, registry, and shared-component tasks instead of leaving it as a single end-of-project cleanup item.

### Migration Order

1. Token contract and theme registry with light/dark theme modes
2. Runtime activation, persistence bootstrap, and legacy preference migration
3. Service-worker rollout resilience and stale asset recovery
4. Shared UI component recipes
5. App-level layout and full route-surface cleanup
6. Theme parity tests, route smoke validation, and distributed documentation updates

### Risks and Mitigations

- **Risk**: Existing `.dark` and raw utility usage across app pages creates migration churn.
  **Mitigation**: Keep `.dark` as a compatibility layer and prioritize shared semantic recipes before app-wide cleanup.
- **Risk**: Existing persisted `theme=light|dark` values can conflict with the new theme-and-mode state model.
   **Mitigation**: Add explicit migration logic in bootstrap and restore paths, plus dedicated tests for upgraded users.
- **Risk**: Current tests assert exact classes and will become brittle during migration.
  **Mitigation**: Shift tests toward semantic outputs, accessibility behavior, and per-theme rendering expectations.
- **Risk**: First-paint theme mismatch due to React-only initialization.
  **Mitigation**: Apply persisted theme in a startup bootstrap before React mounts.
- **Risk**: Service worker caching can make theme rollouts appear inconsistent.
   **Mitigation**: Treat theme CSS and startup logic as coordinated assets, version the service-worker cache explicitly, and verify stale-cache recovery during rollout.

## Complexity Tracking

No constitution exceptions or complexity waivers are required for this plan.
