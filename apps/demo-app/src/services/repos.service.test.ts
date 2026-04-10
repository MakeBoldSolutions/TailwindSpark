import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReposProfile, Repository } from '../types/repos-api';
import { clearReposCache, getRepositories } from './repos.service';

// Mock the cache service
vi.mock('./cache.service', () => ({
  getFromCache: vi.fn(),
  setInCache: vi.fn(),
  clearCache: vi.fn(),
}));

// Mock fetchOptions
vi.mock('./fetchOptions', () => ({
  getPublicJsonFetchOptions: vi.fn(() => ({ method: 'GET' })),
}));

import { clearCache, getFromCache, setInCache } from './cache.service';

describe('repos.service', () => {
  const mockRepository: Repository = {
    name: 'test-repo',
    description: 'Test repository',
    url: 'https://github.com/test/test-repo',
    homepage: null,
    hasPages: false,
    pagesUrl: null,
    websiteUrl: null,
    stars: 10,
    forks: 5,
    watchers: 3,
    language: 'TypeScript',
    languages: { TypeScript: 1000 },
    languageCount: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    pushedAt: '2024-01-01T00:00:00Z',
    totalCommits: 100,
    recentCommits90d: 10,
    sizeKb: 500,
    isFork: false,
    isPrivate: false,
    isArchived: false,
    ageDays: 365,
    daysSinceLastPush: 5,
    rank: 1,
    compositeScore: 85.5,
    hasReadme: true,
    hasLicense: true,
    hasCiCd: true,
    hasTests: true,
    hasDocs: true,
    busFactor: 2,
    busFactorHealth: 'healthy',
    totalAdditions: 5000,
    totalDeletions: 1000,
    codeChurn: 6000,
    attentionRank: 1,
    attentionScore: 90,
    summaryText: 'Test summary',
    commitHistory: {
      repositoryName: 'test-repo',
      totalCommits: 100,
      recent_90d: 10,
      recent_180d: 20,
      recent_365d: 50,
      lastCommitDate: '2024-01-01T00:00:00Z',
      firstCommitDate: '2023-01-01T00:00:00Z',
      patterns: ['active'],
      commitFrequency: 0.5,
      consistencyScore: 80,
      activityRate: 0.8,
      daysSinceLastCommit: 5,
    },
    attentionMetrics: {
      score: 90,
      tier: 'excellent',
      needsAttention: false,
      reasons: [],
      components: {
        pull_requests: {
          score: 100,
          availability: 'available',
          reason: 'No open PRs',
          total_open: 0,
          draft_count: 0,
          review_requested_count: 0,
          oldest_open_age_days: null,
        },
        security: {
          score: 100,
          availability: 'available',
          reason: 'No alerts',
          overall_state: 'clean',
          active_alert_counts: {
            total_open: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
          },
        },
        staleness: {
          score: 95,
          days_since_last_push: 5,
          recent_commits_90d: 10,
          open_issues: 0,
        },
        dependencies: {
          score: 85,
          total_dependencies: 10,
          outdated_count: 1,
          outdated_percentage: 10,
          currency_score: 90,
          version_coverage_percentage: 100,
          latest_version_coverage_percentage: 90,
          unknown_versions_count: 0,
        },
      },
    },
    contributorStats: [],
    pullRequestSummary: {
      availability: 'available',
      reason: 'No open PRs',
      hasOpenPullRequests: false,
      total_open: 0,
      draft_count: 0,
      review_requested_count: 0,
      oldest_open_age_days: null,
      source: 'github',
    },
    securitySummary: {
      availability: 'available',
      reason: 'No alerts',
      overall_state: 'clean',
      feature_status: {},
      active_alert_counts: {
        total_open: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
      sources: ['github'],
    },
  };

  const mockProfile: ReposProfile = {
    username: 'testuser',
    totalRepositories: 1,
    totalStars: 10,
    totalForks: 5,
    totalCommits: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('getRepositories', () => {
    it('should return cached data when available', async () => {
      vi.mocked(getFromCache)
        .mockReturnValueOnce([mockRepository])
        .mockReturnValueOnce(mockProfile);

      const result = await getRepositories();

      expect(result).toEqual({
        repositories: [mockRepository],
        profile: mockProfile,
      });
      expect(getFromCache).toHaveBeenCalledTimes(2);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch from URL when cache is empty', async () => {
      vi.mocked(getFromCache).mockReturnValue(null);
      
      const mockResponse = {
        repositories: [
          {
            name: 'test-repo',
            description: 'Test repository',
            url: 'https://github.com/test/test-repo',
            homepage: null,
            has_pages: false,
            pages_url: null,
            website_url: null,
            stars: 10,
            forks: 5,
            watchers: 3,
            language: 'TypeScript',
            languages: { TypeScript: 1000 },
            language_count: 1,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            pushed_at: '2024-01-01T00:00:00Z',
            total_commits: 100,
            recent_commits_90d: 10,
            first_commit_date: '2023-01-01T00:00:00Z',
            last_commit_date: '2024-01-01T00:00:00Z',
            size_kb: 500,
            is_fork: false,
            is_private: false,
            is_archived: false,
            age_days: 365,
            days_since_last_push: 5,
            rank: 1,
            composite_score: 85.5,
            has_readme: true,
            has_license: true,
            has_ci_cd: true,
            has_tests: true,
            has_docs: true,
            bus_factor: 2,
            bus_factor_health: 'healthy',
            total_additions: 5000,
            total_deletions: 1000,
            code_churn: 6000,
            attention_rank: 1,
            attention_score: 90,
            avg_commit_size: 50,
            commit_velocity: 0.5,
            ai_summary: null,
            summary: {
              text: 'Test summary',
              ai_generated: true,
              generation_method: 'test',
              generated_at: '2024-01-01T00:00:00Z',
              model_used: 'test-model',
              confidence_score: 95,
            },
            commit_history: {
              repository_name: 'test-repo',
              total_commits: 100,
              recent_90d: 10,
              recent_180d: 20,
              recent_365d: 50,
              last_commit_date: '2024-01-01T00:00:00Z',
              first_commit_date: '2023-01-01T00:00:00Z',
              patterns: ['active'],
              commit_frequency: 0.5,
              consistency_score: 80,
              activity_rate: 0.8,
              days_since_last_commit: 5,
            },
            commit_metrics: {
              avg_size: 50,
              total_commits: 100,
              largest_commit: {
                sha: 'abc123',
                date: '2024-01-01T00:00:00Z',
                size: 200,
                files_changed: 10,
                lines_added: 150,
                lines_deleted: 50,
              },
              smallest_commit: {
                sha: 'def456',
                date: '2023-01-01T00:00:00Z',
                size: 10,
                files_changed: 1,
                lines_added: 8,
                lines_deleted: 2,
              },
              commit_size_distribution: {
                min: 10,
                q1: 30,
                median: 50,
                q3: 80,
                max: 200,
              },
            },
            largest_commit: {
              sha: 'abc123',
              date: '2024-01-01T00:00:00Z',
              size: 200,
              files_changed: 10,
              lines_added: 150,
              lines_deleted: 50,
            },
            smallest_commit: {
              sha: 'def456',
              date: '2023-01-01T00:00:00Z',
              size: 10,
              files_changed: 1,
              lines_added: 8,
              lines_deleted: 2,
            },
            tech_stack: null,
            attention_metrics: {
              score: 90,
              tier: 'excellent',
              needs_attention: false,
              reasons: [],
              components: {
                pull_requests: {
                  score: 100,
                  availability: 'available',
                  reason: 'No open PRs',
                  total_open: 0,
                  draft_count: 0,
                  review_requested_count: 0,
                  oldest_open_age_days: null,
                },
                security: {
                  score: 100,
                  availability: 'available',
                  reason: 'No alerts',
                  overall_state: 'clean',
                  active_alert_counts: {
                    total_open: 0,
                    critical: 0,
                    high: 0,
                    medium: 0,
                    low: 0,
                  },
                },
                staleness: {
                  score: 95,
                  days_since_last_push: 5,
                  recent_commits_90d: 10,
                  open_issues: 0,
                },
                dependencies: {
                  score: 85,
                  total_dependencies: 10,
                  outdated_count: 1,
                  outdated_percentage: 10,
                  currency_score: 90,
                  version_coverage_percentage: 100,
                  latest_version_coverage_percentage: 90,
                  unknown_versions_count: 0,
                },
              },
            },
            contributor_stats: [],
            pull_request_summary: {
              availability: 'available',
              reason: 'No open PRs',
              has_open_pull_requests: false,
              total_open: 0,
              draft_count: 0,
              review_requested_count: 0,
              oldest_open_age_days: null,
              source: 'github',
            },
            security_summary: {
              availability: 'available',
              reason: 'No alerts',
              overall_state: 'clean',
              feature_status: {},
              active_alert_counts: {
                total_open: 0,
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
              },
              sources: ['github'],
            },
          },
        ],
        profile: {
          username: 'testuser',
          total_repositories: 1,
          total_stars: 10,
          total_forks: 5,
          total_commits: 100,
        },
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getRepositories();

      expect(result.repositories).toHaveLength(1);
      expect(result.repositories[0].name).toBe('test-repo');
      expect(result.profile.username).toBe('testuser');
      expect(setInCache).toHaveBeenCalledTimes(2);
    });

    it('should return empty data on fetch failure', async () => {
      vi.mocked(getFromCache).mockReturnValue(null);
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      const result = await getRepositories();

      expect(result).toEqual({
        repositories: [],
        profile: {
          username: '',
          totalRepositories: 0,
          totalStars: 0,
          totalForks: 0,
          totalCommits: 0,
        },
      });
    });

    it('should handle HTTP error responses', async () => {
      vi.mocked(getFromCache).mockReturnValue(null);
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      const result = await getRepositories();

      expect(result.repositories).toEqual([]);
      expect(result.profile.totalRepositories).toBe(0);
    });
  });

  describe('clearReposCache', () => {
    it('should clear both repository and profile caches', () => {
      clearReposCache();

      expect(clearCache).toHaveBeenCalledTimes(2);
      expect(clearCache).toHaveBeenCalledWith('repos_v1');
      expect(clearCache).toHaveBeenCalledWith('repos_v1_profile');
    });
  });
});
