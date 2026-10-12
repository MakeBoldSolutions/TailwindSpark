# Risk critique

> **TL;DR for the Product Owner**: Security, continuity, and dependency risks have explicit validation and delivery controls.

- Trust boundaries/auth: Remote JSON is untrusted; fixed destinations, schema normalization, and consumer review required by AC3. No permission bypasses.
- Secrets handling: No new credentials; use existing authenticated GitHub tooling. No secret values in reports.
- Data continuity: AC3 preserves existing snapshots on refresh failure; rollback is a revert.
- Input validation: AC3 requires bounded downloads and malformed-input tests; intentional writes require evidence before dismissal.
- Error handling/resilience: AC3 sets a 10-second timeout and preserves current snapshots.
- Concurrency: Sync commands are sequential; CI and local builds use separate environments. No new shared-state concurrency.
- Scale: Download byte bounds prevent unbounded response buffering.
- Observability: Audit, CI, and final alert-state verification are explicit in AC2/AC5.
- Deployment/rollback: CI precedes merge; revert provides rollback. No migrations.
- Dependency supply chain: Review requested changes, align related packages, use lockfile and clean install; no blind force fix.
- Backward compatibility: AC4 requires type, component, and production build validation.
- Regulatory/privacy: Inapplicable; no new data collection or retention policy.

No open blockers. Residual note: upstream alert recalculation may lag merge; report verified state and any remaining alerts honestly.
