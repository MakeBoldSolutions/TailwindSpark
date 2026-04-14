import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SEOProvider } from '../../contexts/SEOContext';
import ArticlesPage from './ArticlesPage';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

const mockArticles = [
  { id: '1', title: 'First Article', description: 'Desc', link: 'https://example.com/1', category: 'Tech', pub_date: '2025-01-15', author: 'Author' },
  { id: '2', title: 'Second Article', description: 'Desc 2', link: 'https://example.com/2', category: 'Science', pub_date: '2025-01-10', author: 'Author' },
];

vi.mock('../../hooks/useArticles', () => ({
  useArticles: () => ({
    articles: mockArticles,
    loading: false,
    error: null,
    refreshCache: vi.fn(),
  }),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <SEOProvider>
        <ArticlesPage />
      </SEOProvider>
    </BrowserRouter>,
  );

describe('ArticlesPage', () => {
  it('renders without crashing', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Articles/i })).toBeInTheDocument();
  });

  it('displays article cards', () => {
    renderPage();
    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });

  it('has category filter', () => {
    renderPage();
    const select = screen.getByDisplayValue('All');
    expect(select).toBeInTheDocument();
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    renderPage();

    const select = screen.getByDisplayValue('All');
    await user.selectOptions(select, 'Tech');

    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.queryByText('Second Article')).not.toBeInTheDocument();
  });

  it('has sort toggle button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Newest First|Oldest First/i })).toBeInTheDocument();
  });

  it('shows result count', () => {
    renderPage();
    expect(screen.getByText(/Showing \d+ of \d+ article/i)).toBeInTheDocument();
  });

  it('renders without critical axe violations', async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it.each(themeMatrix)('keeps articles route content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: /Articles/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('All')).toBeInTheDocument();
    expect(screen.getByText(/Showing \d+ of \d+ article/i)).toBeInTheDocument();
  });
});
