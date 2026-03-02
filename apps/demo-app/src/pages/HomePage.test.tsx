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
    expect(screen.getByText(/Part of the WebSpark Ecosystem/i)).toBeInTheDocument();
  });

  it('displays TailwindSpark brand', () => {
    renderWithRouter(<HomePage />);
    // The TailwindSparkBrand component should be rendered
    expect(screen.getByText(/Making technology work for business/i)).toBeInTheDocument();
  });

  it('displays WebSpark ecosystem integration section', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/Part of the WebSpark Ecosystem/i)).toBeInTheDocument();
    expect(screen.getByText(/TailwindSpark demonstrates practical application/i)).toBeInTheDocument();
  });

  it('displays WebSpark portfolio link', () => {
    renderWithRouter(<HomePage />);
    const portfolioLink = screen.getByRole('link', { name: /WebSpark Portfolio/i });
    expect(portfolioLink).toBeInTheDocument();
    expect(portfolioLink).toHaveAttribute('href', 'https://webspark.markhazleton.com');
    expect(portfolioLink).toHaveAttribute('target', '_blank');
    expect(portfolioLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays feature cards', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/Component Library/i)).toBeInTheDocument();
    expect(screen.getByText(/Dark Mode & Accessibility/i)).toBeInTheDocument();
    expect(screen.getByText(/TailwindSpark Dashboard/i)).toBeInTheDocument();
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

  it('renders all WebSpark application badges', () => {
    renderWithRouter(<HomePage />);
    const badges = ['PromptSpark', 'RecipeSpark', 'TriviaSpark', 'WebSpark Portfolio'];
    badges.forEach(badge => {
      expect(screen.getByText(new RegExp(badge, 'i'))).toBeInTheDocument();
    });
  });
});
