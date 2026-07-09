# Implementation Gaps

> **TL;DR for the Product Owner**
> *What*: Known gaps against the coding standards, carried forward from the DevSpark constitution as of migration.
> *Why*: These were tracked as active technical debt before migration — they don't go away just because the tooling changed.
> *Status*: Current as of migration; re-verify before treating as up to date.
> *Decision needed*: none.

## Critical gaps (must implement)

1. **JSDoc documentation coverage** (backbone principle 5) — ~5% of files had JSDoc (4 of 74) against a 100%-of-exports target. Action: add JSDoc to all exports in `packages/ui-components/src/` and `apps/demo-app/src/`.
2. **Coverage threshold maturity** (backbone principle 2) — 40% minimum coverage is enforced; re-evaluate raising it in a future pass once legacy coverage expands.

## Recommended improvements

1. **Input validation library** — no Zod/Yup/equivalent detected; consider Zod for runtime validation and form schemas.
2. **Structured logging** — currently plain `console.warn`/`console.error`; consider structured logging for production.
3. **API mocking for integration tests** — no MSW or equivalent found; consider Mock Service Worker.
4. **Import order enforcement** — no enforced import-sorting standard; consider an ESLint import-sorting plugin.
