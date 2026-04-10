import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ReposProfile, Repository } from '../types/repos-api';
import { RepoSummary } from './RepoSummary';

// Helper to create a mock repository
const createMockRepo = (overrides?: Partial<Repository>): Repository => ({
  name: 'test-repo',
  description: 'Test',
  url: 'https://github.com/test/test',
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
  compositeScore: 85,
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
        reason: '',
        total_open: 0,
        draft_count: 0,
        review_requested_count: 0,
        oldest_open_age_days: null,
      },
      security: {
        score: 100,
        availability: 'available',
        reason: '',
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
    reason: '',
    hasOpenPullRequests: false,
    total_open: 0,
    draft_count: 0,
    review_requested_count: 0,
    oldest_open_age_days: null,
    source: 'github',
  },
  securitySummary: {
    availability: 'available',
    reason: '',
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
  ...overrides,
});

describe('RepoSummary', () => {
  describe('Key Metrics', () => {
    it('displays total repository count', () => {
      const repos = [
        createMockRepo({ name: 'repo1' }),
        createMockRepo({ name: 'repo2' }),
        createMockRepo({ name: 'repo3' }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Repositories')).toBeInTheDocument();
    });

    it('excludes private repositories from count', () => {
      const repos = [
        createMockRepo({ name: 'repo1', isPrivate: false }),
        createMockRepo({ name: 'repo2', isPrivate: true }),
        createMockRepo({ name: 'repo3', isPrivate: false }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays total commits from computed data', () => {
      const repos = [
        createMockRepo({ totalCommits: 100 }),
        createMockRepo({ totalCommits: 50 }),
        createMockRepo({ totalCommits: 25 }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText('175')).toBeInTheDocument();
      expect(screen.getByText('Total Commits')).toBeInTheDocument();
    });

    it('displays total commits from profile when available', () => {
      const repos = [createMockRepo({ totalCommits: 100 })];
      const profile: ReposProfile = {
        username: 'testuser',
        totalRepositories: 5,
        totalStars: 500,
        totalForks: 100,
        totalCommits: 999,
      };
      render(<RepoSummary repositories={repos} profile={profile} />);
      
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('displays total stars', () => {
      const repos = [
        createMockRepo({ stars: 100 }),
        createMockRepo({ stars: 50 }),
        createMockRepo({ stars: 25 }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText('175')).toBeInTheDocument();
      expect(screen.getByText('Total Stars')).toBeInTheDocument();
    });

    it('displays total forks', () => {
      const repos = [
        createMockRepo({ forks: 20 }),
        createMockRepo({ forks: 15 }),
        createMockRepo({ forks: 10 }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('Total Forks')).toBeInTheDocument();
    });
  });

  describe('Language Distribution', () => {
    it('displays language distribution with counts', () => {
      const repos = [
        createMockRepo({ name: 'repo1', language: 'TypeScript' }),
        createMockRepo({ name: 'repo2', language: 'TypeScript' }),
        createMockRepo({ name: 'repo3', language: 'Python' }),
        createMockRepo({ name: 'repo4', language: 'JavaScript' }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText('TypeScript (2)')).toBeInTheDocument();
      expect(screen.getByText('Python (1)')).toBeInTheDocument();
      expect(screen.getByText('JavaScript (1)')).toBeInTheDocument();
    });

    it('limits language display to top 8', () => {
      const repos = [
        createMockRepo({ language: 'TypeScript' }),
        createMockRepo({ language: 'JavaScript' }),
        createMockRepo({ language: 'Python' }),
        createMockRepo({ language: 'C#' }),
        createMockRepo({ language: 'Java' }),
        createMockRepo({ language: 'Go' }),
        createMockRepo({ language: 'Rust' }),
        createMockRepo({ language: 'Ruby' }),
        createMockRepo({ language: 'PHP' }),
        createMockRepo({ language: 'Swift' }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      // Should show only 8 languages
      const languageTags = screen.getAllByText(/\(\d+\)$/);
      expect(languageTags).toHaveLength(8);
    });

    it('sorts languages by count descending', () => {
      const repos = [
        createMockRepo({ language: 'Python' }),
        createMockRepo({ language: 'TypeScript' }),
        createMockRepo({ language: 'TypeScript' }),
        createMockRepo({ language: 'TypeScript' }),
        createMockRepo({ language: 'Python' }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      const languageTags = screen.getAllByText(/\w+ \(\d+\)/);
      expect(languageTags[0].textContent).toBe('TypeScript (3)');
      expect(languageTags[1].textContent).toBe('Python (2)');
    });

    it('handles repositories without language', () => {
      const repos = [
        createMockRepo({ language: 'TypeScript' }),
        createMockRepo({ language: null }),
        createMockRepo({ language: 'Python' }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText('TypeScript (1)')).toBeInTheDocument();
      expect(screen.getByText('Python (1)')).toBeInTheDocument();
    });
  });

  describe('Activity Status', () => {
    it('displays active repository count', () => {
      const repos = [
        createMockRepo({ daysSinceLastPush: 30, isArchived: false }),
        createMockRepo({ daysSinceLastPush: 60, isArchived: false }),
        createMockRepo({ daysSinceLastPush: 100, isArchived: false }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText(/2 active/i)).toBeInTheDocument();
    });

    it('displays stale repository count', () => {
      const repos = [
        createMockRepo({ daysSinceLastPush: 30, isArchived: false }),
        createMockRepo({ daysSinceLastPush: 100, isArchived: false }),
        createMockRepo({ daysSinceLastPush: 120, isArchived: false }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText(/2 stale/i)).toBeInTheDocument();
    });

    it('displays archived repository count', () => {
      const repos = [
        createMockRepo({ isArchived: false }),
        createMockRepo({ isArchived: true }),
        createMockRepo({ isArchived: true }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText(/2 archived/i)).toBeInTheDocument();
    });

    it('excludes private repos from active/stale counts', () => {
      const repos = [
        createMockRepo({ daysSinceLastPush: 30, isArchived: false, isPrivate: false }),
        createMockRepo({ daysSinceLastPush: 40, isArchived: false, isPrivate: true }),
        createMockRepo({ daysSinceLastPush: 100, isArchived: false, isPrivate: false }),
      ];
      render(<RepoSummary repositories={repos} profile={null} />);
      
      expect(screen.getByText(/1 active/i)).toBeInTheDocument();
      expect(screen.getByText(/1 stale/i)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('handles empty repository array', () => {
      render(<RepoSummary repositories={[]} profile={null} />);
      
      expect(screen.getByText('Repositories')).toBeInTheDocument();
      const repoCount = screen.getByText('Repositories').previousElementSibling;
      expect(repoCount?.textContent).toBe('0');
    });
  });

  describe('Profile Integration', () => {
    it('prefers profile data over computed data when available', () => {
      const repos = [createMockRepo({ totalCommits: 100, stars: 50, forks: 25 })];
      const profile: ReposProfile = {
        username: 'testuser',
        totalRepositories: 10,
        totalStars: 999,
        totalForks: 888,
        totalCommits: 777,
      };
      render(<RepoSummary repositories={repos} profile={profile} />);
      
      expect(screen.getByText('777')).toBeInTheDocument(); // commits from profile
      expect(screen.getByText('999')).toBeInTheDocument(); // stars from profile
      expect(screen.getByText('888')).toBeInTheDocument(); // forks from profile
    });
  });
});
