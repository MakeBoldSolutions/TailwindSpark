# Data Model: GitHub Repositories Explorer

**Date**: 2026-04-09 | **Branch**: `001-github-repos-explorer`

## Entities

### Repository (primary entity)

The central entity representing a single GitHub repository with rich metadata.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| name | string | yes | Repository name (unique identifier) |
| description | string or null | no | User-provided repository description |
| url | string | yes | GitHub repository URL |
| homepage | string or null | no | Project homepage URL |
| has_pages | boolean | yes | Whether GitHub Pages is enabled |
| pages_url | string or null | no | GitHub Pages URL |
| website_url | string or null | no | Resolved website URL |
| stars | number | yes | Star count |
| forks | number | yes | Fork count |
| watchers | number | yes | Watcher count |
| language | string or null | no | Primary programming language |
| languages | object | yes | Language breakdown (name to bytes) |
| language_count | number | yes | Number of languages used |
| created_at | string (ISO 8601) | yes | Repository creation date |
| updated_at | string (ISO 8601) | yes | Last update date |
| pushed_at | string (ISO 8601) | yes | Last push date |
| total_commits | number | yes | Total commit count |
| recent_commits_90d | number | yes | Commits in last 90 days |
| size_kb | number | yes | Repository size in KB |
| is_fork | boolean | yes | Whether repo is a fork |
| is_private | boolean | yes | Whether repo is private |
| is_archived | boolean | yes | Whether repo is archived |
| age_days | number | yes | Age in days since creation |
| days_since_last_push | number | yes | Days since last push |
| rank | number | yes | Overall ranking position |
| composite_score | number | yes | Computed quality/activity score |
| has_readme | boolean | yes | Whether README exists |
| has_license | boolean | yes | Whether license exists |
| has_ci_cd | boolean | yes | Whether CI/CD is configured |
| has_tests | boolean | yes | Whether tests exist |
| has_docs | boolean | yes | Whether documentation exists |
| bus_factor | number | yes | Bus factor count |
| bus_factor_health | string | yes | Bus factor health label |
| total_additions | number | yes | Total lines added |
| total_deletions | number | yes | Total lines deleted |
| code_churn | number | yes | Total code churn |
| attention_rank | number | yes | Attention priority ranking |

### Summary (nested in Repository)

AI-generated description for the repository.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| text | string | yes | Summary content |
| ai_generated | boolean | yes | Whether AI-generated |
| generation_method | string | yes | Method used for generation |
| generated_at | string (ISO 8601) | yes | Generation timestamp |
| model_used | string or null | no | AI model identifier |
| confidence_score | number | yes | Confidence level (0-100) |

### CommitHistory (nested in Repository)

Activity data across time windows.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| total_commits | number | yes | Total commits |
| recent_90d | number | yes | Commits in last 90 days |
| recent_180d | number | yes | Commits in last 180 days |
| recent_365d | number | yes | Commits in last 365 days |
| last_commit_date | string (ISO 8601) | yes | Most recent commit date |
| first_commit_date | string (ISO 8601) | yes | Earliest commit date |
| patterns | string[] | yes | Activity pattern labels |
| commit_frequency | number | yes | Average commits per day |
| consistency_score | number | yes | Consistency metric (0-100) |
| activity_rate | number | yes | Activity rate metric |
| days_since_last_commit | number | yes | Recency indicator |

### AttentionMetrics (nested in Repository)

Health and maintenance priority indicators.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| score | number | yes | Overall attention score |
| tier | string | yes | Priority tier label |
| needs_attention | boolean | yes | Whether action is needed |
| reasons | string[] | yes | Reasons for attention need |
| components.pull_requests | object | yes | PR backlog metrics |
| components.security | object | yes | Security alert metrics |
| components.staleness | object | yes | Activity staleness metrics |
| components.dependencies | object | yes | Dependency health metrics |

### TechStack (nested in Repository, optional)

Dependency and framework information.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| languages | object | no | Language breakdown |
| frameworks | string[] | no | Detected frameworks |
| dependencies | array | no | Dependency list with versions |
| total_dependencies | number | no | Total dependency count |
| outdated_count | number | no | Outdated dependency count |
| currency_score | number | no | Dependency freshness score |
| primary_language | string or null | no | Primary language |

### ContributorStats (nested array in Repository)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| login | string | yes | GitHub username |
| commits | number | yes | Commit count |
| additions | number | yes | Lines added |
| deletions | number | yes | Lines deleted |

### Screenshot (nested in Repository, optional)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| path | string | yes | File path |
| url | string | yes | Public URL |
| captured_at | string (ISO 8601) | yes | Capture timestamp |
| width | number | yes | Image width |
| height | number | yes | Image height |

## Derived/Computed Data

### PortfolioSummary (computed at render time)

Aggregated from all Repository entities. Not stored — computed via `useMemo`.

| Field | Computation |
| ----- | ----------- |
| totalRepos | Count of all repositories |
| totalCommits | Sum of all total_commits |
| totalStars | Sum of all stars |
| totalForks | Sum of all forks |
| languageDistribution | Map of language to repo count, sorted descending |
| activeCount | Count where days_since_last_push < 90 and not archived |
| staleCount | Count where days_since_last_push >= 90 and not archived |
| archivedCount | Count where is_archived is true |

## Relationships

- Repository 1:1 Summary (always present)
- Repository 1:1 CommitHistory (always present)
- Repository 1:1 AttentionMetrics (always present)
- Repository 1:0..1 TechStack (nullable)
- Repository 1:N ContributorStats (array, at least 1)
- Repository 1:0..1 Screenshot (nullable)
- PortfolioSummary is derived from N Repositories (not persisted)

## Filter State Model

Client-side filter state driving the displayed repository list.

| Field | Type | Default |
| ----- | ---- | ------- |
| searchQuery | string | "" |
| languageFilter | string or null | null (all languages) |
| statusFilter | "all" or "active" or "stale" or "archived" | "all" |
| sortBy | enum (see below) | "composite_score" |
| sortDirection | "asc" or "desc" | "desc" |

Sort options: `composite_score`, `stars`, `forks`, `total_commits`, `recent_commits_90d`, `age_days`, `name`
