import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Article } from '../types/rss-api';
import { ArticleCard } from './ArticleCard';

const mockArticle: Article = {
  id: '1',
  title: 'Test Article Title',
  description: 'This is a test article description for testing purposes.',
  link: 'https://example.com/article',
  category: 'Technology',
  pub_date: '2025-01-15T00:00:00.000Z',
  author: 'Test Author',
  image_url: 'https://example.com/article.jpg',
};

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('renders article description', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText(/test article description/i)).toBeInTheDocument();
  });

  it('renders preview image when provided', () => {
    render(<ArticleCard article={mockArticle} />);
    const image = screen.getByRole('img', { name: 'Test Article Title' });
    expect(image).toHaveAttribute('src', 'https://example.com/article.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('does not render preview image when not provided', () => {
    render(<ArticleCard article={{ ...mockArticle, image_url: undefined }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<ArticleCard article={mockArticle} />);
    // Date formatting varies by locale/environment
    const dateEl = screen.getByText(/2025/);
    expect(dateEl).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText(/By Test Author/)).toBeInTheDocument();
  });

  it('does not render author when not provided', () => {
    render(<ArticleCard article={{ ...mockArticle, author: undefined }} />);
    expect(screen.queryByText(/By/)).not.toBeInTheDocument();
  });

  it('renders Read article link', () => {
    render(<ArticleCard article={mockArticle} />);
    const link = screen.getByRole('link', { name: /Read article/i });
    expect(link).toHaveAttribute('href', 'https://example.com/article');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
