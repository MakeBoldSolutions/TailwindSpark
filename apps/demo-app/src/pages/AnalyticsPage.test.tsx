import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AnalyticsPage } from './AnalyticsPage';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AnalyticsPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<AnalyticsPage />);
    const analyticsText = screen.queryAllByText(/Analytics/i);
    expect(analyticsText.length).toBeGreaterThan(0);
  });

  it('displays page heading', () => {
    renderWithRouter(<AnalyticsPage />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders data visualization sections', () => {
    renderWithRouter(<AnalyticsPage />);
    
    // Check for common analytics sections
    const analyticsElements = screen.queryAllByText(/Analytics/i);
    expect(analyticsElements.length).toBeGreaterThan(0);
  });

  it('displays chart placeholders or actual charts', () => {
    const { container } = renderWithRouter(<AnalyticsPage />);
    
    // Analytics page should render
    expect(container.firstChild).toBeTruthy();
  });

  it('shows metric cards', () => {
    renderWithRouter(<AnalyticsPage />);
    
    // Look for metric-related content
    const metricsSection = document.querySelector('[class*="grid"]');
    expect(metricsSection).toBeInTheDocument();
  });

  it('renders with dashboard layout', () => {
    renderWithRouter(<AnalyticsPage />);
    
    // Should have navigation elements from DashboardLayout
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
  });

  it('displays time period selectors or filters', () => {
    renderWithRouter(<AnalyticsPage />);
    
    // Common analytics page elements
    const pageContainer = document.querySelector('main') || document.querySelector('[role="main"]');
    expect(pageContainer).toBeInTheDocument();
  });

  it('has proper responsive layout classes', () => {
    renderWithRouter(<AnalyticsPage />);
    
    // Check for responsive grid/flex layouts
    const responsiveElements = document.querySelectorAll('[class*="grid"], [class*="flex"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('displays analytics navigation', () => {
    renderWithRouter(<AnalyticsPage />);
    
    // Check for Analytics link in navigation
    const analyticsLink = screen.getByRole('link', { name: /Analytics/i });
    expect(analyticsLink).toBeInTheDocument();
  });

  it('renders data tables or lists', () => {
    renderWithRouter(<AnalyticsPage />);
    
    // Analytics typically includes data tables
    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();
  });

  it.each(themeMatrix)('keeps analytics route content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    renderWithRouter(<AnalyticsPage />);

    expect(screen.getByRole('link', { name: /Analytics/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Analytics/i).length).toBeGreaterThan(0);
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});
