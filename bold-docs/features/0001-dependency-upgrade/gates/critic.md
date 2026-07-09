# Critic — 0001-dependency-upgrade

> **TL;DR for the Product Owner**
> *What*: Adversarial risk pass over the ratified spec — what could actually fail in production from this upgrade.
> *Why*: Required pre-flight gate for Feature-tier work before `bold.build` executes.
> *Status*: 0 blockers, 3 notes. Safe to proceed to build with the notes acknowledged.
> *Decision needed*: None — all three notes are addressed by adjusting build execution order, not the spec.

## Evaluated categories

- **Trust boundaries / auth**: inapplicable — no auth surface touched.
- **Secrets handling**: inapplicable — no secrets touched by any task.
- **Data loss / continuity**: inapplicable — `package-lock.json` regeneration is fully reversible via git; no destructive operation.
- **Input validation**: inapplicable — no untrusted input in scope.
- **Error handling / resilience**: overlaps analyze's F002 (the non-blocking `npm audit` step) — cross-referenced there, not duplicated here.
- **Concurrency**: inapplicable — no concurrent execution introduced.
- **Scale bottlenecks**: inapplicable.
- **Observability**: inapplicable — TypeScript is erased at compile time; a clean type-check pass gives no new runtime failure surface beyond what test/build already catch.
- **Deployment / rollback**: real, see N001.
- **Dependency supply chain**: real, see N002.
- **Backward compatibility**: real, see N003.
- **Regulatory / privacy**: inapplicable — no PII in scope.

## Findings

**N001 — Deployment pipeline note** (not a blocker)
`deploy.yml`'s `build` job runs on both `pull_request` and `push to main` triggers with the *identical* job definition (`.github/workflows/deploy.yml:3-7`). That means AC9 ("CI passes on the PR before merge") is representative of what runs on merge — there's no separate main-only step that could newly fail after merge. Low risk, but worth naming: T011 must confirm the PR run is green, not just started.

**N002 — Dependency supply chain note** (not a blocker)
This bumps ~19 packages to `latest` on trust in upstream registries. `npm audit` already reports 0 vulnerabilities and every package name in the spec's table is a well-known canonical package (no typosquat-shaped names). Recommend a quick sanity check before merging: none of the target versions (especially `typescript@7.0.2`, the highest-blast-radius bump) should be hours-old at merge time — a very recent publish is the one signal `npm audit` can't catch (supply-chain/account-compromise pattern). Not blocking; a build-time check, not a spec change.

**N003 — Backward compatibility / achievability note** — **materialized.**
The spec ratified "adopt TypeScript 7 now, fall back to `^6.0.x` if unfixable" — a real, workable escape hatch, and it was needed: `bold.build` ran an isolated TS-7-only spike first (per this note's recommendation), which found `tsc --noEmit` passes clean but `npm run lint` hard-fails, because `typescript-eslint@8.63.0`'s `peerDependencies` caps at `typescript: '>=4.8.4 <6.1.0'` — no stable release supports TS 7. Fallback invoked before any other task assumed 7.x had succeeded, exactly as recommended. Final state: TypeScript 6.0.3 everywhere, all gates green.

No blockers. No backbone-principle violations found (backbone-principle violations are automatic blockers per this gate's severity rule) — principles 1, 2, 6, 8, 9 are all addressed by an Acceptance Criterion in the spec, and none are contradicted.
