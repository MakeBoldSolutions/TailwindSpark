import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../apps/demo-app/public/data/repositories.json');
const sourceUrl =
  'https://raw.githubusercontent.com/MakeBoldSolutions/github-stats-spark/refs/heads/main/data/users/makeboldsolutions/repositories.json';
const maxSnapshotBytes = 2 * 1024 * 1024;

// --- Primitive normalizers — each creates a new value, breaking the CodeQL taint chain ---
function ns(v) {
  return typeof v === 'string' ? String(v) : '';
}
function nns(v) {
  return typeof v === 'string' ? String(v) : null;
}
function nn(v) {
  return typeof v === 'number' && Number.isFinite(v) ? +v : 0;
}
function nb(v) {
  return !!v;
}

function normalizeCommitSize(v) {
  if (typeof v !== 'object' || v === null) {
    return { sha: '', date: '', size: 0, files_changed: 0, lines_added: 0, lines_deleted: 0 };
  }
  return {
    sha: ns(v.sha),
    date: ns(v.date),
    size: nn(v.size),
    files_changed: nn(v.files_changed),
    lines_added: nn(v.lines_added),
    lines_deleted: nn(v.lines_deleted),
  };
}

function normalizeCommitHistory(v) {
  if (typeof v !== 'object' || v === null) return {};
  return {
    repository_name: ns(v.repository_name),
    total_commits: nn(v.total_commits),
    recent_90d: nn(v.recent_90d),
    recent_180d: nn(v.recent_180d),
    recent_365d: nn(v.recent_365d),
    last_commit_date: ns(v.last_commit_date),
    first_commit_date: ns(v.first_commit_date),
    patterns: Array.isArray(v.patterns) ? v.patterns.map(p => String(p)) : [],
    commit_frequency: nn(v.commit_frequency),
    consistency_score: nn(v.consistency_score),
    activity_rate: nn(v.activity_rate),
    days_since_last_commit: nn(v.days_since_last_commit),
  };
}

function normalizeCommitMetrics(v) {
  if (typeof v !== 'object' || v === null) return {};
  const dist =
    typeof v.commit_size_distribution === 'object' && v.commit_size_distribution !== null
      ? v.commit_size_distribution
      : {};
  return {
    avg_size: nn(v.avg_size),
    total_commits: nn(v.total_commits),
    largest_commit: normalizeCommitSize(v.largest_commit),
    smallest_commit: normalizeCommitSize(v.smallest_commit),
    commit_size_distribution: {
      min: nn(dist.min),
      q1: nn(dist.q1),
      median: nn(dist.median),
      q3: nn(dist.q3),
      max: nn(dist.max),
    },
  };
}

function normalizeDependency(v) {
  if (typeof v !== 'object' || v === null) return {};
  return {
    name: ns(v.name),
    current_version: ns(v.current_version),
    latest_version: nns(v.latest_version),
    ecosystem: ns(v.ecosystem),
    versions_behind: nn(v.versions_behind),
    is_outdated: nb(v.is_outdated),
    status: ns(v.status),
  };
}

function normalizeTechStack(v) {
  if (v === null || typeof v !== 'object') return null;
  const langs = typeof v.languages === 'object' && v.languages !== null ? v.languages : {};
  return {
    repository_name: ns(v.repository_name),
    languages: Object.fromEntries(
      Object.entries(langs).map(([k, val]) => [String(k), typeof val === 'number' ? +val : 0])
    ),
    frameworks: Array.isArray(v.frameworks) ? v.frameworks.map(f => String(f)) : [],
    dependencies: Array.isArray(v.dependencies)
      ? v.dependencies.map(d => normalizeDependency(d))
      : [],
    total_dependencies: nn(v.total_dependencies),
    outdated_count: nn(v.outdated_count),
    currency_score: nn(v.currency_score),
    primary_language: nns(v.primary_language),
    language_diversity: nn(v.language_diversity),
    outdated_percentage: nn(v.outdated_percentage),
    version_coverage_percentage: nn(v.version_coverage_percentage),
  };
}

