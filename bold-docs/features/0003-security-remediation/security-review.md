# CodeQL alert review

> **TL;DR for the Product Owner**: Alerts #89–#91 describe intentional JSON ingestion into fixed files. Download limits, continuity, and browser URL validation are strengthened and regression-tested; the remaining network-to-file flow is expected.

## Findings and disposition

CodeQL's `js/http-to-file-access` query has medium precision and asks reviewers to
examine whether the highlighted download/write is intended:
https://codeql.github.com/codeql-query-help/javascript/js-http-to-file-access/.

- #89: `scripts/sync-articles-data.mjs` fetches the fixed HTTPS article feed, validates an array of article objects and required fields, normalizes optional links with an HTTP(S) allowlist, and serializes JSON to the fixed articles.json destination. Unknown fields are dropped. No remote value chooses a path. Failed refresh now preserves the previous snapshot.
- #90: `scripts/sync-projects-data.mjs` accepts the documented legacy/subsite structures, validates required fields and HTTP(S) project links, creates normalized objects, and serializes to the fixed projects.json destination. A failed refresh preserves the previous snapshot.
- #91: `scripts/sync-repos-data.mjs` requires a repository array and validates required repository fields, builds an allowlisted object, and serializes to the fixed repositories.json destination. HTTP(S) checks now cover repository, homepage, Pages, website, and screenshot links. A failed refresh preserves the previous snapshot.

All feeds now share a typed downloader with a 10-second timeout, redirect rejection,
streamed byte limits, cancellation on failure, and HTTP-status checks. The previous
CodeQL-looking comments are removed: converting strings does not remove taint, and
these annotations did not establish a valid security boundary.

Browser consumers parse JSON through Zod schemas. ArticleCard/ProjectCard/RepoDetail
render text through React; repository summaries use SafeMarkdown, which excludes
raw HTML and filters link protocols. Snapshots are data, never imported or evaluated
as JavaScript. Fixed JSON files and normalized structures prevent arbitrary upload
or executable payload installation. URL validation complements this boundary rather
than assuming that JSON serialization alone makes browser links safe.

Final disposition: the main-branch CodeQL scan after PR #236 marked alerts #89, #90, and #91 **fixed** at 2026-10-12T02:36:25Z. GitHub reports zero open code scanning alerts. The query and script paths remain enabled. Per-alert dismissal was considered during review, but no dismissal was applied; the final state is established by the completed scan.

## Evidence

`scripts/snapshot-download.test.ts` exercises UTF-8 chunk boundaries, byte limits,
misleading Content-Length, cancellation, HTTP errors, absent bodies, interrupted
streams, timeout propagation, and unsafe URL protocols. `scripts/sync-data.test.ts`
executes all three ingestion scripts in isolated temporary directories against valid,
malformed, invalid-schema, unsafe-link, oversized, and failed-network responses.
Rejected responses must leave the original snapshot byte-for-byte unchanged.
