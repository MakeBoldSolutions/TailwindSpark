import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<HomePage />);
    const ecosystemText = screen.queryAllByText(/Part of the WebSpark Ecosystem/i);
    expect(ecosystemText.length).toBeGreaterThan(0);
  });

  it('displays TailwindSpark brand', () => {
    renderWithRouter(<HomePage />);
    // The TailwindSparkBrand component should be rendered - check for any brand text
    const brandText = screen.queryAllByText(/Making technology work for business|TailwindSpark/i);
    expect(brandText.length).toBeGreaterThan(0);
  });

  it('displays WebSpark ecosystem integration section', () => {
    renderWithRouter(<HomePage />);
    const ecosystemText = screen.queryAllByText(/Part of the WebSpark Ecosystem/i);
    const demoText = screen.queryAllByText(/TailwindSpark demonstrates practical application/i);
    expect(ecosystemText.length + demoText.length).toBeGreaterThan(0);
  });

  it('displays WebSpark portfolio link', () => {
    renderWithRouter(<HomePage />);
    const portfolioLinks = screen.queryAllByRole('link', { name: /WebSpark Portfolio/i });
    expect(portfolioLinks.length).toBeGreaterThan(0);
    // Check attributes on first link
    expect(portfolioLinks[0]).toHaveAttribute('href', 'https://webspark.markhazleton.com');
    expect(portfolioLinks[0]).toHaveAttribute('target', '_blank');
    expect(portfolioLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays navigation links to key pages', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByRole('link', { name: /View Dashboard →/i })).toBeInTheDocument();
  });

  it('shows TailwindSpark ecosystem badges', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/PromptSpark - AI Prompts/i)).toBeInTheDocument();
    expect(screen.getByText(/RecipeSpark - Recipe Management/i)).toBeInTheDocument();
    expect(screen.getByText(/TriviaSpark - Interactive Quizzes/i)).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    renderWithRouter(<HomePage />);
    const heading = screen.getByRole('heading', { level: 3, name: /Part of the WebSpark Ecosystem/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays feature descriptions with proper styling', () => {
    renderWithRouter(<HomePage />);
    const componentLibraryDescription = screen.getByText(/Production-ready UI components built with Tailwind CSS/i);
    expect(componentLibraryDescription).toBeInTheDocument();
  });
});