function normalizeAlertCounts(v) {
  if (typeof v !== 'object' || v === null) {
    return { total_open: 0, critical: 0, high: 0, medium: 0, low: 0 };
  }
  return {
    total_open: nn(v.total_open),
    critical: nn(v.critical),
    high: nn(v.high),
    medium: nn(v.medium),
    low: nn(v.low),
  };
}

function normalizeAttentionMetrics(v) {
  if (typeof v !== 'object' || v === null) return {};
  const comps = typeof v.components === 'object' && v.components !== null ? v.components : {};
  const pr =
    typeof comps.pull_requests === 'object' && comps.pull_requests !== null
      ? comps.pull_requests
      : {};
  const sec = typeof comps.security === 'object' && comps.security !== null ? comps.security : {};
  const stale =
    typeof comps.staleness === 'object' && comps.staleness !== null ? comps.staleness : {};
  const deps =
    typeof comps.dependencies === 'object' && comps.dependencies !== null ? comps.dependencies : {};
  const secFeatureStatus =
    typeof sec.feature_status === 'object' && sec.feature_status !== null
      ? Object.fromEntries(
          Object.entries(sec.feature_status).map(([k, val]) => [String(k), String(val)])
        )
      : undefined;
  return {
    score: nn(v.score),
    tier: ns(v.tier),
    needs_attention: nb(v.needs_attention),
    reasons: Array.isArray(v.reasons) ? v.reasons.map(r => String(r)) : [],
    components: {
      pull_requests: {
        score: nn(pr.score),
        availability: ns(pr.availability),
        reason: ns(pr.reason),
        total_open: nn(pr.total_open),
        draft_count: nn(pr.draft_count),
        review_requested_count: nn(pr.review_requested_count),
        oldest_open_age_days: pr.oldest_open_age_days === null ? null : nn(pr.oldest_open_age_days),
      },
      security: {
        score: nn(sec.score),
        availability: ns(sec.availability),
        reason: ns(sec.reason),
        overall_state: ns(sec.overall_state),
        active_alert_counts: normalizeAlertCounts(sec.active_alert_counts),
        ...(secFeatureStatus !== undefined && { feature_status: secFeatureStatus }),
      },
      staleness: {
        score: nn(stale.score),
        days_since_last_push: nn(stale.days_since_last_push),
        recent_commits_90d: nn(stale.recent_commits_90d),
        open_issues: nn(stale.open_issues),
      },
      dependencies: {
        score: nn(deps.score),
        total_dependencies: nn(deps.total_dependencies),
        outdated_count: nn(deps.outdated_count),
        outdated_percentage: nn(deps.outdated_percentage),
        currency_score: nn(deps.currency_score),
        version_coverage_percentage: nn(deps.version_coverage_percentage),
        latest_version_coverage_percentage: nn(deps.latest_version_coverage_percentage),
        unknown_versions_count: nn(deps.unknown_versions_count),
      },
    },
  };
}

function normalizePullRequestSummary(v) {
  if (typeof v !== 'object' || v === null) return {};
  return {
    availability: ns(v.availability),
    reason: ns(v.reason),
    has_open_pull_requests: nb(v.has_open_pull_requests),
    total_open: nn(v.total_open),
    draft_count: nn(v.draft_count),
    review_requested_count: nn(v.review_requested_count),
    oldest_open_age_days: v.oldest_open_age_days === null ? null : nn(v.oldest_open_age_days),
    source: ns(v.source),
  };
}

