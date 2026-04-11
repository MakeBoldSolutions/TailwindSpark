/**
 * Contract: Repository JSON Schema (v2.2.0)
 *
 * Defines the expected shape of data from:
 * https://raw.githubusercontent.com/markhazleton/github-stats-spark/main/data/users/markhazleton/repositories.json
 *
 * This file documents the contract between the external data source and the
 * GitHub Repositories Explorer mini-app. The actual Zod schemas in
 * src/types/repos-api.ts will implement this contract.
 */

// --- Top-level: Array of Repository objects ---
// GET /data/repositories.json → Repository[]

// --- Repository (root fields) ---
interface RepositoryContract {
  // Identity & metadata
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  has_pages: boolean;
  pages_url: string | null;
  website_url: string | null;

  // Popularity metrics
  stars: number;
  forks: number;
  watchers: number;

  // Language
  language: string | null;
  languages: Record<string, number>;
  language_count: number;
  language_stats?: Record<string, unknown>;

  // Dates
  created_at: string; // ISO 8601
  updated_at: string;
  pushed_at: string;

  // Activity
  total_commits: number;
  recent_commits_90d: number;
  size_kb: number;
  age_days: number;
  days_since_last_push: number;
  first_commit_date: string;
  last_commit_date: string;

  // Code metrics
  avg_commit_size: number;
  total_additions: number;
  total_deletions: number;
  code_churn: number;
  commit_velocity: number;
  bus_factor: number;
  bus_factor_health: string;

  // Flags
  is_fork: boolean;
  is_private: boolean;
  is_archived: boolean;
  has_readme: boolean;
  has_license: boolean;
  has_ci_cd: boolean;
  has_tests: boolean;
  has_docs: boolean;

  // Ranking
  rank: number;
  composite_score: number;
  attention_rank: number;
  attention_score: number;

  // Nested objects
  summary: SummaryContract;
  commit_history: CommitHistoryContract;
  commit_metrics: CommitMetricsContract;
  attention_metrics: AttentionMetricsContract;
  contributor_stats: ContributorContract[];
  pull_request_summary: PullRequestSummaryContract;
  security_summary: SecuritySummaryContract;

  // Optional nested objects
  tech_stack: TechStackContract | null;
  largest_commit: CommitSizeContract;
  smallest_commit: CommitSizeContract;
  ai_summary: string | null;
  screenshot?: ScreenshotContract;
}

interface SummaryContract {
  text: string;
  ai_generated: boolean;
  generation_method: string;
  generated_at: string;
  model_used: string | null;
  tokens_used: number;
  confidence_score: number;
}

interface CommitHistoryContract {
  repository_name: string;
  total_commits: number;
  recent_90d: number;
  recent_180d: number;
  recent_365d: number;
  last_commit_date: string;
  first_commit_date: string;
  patterns: string[];
  commit_frequency: number;
  consistency_score: number;
  activity_rate: number;
  days_since_last_commit: number;
}

interface CommitMetricsContract {
  avg_size: number;
  total_commits: number;
  largest_commit: CommitSizeContract;
  smallest_commit: CommitSizeContract;
  commit_size_distribution: {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
  };
}

interface CommitSizeContract {
  sha: string;
  date: string;
  size: number;
  files_changed: number;
  lines_added: number;
  lines_deleted: number;
}

interface AttentionMetricsContract {
  score: number;
  tier: string;
  needs_attention: boolean;
  reasons: string[];
  components: {
    pull_requests: {
      score: number;
      availability: string;
      reason: string;
      total_open: number;
      draft_count: number;
      review_requested_count: number;
      oldest_open_age_days: number | null;
    };
    security: {
      score: number;
      availability: string;
      reason: string;
      overall_state: string;
      active_alert_counts: {
        total_open: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
      };
      feature_status?: Record<string, string>;
    };
    staleness: {
      score: number;
      days_since_last_push: number;
      recent_commits_90d: number;
      open_issues: number;
    };
    dependencies: {
      score: number;
      total_dependencies: number;
      outdated_count: number;
      outdated_percentage: number;
      currency_score: number;
      version_coverage_percentage: number;
      latest_version_coverage_percentage: number;
      unknown_versions_count: number;
    };
  };
}

interface TechStackContract {
  repository_name: string;
  languages: Record<string, unknown>;
  frameworks: string[];
  dependencies: Array<{
    name: string;
    current_version: string;
    latest_version: string | null;
    ecosystem: string;
    versions_behind: number;
    is_outdated: boolean;
    status: string;
  }>;
  total_dependencies: number;
  outdated_count: number;
  currency_score: number;
  primary_language: string | null;
  language_diversity: number;
  outdated_percentage: number;
  version_coverage_percentage: number;
}

interface ContributorContract {
  login: string;
  commits: number;
  additions: number;
  deletions: number;
}

interface PullRequestSummaryContract {
  availability: string;
  reason: string;
  has_open_pull_requests: boolean;
  total_open: number;
  draft_count: number;
  review_requested_count: number;
  oldest_open_age_days: number | null;
  source: string;
}

interface SecuritySummaryContract {
  availability: string;
  reason: string;
  overall_state: string;
  feature_status: Record<string, string>;
  active_alert_counts: {
    total_open: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  sources: string[];
}

interface ScreenshotContract {
  path: string;
  url: string;
  captured_at: string;
  width: number;
  height: number;
  file_size_kb: number;
}

// Data source URL (build-time fetch)
// https://raw.githubusercontent.com/markhazleton/github-stats-spark/refs/heads/main/data/users/markhazleton/repositories.json

// Local snapshot path (runtime read)
// /data/repositories.json (relative to public/)

export type {
  RepositoryContract,
  SummaryContract,
  CommitHistoryContract,
  CommitMetricsContract,
  CommitSizeContract,
  AttentionMetricsContract,
  TechStackContract,
  ContributorContract,
  PullRequestSummaryContract,
  SecuritySummaryContract,
  ScreenshotContract,
};
