/**
 * Repositories API Contract
 *
 * TypeScript types and Zod schemas for GitHub repositories data.
 * Source: github-stats-spark repositories.json (schema v2.2.0)
 */

import { z } from 'zod';

// --- Nested Schemas ---

const DEFAULT_COMMIT_SIZE = {
  sha: '',
  date: '',
  size: 0,
  files_changed: 0,
  lines_added: 0,
  lines_deleted: 0,
} as const;

const DEFAULT_COMMIT_SIZE_DISTRIBUTION = {
  min: 0,
  q1: 0,
  median: 0,
  q3: 0,
  max: 0,
} as const;

const DEFAULT_COMMIT_METRICS = {
  avg_size: 0,
  total_commits: 0,
  largest_commit: DEFAULT_COMMIT_SIZE,
  smallest_commit: DEFAULT_COMMIT_SIZE,
  commit_size_distribution: DEFAULT_COMMIT_SIZE_DISTRIBUTION,
} as const;

const SummarySchema = z
  .object({
    text: z.string(),
    ai_generated: z.boolean(),
    generation_method: z.string(),
    generated_at: z.string(),
    model_used: z.string().nullable(),
    tokens_used: z.number().optional(),
    confidence_score: z.number(),
  })
  .passthrough();

const CommitSizeSchema = z
  .object({
    sha: z.string().default(DEFAULT_COMMIT_SIZE.sha),
    date: z.string().default(DEFAULT_COMMIT_SIZE.date),
    size: z.number().default(DEFAULT_COMMIT_SIZE.size),
    files_changed: z.number().default(DEFAULT_COMMIT_SIZE.files_changed),
    lines_added: z.number().default(DEFAULT_COMMIT_SIZE.lines_added),
    lines_deleted: z.number().default(DEFAULT_COMMIT_SIZE.lines_deleted),
  })
  .passthrough();

const CommitHistorySchema = z
  .object({
    repository_name: z.string(),
    total_commits: z.number(),
    recent_90d: z.number(),
    recent_180d: z.number(),
    recent_365d: z.number(),
    last_commit_date: z.string(),
    first_commit_date: z.string(),
    patterns: z.array(z.string()),
    commit_frequency: z.number(),
    consistency_score: z.number(),
    activity_rate: z.number(),
    days_since_last_commit: z.number(),
  })
  .passthrough();

const CommitMetricsSchema = z
  .object({
    avg_size: z.number().default(0),
    total_commits: z.number().default(0),
    largest_commit: CommitSizeSchema.default(DEFAULT_COMMIT_SIZE),
    smallest_commit: CommitSizeSchema.default(DEFAULT_COMMIT_SIZE),
    commit_size_distribution: z
      .object({
        min: z.number().default(DEFAULT_COMMIT_SIZE_DISTRIBUTION.min),
        q1: z.number().default(DEFAULT_COMMIT_SIZE_DISTRIBUTION.q1),
        median: z.number().default(DEFAULT_COMMIT_SIZE_DISTRIBUTION.median),
        q3: z.number().default(DEFAULT_COMMIT_SIZE_DISTRIBUTION.q3),
        max: z.number().default(DEFAULT_COMMIT_SIZE_DISTRIBUTION.max),
      })
      .passthrough()
      .default(DEFAULT_COMMIT_SIZE_DISTRIBUTION),
  })
  .passthrough();

const AlertCountsSchema = z
  .object({
    total_open: z.number(),
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
  })
  .passthrough();

