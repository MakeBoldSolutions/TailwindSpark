# PR 94 Remediation Plan

## Scope

Address all currently active findings from [.documentation/specs/pr-review/pr-94.md](c:/GitHub/MarkHazleton/TailwindSpark/.documentation/specs/pr-review/pr-94.md):

- C1: Convert `AboutPage` to the constitution-required `React.FC` pattern with an explicit return type.
- C2: Convert all new route-entry pages to the same required typing pattern.
- H1: Remove the shared `src/test/accessibility.test.tsx` harness and move accessibility assertions into co-located test files.
- M1: Update the demo-app README so the documented structure matches the constitution-compliant test layout.

## Parallel Workstreams

### Workstream A: Route Page Type-Safety Fixes

These changes are independent and can be done in parallel across files because they only affect local component declarations.

Files:

- `apps/demo-app/src/pages/AboutPage.tsx`
- `apps/demo-app/src/pages/AppsHubPage.tsx`
- `apps/demo-app/src/pages/NotFoundPage.tsx`
- `apps/demo-app/src/pages/apps/AIChatPage.tsx`
- `apps/demo-app/src/pages/apps/ArticlesPage.tsx`
- `apps/demo-app/src/pages/apps/JokePage.tsx`
- `apps/demo-app/src/pages/apps/ProjectsPage.tsx`
- `apps/demo-app/src/pages/apps/WeatherPage.tsx`

Required change pattern:

```tsx
import type { FC } from 'react';

export const ExamplePage: FC = (): React.JSX.Element => {
  // existing component body
};

export default ExamplePage;
```

Implementation notes:

- Preserve existing default exports and routing API.
- Prefer `import { useEffect } from 'react'` plus `import type { FC } from 'react'` if needed to avoid runtime import churn.
- Keep existing JSDoc blocks and align `@returns` text with the new declaration.
- Confirm no page relies on function hoisting before converting declarations.

Acceptance criteria:

- No page component in `apps/demo-app/src/pages/**` is exported as a plain untyped function.
- All touched page exports satisfy Constitution Principle I.
- `npm run lint --workspace apps/demo-app` passes.
- `npm run build --workspace apps/demo-app` passes.

### Workstream B: Accessibility Test Co-Location

This work can proceed in parallel with Workstream A because it only touches test placement and test imports.

Current non-compliant file:

- `apps/demo-app/src/test/accessibility.test.tsx`

Target approach:

- Move app-shell accessibility coverage into an existing co-located file such as `apps/demo-app/src/App.test.tsx`.
- Move mini-app accessibility assertions into the existing page tests:
  - `apps/demo-app/src/pages/AppsHubPage.test.tsx`
  - `apps/demo-app/src/pages/AboutPage.test.tsx` if About coverage exists or needs addition
  - `apps/demo-app/src/pages/apps/AIChatPage.test.tsx`
  - `apps/demo-app/src/pages/apps/ArticlesPage.test.tsx`
  - `apps/demo-app/src/pages/apps/JokePage.test.tsx`
  - `apps/demo-app/src/pages/apps/ProjectsPage.test.tsx`
  - `apps/demo-app/src/pages/apps/WeatherPage.test.tsx`

Execution strategy:

1. Read each existing page test and identify the minimal shared test helpers already in use.
2. Copy only the relevant `axe` checks into the corresponding co-located file.
3. Extract any repeated mock setup into a local helper module only if duplication becomes materially worse.
4. Delete `apps/demo-app/src/test/accessibility.test.tsx` after its coverage is redistributed.

Acceptance criteria:

- No test files remain under `apps/demo-app/src/test/` unless the constitution is amended separately.
- Accessibility assertions are co-located with the app shell and page entrypoints they validate.
- `npm test -- --runInBand` or the project-equivalent targeted Vitest command passes for the moved suites.
- Coverage stays at or above the constitution baseline.

### Workstream C: Documentation Alignment

This work depends on Workstream B because the README should describe the final test structure, not the current exception.

Files:

- `apps/demo-app/README.md`

Required change:

- Remove the `src/test/` entry from the project structure once the shared harness is deleted.
- If accessibility coverage is redistributed into existing page tests, document that pattern in one sentence under testing or structure notes.

Acceptance criteria:

- README structure matches the actual on-disk layout.
- README does not document a constitution-noncompliant test location.

## Recommended Execution Order

1. Start Workstream A and Workstream B in parallel.
2. Land page typing conversions first if a fast, low-risk win is needed.
3. Finish test redistribution and delete `src/test/accessibility.test.tsx`.
4. Update README last so it reflects the final state rather than the transition.
5. Re-run lint, targeted tests, and build.
6. Re-run `/speckit.pr-review #94` to refresh the constitution review.

## Concrete Task Breakdown

### Task Group 1: Type-Safety Pages

- Convert `AboutPage` to a typed `React.FC` export.
- Convert `AppsHubPage` and `NotFoundPage` to typed `React.FC` exports.
- Convert the five mini-app route pages to typed `React.FC` exports.
- Verify imports remain clean and lint-compliant.

### Task Group 2: Accessibility Test Migration

- Inspect the assertions currently covering `App`, `AIChatPage`, `ArticlesPage`, `JokePage`, `ProjectsPage`, and `WeatherPage`.
- Merge each assertion set into the matching co-located test file.
- Add About or Apps hub accessibility coverage only if the shared file currently covers them and no equivalent local check exists.
- Remove the obsolete shared accessibility file.

### Task Group 3: Docs and Validation

- Update the demo-app README structure section.
- Run lint.
- Run targeted Vitest suites for affected files.
- Run the demo-app build.
- Refresh the PR review document.

## Risks

- Converting to `FC` imports may conflict with current ESLint preferences if imports are not split into value and type-only forms.
- Moving `axe` tests may expose duplicated mock setup across page suites; keep helper extraction minimal unless repetition becomes unmanageable.
- If any route test is slow or brittle, prefer redistributing only the coverage that currently exists instead of broadening scope.

## Definition of Done

- C1 and C2 are resolved by code changes in all flagged page files.
- H1 is resolved by removing the centralized accessibility test file and co-locating its coverage.
- M1 is resolved by updating the README to match the final layout.
- Lint and build pass.
- The refreshed review for PR 94 no longer reports these findings.