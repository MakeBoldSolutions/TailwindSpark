import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Repository } from '../types/repos-api';
import { RepoCard } from './RepoCard';

const mockRepository: Repository = {
  name: 'test-repo',
  description: 'Test repository description',
  url: 'https://github.com/test/test-repo',
  homepage: 'https://test-repo.com',
  hasPages: true,
  pagesUrl: 'https://test.github.io/test-repo',
  websiteUrl: 'https://test-repo.com',
  stars: 42,
  forks: 10,
  watchers: 15,
  language: 'TypeScript',
  languages: { TypeScript: 1000, JavaScript: 200 },
  languageCount: 2,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  pushedAt: '2024-01-01T00:00:00Z',
  totalCommits: 150,
  recentCommits90d: 25,
  sizeKb: 750,
  isFork: false,
  isPrivate: false,
  isArchived: false,
  ageDays: 400,
  daysSinceLastPush: 3,
  rank: 5,
  compositeScore: 88.5,
  hasReadme: true,
  hasLicense: true,
  hasCiCd: true,
  hasTests: true,
  hasDocs: true,
  busFactor: 3,
  busFactorHealth: 'healthy',
  totalAdditions: 8000,
  totalDeletions: 2000,
  codeChurn: 10000,
  attentionRank: 2,
  attentionScore: 92,
  summaryText: 'A test repository for unit testing',
  commitHistory: {
    repositoryName: 'test-repo',
    totalCommits: 150,
    recent_90d: 25,
    recent_180d: 50,
    recent_365d: 100,
    lastCommitDate: '2024-01-01T00:00:00Z',
    firstCommitDate: '2023-01-01T00:00:00Z',
    patterns: ['consistent', 'active'],
    commitFrequency: 0.6,
    consistencyScore: 85,
    activityRate: 0.9,
    daysSinceLastCommit: 3,
  },
  attentionMetrics: {
    score: 92,
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
        reason: 'No security alerts',
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
        score: 98,
        days_since_last_push: 3,
        recent_commits_90d: 25,
        open_issues: 0,
      },
      dependencies: {
        score: 90,
        total_dependencies: 15,
        outdated_count: 2,
        outdated_percentage: 13.3,
        currency_score: 86.7,
        version_coverage_percentage: 100,
        latest_version_coverage_percentage: 86.7,
        unknown_versions_count: 0,
      },
    },
  },
  contributorStats: [
    {
      login: 'testuser',
      commits: 120,
      additions: 7000,
      deletions: 1500,
    },
  ],
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

describe('RepoCard', () => {
  it('renders repository name and description', () => {
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={() => {}} />);
    
    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.getByText('Test repository description')).toBeInTheDocument();
  });

  it('displays rank badge', () => {
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={() => {}} />);
    
    expect(screen.getByText('#5')).toBeInTheDocument();
  });

  it('displays repository stats (stars, forks, watchers)', () => {
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={() => {}} />);
    
    expect(screen.getByText('42')).toBeInTheDocument(); // stars
    expect(screen.getByText('10')).toBeInTheDocument(); // forks
    expect(screen.getByText('15')).toBeInTheDocument(); // watchers
  });

  it('displays composite score', () => {
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={() => {}} />);
    
    expect(screen.getByText(/Score: 88\.5/)).toBeInTheDocument();
  });

  it('displays primary language with color indicator', () => {
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={() => {}} />);
    
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('shows archived badge when repository is archived', () => {
    const archivedRepo = { ...mockRepository, isArchived: true };
    render(<RepoCard repository={archivedRepo} isExpanded={false} onToggle={() => {}} />);
    
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('applies opacity style when archived', () => {
    const archivedRepo = { ...mockRepository, isArchived: true };
    const { container } = render(<RepoCard repository={archivedRepo} isExpanded={false} onToggle={() => {}} />);
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('opacity-70');
  });

  it('uses summary text when description is null', () => {
    const repoWithoutDesc = { ...mockRepository, description: null };
    render(<RepoCard repository={repoWithoutDesc} isExpanded={false} onToggle={() => {}} />);
    
    expect(screen.getByText('A test repository for unit testing')).toBeInTheDocument();
  });

  it('calls onToggle when card is clicked', () => {
    const handleToggle = vi.fn();
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={handleToggle} />);
    
    const cardButton = screen.getByRole('button');
    fireEvent.click(cardButton);
    
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle when Enter key is pressed', () => {
    const handleToggle = vi.fn();
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={handleToggle} />);
    
    const cardButton = screen.getByRole('button');
    fireEvent.keyDown(cardButton, { key: 'Enter' });
    
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle when Space key is pressed', () => {
    const handleToggle = vi.fn();
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={handleToggle} />);
    
    const cardButton = screen.getByRole('button');
    fireEvent.keyDown(cardButton, { key: ' ' });
    
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('does not call onToggle for other keys', () => {
    const handleToggle = vi.fn();
    render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={handleToggle} />);
    
    const cardButton = screen.getByRole('button');
    fireEvent.keyDown(cardButton, { key: 'Tab' });
    
    expect(handleToggle).not.toHaveBeenCalled();
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes when collapsed', () => {
      render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={() => {}} />);
      
      const cardButton = screen.getByRole('button');
      expect(cardButton).toHaveAttribute('aria-expanded', 'false');
      expect(cardButton).toHaveAttribute('aria-controls', 'repo-detail-test-repo');
    });

    it('has proper ARIA attributes when expanded', () => {
      render(<RepoCard repository={mockRepository} isExpanded={true} onToggle={() => {}} />);
      
      const cardButton = screen.getByRole('button');
      expect(cardButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('is keyboard focusable', () => {
      render(<RepoCard repository={mockRepository} isExpanded={false} onToggle={() => {}} />);
      
      const cardButton = screen.getByRole('button');
      expect(cardButton).toHaveAttribute('tabIndex', '0');
    });

    it('shows detail panel with correct id when expanded', () => {
      render(<RepoCard repository={mockRepository} isExpanded={true} onToggle={() => {}} />);
      
      const detailPanel = screen.getByRole('region');
      expect(detailPanel).toHaveAttribute('id', 'repo-detail-test-repo');
    });
  });
});
