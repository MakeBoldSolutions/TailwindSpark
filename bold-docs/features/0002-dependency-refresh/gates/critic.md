# Critic Gate — Dependency Refresh

> **TL;DR for the Product Owner**
> _What_: Reviewed production risks in the dependency refresh plan.
> _Why_: Dependency updates can break builds, weaken supply-chain posture, or silently change runtime support.
> _Status_: Pass — risks are mitigated or explicitly deferred.
> _Decision needed_: None.

## Findings

No blocker findings.

## Risk Review

- **Trust boundaries / auth**: Not applicable; no auth or authorization behavior changes.
- **Secrets handling**: Not applicable; no secrets or environment variables added.
- **Data loss / continuity**: Not applicable; no persistent data or migrations touched.
- **Input validation**: Not applicable; no request parsing or user-input validation flow changed.
- **Error handling / resilience**: No blocker. Dependency-induced runtime issues are gated by lint, type-check, coverage, and build.
- **Concurrency**: Not applicable; no concurrent runtime behavior changed.
- **Scale bottlenecks**: Not applicable; no query/data access path changed.
- **Observability**: No blocker. This is build/dependency maintenance and is covered by local gates plus existing CI.
- **Deployment / rollback**: No blocker. Changes are package manifests, lockfile, and Vite config compatibility; rollback is a normal git revert.
- **Dependency supply chain**: No blocker. `npm audit --audit-level moderate` passes with 0 vulnerabilities; TypeScript 7 is adopted after replacing `typescript-eslint` with Oxlint and `oxlint-tsgolint`.
- **Backward compatibility**: No blocker. The repo deliberately raises Node support to 26 so current npm and jsdom releases are within their engine contracts.
- **Regulatory / privacy**: Not applicable; no PII handling changes.
