# Full Token Migration Notes

Date: 2025-09-07

This document captures the steps and outcomes of migrating Tailwind theme values to a centralized `@theme` token system under `packages/design-tokens/theme.css`.

## Goals

- Single source of truth for design tokens.
- Semantic aliases for easier theming.
- Remove duplicated color/font/radius config from per-package Tailwind configs.
- Enable dark mode via CSS variable overrides (no component changes).

## Implemented

1. Created `packages/design-tokens/theme.css` containing primitives + semantic aliases.
2. Added dark mode overrides inside `.dark` scope for semantic tokens.
3. Imported `theme.css` from `apps/demo-app/src/index.css` after `@import "tailwindcss";`.
4. Removed local experimental `@theme` block previously in `index.css`.
5. Left JS config values in place (non-breaking). Future step: prune `theme.extend` duplication once all utilities validated.

## Token Layers

- Primitive: `--color-primary-500`, `--radius-md`, etc.
- Semantic: `--color-brand`, `--color-surface`, `--color-text-muted`, etc.
- Interaction: `--ease-standard`, `--duration-fast`.

## Next Steps

- Replace hard-coded `indigo-*` utility usages with semantic classes (e.g. `bg-brand`, `text-brand`) by introducing mapping utilities if desired (requires class authoring or alias strategy).
- Generate TypeScript token exports for IDE autocomplete.
- Add lint rule to warn on raw hex usage in components.
- Audit for unused tokens quarterly.

## Rollback

Delete import line in `index.css` and remove `theme.css`; previous build will still work due to JS config.

Prepared automatically by Copilot.
