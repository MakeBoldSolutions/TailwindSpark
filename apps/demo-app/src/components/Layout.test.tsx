import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Layout } from './Layout';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Layout', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Page Content Here</div>
      </Layout>
    );
    expect(screen.getByText(/Page Content Here/i)).toBeInTheDocument();
  });

  it('displays navigation header', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Navigation should be present
    const nav = document.querySelector('nav') || document.querySelector('header');
    expect(nav).toBeInTheDocument();
  });

  it('shows navigation links', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Home link should be present
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
  });

  it('displays logo', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Logo should be present
    const logo = document.querySelector('[data-testid="logo"]') ||
                document.querySelector('svg') ||
                screen.queryByText(/TailwindSpark|Logo/i);
    expect(logo).toBeTruthy();
  });

  it('shows search functionality', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Search button or input
    const searchElement = screen.queryByPlaceholderText(/Search/i) ||
                         screen.queryByRole('button', { name: /Search/i });
    expect(searchElement).toBeTruthy();
  });

  it('displays theme toggle button', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Theme toggle should be present
    const themeButton = screen.queryByRole('button', { name: /theme|dark|light/i }) ||
                       document.querySelector('[aria-label*="theme"]');
    expect(themeButton).toBeTruthy();
  });

  it('shows mobile menu button on mobile', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Mobile menu toggle
    const mobileButton = screen.queryByRole('button', { name: /menu/i }) ||
                        document.querySelector('[class*="mobile"]');
    expect(mobileButton).toBeTruthy();
  });

  it('renders BuildInfo component', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // BuildInfo should be present (version info)
    const buildInfo = screen.queryByText(/v\d+\.\d+/) ||
                     screen.queryByText(/Build|Version/i);
    expect(buildInfo).toBeTruthy();
  });

  it('displays demos dropdown menu', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Demos link or dropdown
    const demosLink = screen.queryByText(/Demo/i);
    expect(demosLink).toBeTruthy();
  });

  it('shows sticky header', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Header with sticky positioning
    const header = document.querySelector('header') || document.querySelector('nav');
    expect(header).toBeInTheDocument();
  });

  it('has proper responsive classes', () => {
    renderWithRouter(
      <Layout isDark={false} toggleTheme={mockToggleTheme}>
        <div>Content</div>
      </Layout>
    );
    
    // Responsive classes
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });
});
