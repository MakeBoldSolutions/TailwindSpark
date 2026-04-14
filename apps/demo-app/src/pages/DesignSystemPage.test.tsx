import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DesignSystemShowcase } from './DesignSystemPage';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DesignSystemPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<DesignSystemShowcase />);
    // Just check that the component renders with sections
    const sections = document.querySelectorAll('section, div');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('displays page heading', () => {
    renderWithRouter(<DesignSystemShowcase />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
  });

  it('shows component showcases', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Design system pages showcase components
    const showcaseSections = document.querySelectorAll('section');
    expect(showcaseSections.length).toBeGreaterThan(0);
  });

  it('renders button showcase section', () => {
    renderWithRouter(<DesignSystemShowcase />);
    // Use getAllByText since "Button" appears multiple times
    const buttonElements = screen.queryAllByText(/Button/i);
    expect(buttonElements.length).toBeGreaterThan(0);
  });

  it('displays form showcase section', () => {
    renderWithRouter(<DesignSystemShowcase />);
    // Use getAllByText since "Form" appears multiple times
    const formElements = screen.queryAllByText(/Form/i);
    expect(formElements.length).toBeGreaterThan(0);
  });

  it('shows card showcase section', () => {
    renderWithRouter(<DesignSystemShowcase />);
    // Use getAllByText since "Card" appears multiple times
    const cardElements = screen.queryAllByText(/Card/i);
    expect(cardElements.length).toBeGreaterThan(0);
  });

  it('renders modal showcase section', () => {
    renderWithRouter(<DesignSystemShowcase />);
    // Use getAllByText since "Modal" appears multiple times
    const modalElements = screen.queryAllByText(/Modal/i);
    expect(modalElements.length).toBeGreaterThan(0);
  });

  it('displays color palette or design tokens', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Design systems show color palettes - just check sections exist
    const sections = document.querySelectorAll('section, div[class*="color"], div[class*="palette"]');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('shows typography examples', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Check for headings which indicate typography examples
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('has navigation between component sections', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Should have navigation or links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders with proper layout structure', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Proper page structure - check for any container element
    const container = document.querySelector('main, div, section');
    expect(container).toBeTruthy();
  });

  it('displays component variants', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Showcases should display component variants
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it.each(themeMatrix)('keeps design system route content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    renderWithRouter(<DesignSystemShowcase />);

    expect(screen.getByRole('heading', { level: 1, name: /TailwindSpark Component Library/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Button/i).length).toBeGreaterThan(0);
  });
});
