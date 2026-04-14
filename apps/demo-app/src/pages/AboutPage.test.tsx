import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SEOProvider } from '../contexts/SEOContext';
import { AboutPage } from './AboutPage';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

vi.mock('../hooks/useArticles', () => ({
  useArticles: () => ({
    articles: [
      {
        id: '1',
        title: 'ReactSpark Intro',
        description: 'Introduction to ReactSpark',
        link: 'https://example.com/1',
        category: 'ReactSpark',
        pub_date: '2025-01-15',
        author: 'Author',
      },
      {
        id: '2',
        title: 'Other Article',
        description: 'Not ReactSpark',
        link: 'https://example.com/2',
        category: 'Technology',
        pub_date: '2025-01-10',
        author: 'Author',
      },
    ],
    loading: false,
    error: null,
    refreshCache: vi.fn(),
  }),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <SEOProvider>
        <AboutPage />
      </SEOProvider>
    </BrowserRouter>,
  );

describe('AboutPage', () => {
  it('renders without crashing', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/About TailwindSpark/i);
  });

  it('displays technology stack section', () => {
    renderPage();
    expect(screen.getByText('Technology Stack')).toBeInTheDocument();
    expect(screen.getByText('React 18+')).toBeInTheDocument();
  });

  it('filters and displays ReactSpark articles', () => {
    renderPage();
    expect(screen.getByText('ReactSpark Intro')).toBeInTheDocument();
    // Non-ReactSpark articles should not appear in the filtered section
  });

  it('displays mini-apps section', () => {
    renderPage();
    expect(screen.getByText('Mini-Apps')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Apps/i })).toBeInTheDocument();
  });

  it('displays WebSpark Ecosystem section', () => {
    renderPage();
    expect(screen.getByText('WebSpark Ecosystem')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Visit WebSpark Portfolio/i });
    expect(link).toHaveAttribute('href', 'https://webspark.markhazleton.com');
  });

  it.each(themeMatrix)('keeps about route content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: /About TailwindSpark/i })).toBeInTheDocument();
    expect(screen.getByText(/Technology Stack/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Apps/i })).toBeInTheDocument();
  });
});