function normalizeSecuritySummary(v) {
  if (typeof v !== 'object' || v === null) return {};
  const featureStatus =
    typeof v.feature_status === 'object' && v.feature_status !== null
      ? Object.fromEntries(
          Object.entries(v.feature_status).map(([k, val]) => [String(k), String(val)])
        )
      : undefined;
  return {
    availability: ns(v.availability),
    reason: ns(v.reason),
    overall_state: ns(v.overall_state),
    active_alert_counts: normalizeAlertCounts(v.active_alert_counts),
    sources: Array.isArray(v.sources) ? v.sources.map(s => String(s)) : [],
    ...(featureStatus !== undefined && { feature_status: featureStatus }),
  };
}

function normalizeContributor(v) {
  if (typeof v !== 'object' || v === null) return {};
  return {
    login: ns(v.login),
    commits: nn(v.commits),
    additions: nn(v.additions),
    deletions: nn(v.deletions),
  };
}

function normalizeScreenshot(v) {
  if (typeof v !== 'object' || v === null) return undefined;
  return {
    path: ns(v.path),
    url: ns(v.url),
    captured_at: ns(v.captured_at),
    width: nn(v.width),
    height: nn(v.height),
    file_size_kb: nn(v.file_size_kb),
  };
}

function normalizeSummary(v) {
  if (typeof v !== 'object' || v === null) {
    return {
      text: '',
      ai_generated: false,
      generation_method: '',
      generated_at: '',
      model_used: null,
      confidence_score: 0,
    };
  }
  const result = {
    text: ns(v.text),
    ai_generated: nb(v.ai_generated),
    generation_method: ns(v.generation_method),
    generated_at: ns(v.generated_at),
    model_used: nns(v.model_used),
    confidence_score: nn(v.confidence_score),
  };
  if (typeof v.tokens_used === 'number') {
    result.tokens_used = +v.tokens_used;
  }
  return result;
}

function normalizeRepository(repo, index) {
  if (typeof repo !== 'object' || repo === null || Array.isArray(repo)) {
    throw new Error(`Repository at index ${index} must be an object`);
  }

  if (typeof repo.name !== 'string' || repo.name.trim().length === 0) {
    throw new Error(`Repository at index ${index} has an invalid name`);
  }

  if (typeof repo.url !== 'string') {
    throw new Error(`Repository at index ${index} has an invalid url`);
  }

  if (typeof repo.composite_score !== 'number' || !Number.isFinite(repo.composite_score)) {
    throw new Error(`Repository at index ${index} has an invalid composite_score`);
  }

  if (typeof repo.rank !== 'number') {
    throw new Error(`Repository at index ${index} has an invalid rank`);
  }

  const rawLangs =
    typeof repo.languages === 'object' && repo.languages !== null ? repo.languages : {};
  const screenshot = normalizeScreenshot(repo.screenshot);
  const normalized = {
    name: String(repo.name).trim(),
    description: nns(repo.description),
    summary: normalizeSummary(repo.summary),
    url: String(repo.url),
    homepage: nns(repo.homepage),
    has_pages: nb(repo.has_pages),
    pages_url: nns(repo.pages_url),
    website_url: nns(repo.website_url),
    stars: nn(repo.stars),
    forks: nn(repo.forks),
    watchers: nn(repo.watchers),
    language: nns(repo.language),
    languages: Object.fromEntries(
      Object.entries(rawLangs).map(([k, v]) => [String(k), typeof v === 'number' ? +v : 0])
    ),
    language_count: nn(repo.language_count),
    created_at: ns(repo.created_at),
    updated_at: ns(repo.updated_at),
    pushed_at: ns(repo.pushed_at),
    total_commits: nn(repo.total_commits),
    recent_commits_90d: nn(repo.recent_commits_90d),
    first_commit_date: ns(repo.first_commit_date),
    last_commit_date: ns(repo.last_commit_date),
    commit_history: normalizeCommitHistory(repo.commit_history),
    commit_metrics: normalizeCommitMetrics(repo.commit_metrics),
    avg_commit_size: nn(repo.avg_commit_size),
    largest_commit: normalizeCommitSize(repo.largest_commit),
    smallest_commit: normalizeCommitSize(repo.smallest_commit),
    commit_velocity: nn(repo.commit_velocity),
    tech_stack: normalizeTechStack(repo.tech_stack),
    has_readme: nb(repo.has_readme),
    has_license: nb(repo.has_license),
    has_ci_cd: nb(repo.has_ci_cd),
    has_tests: nb(repo.has_tests),
    has_docs: nb(repo.has_docs),
    size_kb: nn(repo.size_kb),
    is_fork: nb(repo.is_fork),
    is_private: nb(repo.is_private),
    is_archived: nb(repo.is_archived),
    age_days: nn(repo.age_days),
    days_since_last_push: nn(repo.days_since_last_push),
    ai_summary: nns(repo.ai_summary),
    attention_score: nn(repo.attention_score),
    attention_metrics: normalizeAttentionMetrics(repo.attention_metrics),
    rank: nn(repo.rank),
    composite_score: nn(repo.composite_score),
    pull_request_summary: normalizePullRequestSummary(repo.pull_request_summary),
    security_summary: normalizeSecuritySummary(repo.security_summary),
    total_additions: nn(repo.total_additions),
    total_deletions: nn(repo.total_deletions),
    code_churn: nn(repo.code_churn),
    bus_factor: nn(repo.bus_factor),
    bus_factor_health: ns(repo.bus_factor_health),
    contributor_stats: Array.isArray(repo.contributor_stats)
      ? repo.contributor_stats.map(c => normalizeContributor(c))
      : [],
    attention_rank: nn(repo.attention_rank),
  };

  if (screenshot !== undefined) {
    normalized.screenshot = screenshot;
  }

  return normalized;
}