const AttentionMetricsSchema = z
  .object({
    score: z.number(),
    tier: z.string(),
    needs_attention: z.boolean(),
    reasons: z.array(z.string()),
    components: z
      .object({
        pull_requests: z
          .object({
            score: z.number(),
            availability: z.string(),
            reason: z.string(),
            total_open: z.number(),
            draft_count: z.number(),
            review_requested_count: z.number(),
            oldest_open_age_days: z.number().nullable(),
          })
          .passthrough(),
        security: z
          .object({
            score: z.number(),
            availability: z.string(),
            reason: z.string(),
            overall_state: z.string(),
            active_alert_counts: AlertCountsSchema,
            feature_status: z.record(z.string(), z.string()).optional(),
          })
          .passthrough(),
        staleness: z
          .object({
            score: z.number(),
            days_since_last_push: z.number(),
            recent_commits_90d: z.number(),
            open_issues: z.number(),
          })
          .passthrough(),
        dependencies: z
          .object({
            score: z.number(),
            total_dependencies: z.number(),
            outdated_count: z.number(),
            outdated_percentage: z.number(),
            currency_score: z.number(),
            version_coverage_percentage: z.number(),
            latest_version_coverage_percentage: z.number(),
            unknown_versions_count: z.number(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

const DependencySchema = z
  .object({
    name: z.string(),
    current_version: z.string(),
    latest_version: z.string().nullable(),
    ecosystem: z.string(),
    versions_behind: z.number(),
    is_outdated: z.boolean(),
    status: z.string(),
  })
  .passthrough();

const TechStackSchema = z
  .object({
    repository_name: z.string(),
    languages: z.record(z.string(), z.unknown()),
    frameworks: z.array(z.unknown()),
    dependencies: z.array(DependencySchema),
    total_dependencies: z.number(),
    outdated_count: z.number(),
    currency_score: z.number(),
    primary_language: z.string().nullable(),
    language_diversity: z.number(),
    outdated_percentage: z.number(),
    version_coverage_percentage: z.number(),
  })
  .passthrough()
  .nullable();

const ContributorSchema = z
  .object({
    login: z.string(),
    commits: z.number(),
    additions: z.number(),
    deletions: z.number(),
  })
  .passthrough();

const PullRequestSummarySchema = z
  .object({
    availability: z.string(),
    reason: z.string(),
    has_open_pull_requests: z.boolean(),
    total_open: z.number(),
    draft_count: z.number(),
    review_requested_count: z.number(),
    oldest_open_age_days: z.number().nullable(),
    source: z.string(),
  })
  .passthrough();

const SecuritySummarySchema = z
  .object({
    availability: z.string(),
    reason: z.string(),
    overall_state: z.string(),
    feature_status: z.record(z.string(), z.string()).optional(),
    active_alert_counts: AlertCountsSchema,
    sources: z.array(z.string()),
  })
  .passthrough();

const ScreenshotSchema = z
  .object({
    path: z.string(),
    url: z.string(),
    captured_at: z.string(),
    width: z.number(),
    height: z.number(),
    file_size_kb: z.number(),
  })
  .passthrough();

// --- Raw Repository Schema ---

/**
 * Zod schema for a single repository from the github-stats-spark data source.
 */
export const RawRepositorySchema = z
  .object({
    name: z.string(),
    description: z.string().nullable(),
    summary: SummarySchema,
    url: z.string(),
    homepage: z.string().nullable(),
    has_pages: z.boolean(),
    pages_url: z.string().nullable(),
    website_url: z.string().nullable(),
    stars: z.number(),
    forks: z.number(),
    watchers: z.number(),
    language: z.string().nullable(),
    language_stats: z.record(z.string(), z.unknown()).optional(),
    languages: z.record(z.string(), z.number()),
    created_at: z.string(),
    updated_at: z.string(),
    pushed_at: z.string(),
    total_commits: z.number(),
    recent_commits_90d: z.number(),
    first_commit_date: z.string(),
    last_commit_date: z.string(),
    commit_history: CommitHistorySchema,
    commit_metrics: CommitMetricsSchema.default(DEFAULT_COMMIT_METRICS),
    avg_commit_size: z.number(),
    largest_commit: CommitSizeSchema,
    smallest_commit: CommitSizeSchema,
    commit_velocity: z.number(),
    tech_stack: TechStackSchema,
    has_readme: z.boolean(),
    has_license: z.boolean(),
    has_ci_cd: z.boolean(),
    has_tests: z.boolean(),
    has_docs: z.boolean(),
    language_count: z.number(),
    size_kb: z.number(),
    is_fork: z.boolean(),
    is_private: z.boolean(),
    is_archived: z.boolean(),
    age_days: z.number(),
    days_since_last_push: z.number(),
    ai_summary: z.string().nullable(),
    attention_score: z.number(),
    attention_metrics: AttentionMetricsSchema,
    rank: z.number(),
    composite_score: z.number(),
    pull_request_summary: PullRequestSummarySchema,
    security_summary: SecuritySummarySchema,
    total_additions: z.number(),
    total_deletions: z.number(),
    code_churn: z.number(),
    bus_factor: z.number(),
    bus_factor_health: z.string(),
    contributor_stats: z.array(ContributorSchema),
    attention_rank: z.number(),
    screenshot: ScreenshotSchema.optional(),
  })
  .passthrough();

/**
 * Zod schema for the profile section of the data source.
 */
export const ProfileSchema = z
  .object({
    username: z.string(),
    total_repositories: z.number(),
    total_stars: z.number(),
    total_forks: z.number(),
    total_commits: z.number(),
    activity_calendar: z.record(z.string(), z.number()).optional(),
    weekly_activity: z.array(z.unknown()).optional(),
  })
  .passthrough();

/**
 * Zod schema for the full data source response.
 */
export const RawReposResponseSchema = z.object({
  profile: ProfileSchema,
  repositories: z.array(RawRepositorySchema),
  metadata: z.unknown().optional(),
});

// --- Normalized Types ---

/**
 * Normalized repository entity for UI consumption.
 */
export interface Repository {
  name: string;
  description: string | null;
  summaryText: string;
  url: string;
  homepage: string | null;
  pagesUrl: string | null;
  websiteUrl: string | null;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  languages: Record<string, number>;
  languageCount: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  totalCommits: number;
  recentCommits90d: number;
  commitHistory: z.infer<typeof CommitHistorySchema>;
  commitMetrics: z.infer<typeof CommitMetricsSchema>;
  commitVelocity: number;
  techStack: z.infer<typeof TechStackSchema>;
  hasReadme: boolean;
  hasLicense: boolean;
  hasCiCd: boolean;
  hasTests: boolean;
  hasDocs: boolean;
  sizeKb: number;
  isFork: boolean;
  isPrivate: boolean;
  isArchived: boolean;
  ageDays: number;
  daysSinceLastPush: number;
  aiSummary: string | null;
  attentionScore: number;
  attentionMetrics: z.infer<typeof AttentionMetricsSchema>;
  rank: number;
  compositeScore: number;
  pullRequestSummary: z.infer<typeof PullRequestSummarySchema>;
  securitySummary: z.infer<typeof SecuritySummarySchema>;
  totalAdditions: number;
  totalDeletions: number;
  codeChurn: number;
  busFactor: number;
  busFactorHealth: string;
  contributorStats: z.infer<typeof ContributorSchema>[];
  attentionRank: number;
  screenshot?: z.infer<typeof ScreenshotSchema>;
}

/**
 * Profile data from the data source (aggregate stats).
 */
export interface ReposProfile {
  username: string;
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
}

/**
 * Maps a raw repository record to the normalized Repository interface.
 *
 * @param raw - Raw repository from the JSON data source
 * @returns Normalized repository entity for UI consumption
 */
export function mapRawRepository(raw: z.infer<typeof RawRepositorySchema>): Repository {
  return {
    name: raw.name,
    description: raw.description,
    summaryText: raw.summary.text,
    url: raw.url,
    homepage: raw.homepage,
    pagesUrl: raw.pages_url,
    websiteUrl: raw.website_url,
    stars: raw.stars,
    forks: raw.forks,
    watchers: raw.watchers,
    language: raw.language,
    languages: raw.languages,
    languageCount: raw.language_count,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at,
    totalCommits: raw.total_commits,
    recentCommits90d: raw.recent_commits_90d,
    commitHistory: raw.commit_history,
    commitMetrics: raw.commit_metrics,
    commitVelocity: raw.commit_velocity,
    techStack: raw.tech_stack,
    hasReadme: raw.has_readme,
    hasLicense: raw.has_license,
    hasCiCd: raw.has_ci_cd,
    hasTests: raw.has_tests,
    hasDocs: raw.has_docs,
    sizeKb: raw.size_kb,
    isFork: raw.is_fork,
    isPrivate: raw.is_private,
    isArchived: raw.is_archived,
    ageDays: raw.age_days,
    daysSinceLastPush: raw.days_since_last_push,
    aiSummary: raw.ai_summary,
    attentionScore: raw.attention_score,
    attentionMetrics: raw.attention_metrics,
    rank: raw.rank,
    compositeScore: raw.composite_score,
    pullRequestSummary: raw.pull_request_summary,
    securitySummary: raw.security_summary,
    totalAdditions: raw.total_additions,
    totalDeletions: raw.total_deletions,
    codeChurn: raw.code_churn,
    busFactor: raw.bus_factor,
    busFactorHealth: raw.bus_factor_health,
    contributorStats: raw.contributor_stats,
    attentionRank: raw.attention_rank,
    screenshot: raw.screenshot,
  };
}

/**
 * Maps the raw profile section to the normalized ReposProfile.
 *
 * @param raw - Raw profile from the JSON data source
 * @returns Normalized profile entity
 */
export function mapRawProfile(raw: z.infer<typeof ProfileSchema>): ReposProfile {
  return {
    username: raw.username,
    totalRepositories: raw.total_repositories,
    totalStars: raw.total_stars,
    totalForks: raw.total_forks,
    totalCommits: raw.total_commits,
  };
}

// --- Filter/Sort Types ---

/** Available sort fields for the repository listing. */
export type RepoSortField =
  | 'composite_score'
  | 'stars'
  | 'forks'
  | 'total_commits'
  | 'recent_commits_90d'
  | 'age_days'
  | 'name';

/** Available status filter values. */
export type RepoStatusFilter = 'all' | 'active' | 'stale' | 'archived';

/** Sort direction. */
export type RepoSortDirection = 'asc' | 'desc';

/**
 * Repositories API Configuration.
 */
export const REPOS_API_CONFIG = {
  /** Same-origin data endpoint (uses Vite BASE_URL for GitHub Pages compatibility) */
  DATA_URL: `${import.meta.env.BASE_URL}data/repositories.json`,

  /** Cache key for localStorage */
  CACHE_KEY: 'repos_v2',

  /** Cache TTL in milliseconds (5 min dev, 1 hour prod) */
  CACHE_TTL: {
    DEV: 5 * 60 * 1000,
    PROD: 60 * 60 * 1000,
  },
} as const;
