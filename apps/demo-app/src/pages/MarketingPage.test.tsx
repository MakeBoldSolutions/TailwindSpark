import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';
import { MarketingPage } from './MarketingPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </ThemeProvider>
  );
};

describe('MarketingPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<MarketingPage />);
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('displays marketing layout', () => {
    renderWithRouter(<MarketingPage />);
    
    // Marketing pages typically have hero sections
    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('renders hero section', () => {
    renderWithRouter(<MarketingPage />);
    
    // Look for hero-related elements
    const heroSection = document.querySelector('[class*="hero"]') || 
                        document.querySelector('section');
    expect(heroSection).toBeInTheDocument();
  });

  it('displays call-to-action buttons', () => {
    renderWithRouter(<MarketingPage />);
    
    // Marketing pages should have CTA buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows feature highlights', () => {
    renderWithRouter(<MarketingPage />);
    
    // Feature sections are common in marketing pages
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('renders with proper grid layouts', () => {
    renderWithRouter(<MarketingPage />);
    
    // Marketing pages use grid layouts for features
    const gridElements = document.querySelectorAll('[class*="grid"]');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('displays navigation header', () => {
    renderWithRouter(<MarketingPage />);
    
    // Should have a header/navigation
    const header = document.querySelector('header') || document.querySelector('nav');
    expect(header).toBeInTheDocument();
  });

  it('shows footer section', () => {
    renderWithRouter(<MarketingPage />);
    
    // Marketing pages typically have footers
    const footer = document.querySelector('footer') || 
                   document.querySelector('[class*="footer"]');
    expect(footer).toBeInTheDocument();
  });

  it('has responsive design classes', () => {
    renderWithRouter(<MarketingPage />);
    
    // Check for responsive utility classes
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('renders marketing content sections', () => {
    renderWithRouter(<MarketingPage />);
    
    // Marketing pages have multiple content sections
    const contentSections = document.querySelectorAll('section, div[class*="section"]');
    expect(contentSections.length).toBeGreaterThan(0);
  });
});