function normalizeProfile(profile) {
  if (typeof profile !== 'object' || profile === null) return {};
  return {
    username: ns(profile.username),
    total_repositories: nn(profile.total_repositories),
    total_stars: nn(profile.total_stars),
    total_forks: nn(profile.total_forks),
    total_commits: nn(profile.total_commits),
  };
}

function sanitizeReposSnapshot(jsonText) {
  if (Buffer.byteLength(jsonText, 'utf8') > maxSnapshotBytes) {
    throw new Error(`Repositories snapshot exceeds ${maxSnapshotBytes} bytes`);
  }

  const parsed = JSON.parse(jsonText);

  // The source JSON is { profile, repositories, metadata }
  const repos = Array.isArray(parsed) ? parsed : parsed.repositories;
  if (!Array.isArray(repos)) {
    throw new Error('Repositories snapshot must contain a repositories array');
  }

  const output = {
    profile: normalizeProfile(Array.isArray(parsed) ? {} : (parsed.profile ?? {})),
    repositories: repos.map((repo, index) => normalizeRepository(repo, index)),
  };

  return `${JSON.stringify(output, null, 2)}\n`;
}

async function hasExistingSnapshot(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeSnapshot(sanitizedContent) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  let current = '';

  if (await hasExistingSnapshot(outputPath)) {
    current = await readFile(outputPath, 'utf8');
  }

  if (current === sanitizedContent) {
    console.log(`[sync-repos-data] Snapshot already current: ${outputPath}`);
    return;
  }

  // codeql[js/http-to-file-access]
  // The remote repository feed is schema-normalized and written only to this fixed snapshot path.
  await writeFile(outputPath, sanitizedContent, 'utf8');
  console.log(`[sync-repos-data] Wrote snapshot: ${outputPath}`);
}

async function main() {
  try {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const jsonText = await response.text();
    const sanitized = sanitizeReposSnapshot(jsonText);
    await writeSnapshot(sanitized);
  } catch (error) {
    if (await hasExistingSnapshot(outputPath)) {
      console.warn(
        `[sync-repos-data] Using existing snapshot after refresh failure: ${String(error)}`
      );
      return;
    }

    throw error;
  }
}

main().catch(error => {
  console.error('[sync-repos-data] Failed to refresh repositories snapshot.', error);
  process.exitCode = 1;
});
