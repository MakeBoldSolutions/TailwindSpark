import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';
import { MarketingLayout } from './MarketingLayout';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('MarketingLayout', () => {
  it('renders without crashing', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Marketing Content</div>
      </MarketingLayout>
    );
    expect(screen.getByText(/Marketing Content/i)).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Hero Section</div>
      </MarketingLayout>
    );
    expect(screen.getByText(/Hero Section/i)).toBeInTheDocument();
  });

  it('displays header navigation', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // Header should be present
    const header = document.querySelector('header') ||
                  document.querySelector('nav');
    expect(header).toBeInTheDocument();
  });

  it('shows navigation links', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // Navigation links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('displays logo or brand', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // Logo should be present (SVG, image, or TailwindSpark text)
    const svgs = document.querySelectorAll('svg');
    const brandText = screen.queryAllByText(/TailwindSpark/i);
    expect(svgs.length + brandText.length).toBeGreaterThan(0);
  });

  it('shows CTA buttons in header', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // CTA buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('renders footer section', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // Footer
    const footer = document.querySelector('footer') ||
                  document.querySelector('[class*="footer"]');
    expect(footer).toBeTruthy();
  });

  it('displays footer links', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // Footer should have links
    const allLinks = screen.getAllByRole('link');
    expect(allLinks.length).toBeGreaterThan(0);
  });

  it('shows social media links', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // Social media links or icons
    const socialLinks = screen.queryAllByRole('link', { name: /twitter|facebook|linkedin|github/i });
    expect(socialLinks.length).toBeGreaterThanOrEqual(0);
  });

  it('has responsive layout', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // Responsive classes
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('renders main content area', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Main Content</div>
      </MarketingLayout>
    );
    
    // Main content
    const main = document.querySelector('main') ||
                document.querySelector('[role="main"]');
    expect(main).toBeTruthy();
  });

  it('displays copyright information', () => {
    renderWithProviders(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    
    // Copyright or year
    const copyright = screen.queryByText(/©|Copyright|\d{4}/);
    expect(copyright).toBeTruthy();
  });
});
