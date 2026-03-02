import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DesignSystemShowcase } from './DesignSystemPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DesignSystemPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<DesignSystemShowcase />);
    expect(screen.getByText(/Design System/i)).toBeInTheDocument();
  });

  it('displays page heading', () => {
    renderWithRouter(<DesignSystemShowcase />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Design System/i);
  });

  it('shows component showcases', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Design system pages showcase components
    const showcaseSections = document.querySelectorAll('section');
    expect(showcaseSections.length).toBeGreaterThan(0);
  });

  it('renders button showcase section', () => {
    renderWithRouter(<DesignSystemShowcase />);
    expect(screen.getByText(/Button/i)).toBeInTheDocument();
  });

  it('displays form showcase section', () => {
    renderWithRouter(<DesignSystemShowcase />);
    expect(screen.getByText(/Form/i)).toBeInTheDocument();
  });

  it('shows card showcase section', () => {
    renderWithRouter(<DesignSystemShowcase />);
    expect(screen.getByText(/Card/i)).toBeInTheDocument();
  });

  it('renders modal showcase section', () => {
    renderWithRouter(<DesignSystemShowcase />);
    expect(screen.getByText(/Modal/i)).toBeInTheDocument();
  });

  it('displays color palette or design tokens', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Design systems show color palettes
    const colorSection = screen.queryByText(/Color|Palette|Theme/i);
    expect(colorSection).toBeInTheDocument();
  });

  it('shows typography examples', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Typography section
    const typographySection = screen.queryByText(/Typography|Heading|Text/i);
    expect(typographySection).toBeInTheDocument();
  });

  it('has navigation between component sections', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Should have navigation or links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders with proper layout structure', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Proper page structure
    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('displays component variants', () => {
    renderWithRouter(<DesignSystemShowcase />);
    
    // Showcases should display component variants
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
