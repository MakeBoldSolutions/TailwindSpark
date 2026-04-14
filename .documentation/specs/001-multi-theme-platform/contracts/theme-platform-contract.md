# Contract: Theme Platform

## Purpose

Define the required interface for theme activation, persistence, token coverage, and shared-surface compatibility so the repository can add or change themes without rewriting components.

## 1. Root DOM Contract

- The root document element is the canonical theme host.
- The active named theme is exposed via `data-theme="<theme-id>"` on the root element.
- A `.dark` class may be applied to the root element when the active theme mode requires dark-compatible behavior.
- The root element must expose the correct `color-scheme` hint for the active theme mode.
- Theme activation must be idempotent: applying the same theme repeatedly must not produce cumulative DOM drift.

## 2. Persistence Contract

- Theme preference is persisted per browser context.
- A persisted preference must include enough information to restore the active named theme and its effective mode.
- Invalid or missing preferences must fall back to the default theme without blocking application startup.

## 3. Required Token Categories

Every shipped theme must provide the following semantic categories, either directly or through baseline fallback values:

- Color semantics for primary action, secondary action, surface, background, text, muted text, border, focus indication, and status feedback.
- Typography semantics for primary font family, secondary or display family when applicable, font scale, line height, and weight rhythm.
- Spacing semantics for shared spacing scale and density-sensitive layout rhythm.
- Shape semantics for corner radius and edge treatment.
- Elevation semantics for raised, default, and flat surfaces.
- Motion semantics for transition duration, easing, and intensity.
- Layout semantics for compact, default, or spacious density modes.
- Component semantics for buttons, cards, form fields, navigation items, overlays, lists, and prompt or chat surfaces.

## 4. Shared Component Compatibility Contract

- Shared components must consume semantic recipes or component tokens rather than raw palette utilities.
- Existing component structure and public props should remain stable unless a new theme requirement cannot be expressed without a contract extension.
- A new theme must not require duplicate component implementations.
- Components must preserve keyboard support, focus visibility, and readable content hierarchy in every shipped theme.

## 5. Application Surface Contract

- Global layout, navigation, content lists, cards, form areas, and prompt or chat surfaces must render through the shared token contract.
- Theme changes must affect presentation only and must not change routes, data loading behavior, or feature availability.
- Theme changes must remain consistent across route transitions and asynchronous content updates.

## 6. Validation Contract

- Every shipped theme must satisfy the full token contract before it is made selectable.
- Theme restoration behavior must be verified for first load and repeat visits.
- Shared components must be tested in a theme matrix covering all shipped themes.
- Core application surfaces must be verified for readable text, visible focus states, and interaction continuity across all shipped themes.

## 7. Theme Addition Rules

- A new theme may be added by creating a new theme definition that satisfies this contract.
- Adding a new theme must not require structural HTML changes to existing pages or component duplication.
- Any required contract extension for new themes must be documented here before implementation proceeds.