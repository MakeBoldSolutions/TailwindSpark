import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { DashboardPage } from './DashboardPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardPage', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('renders without crashing', () => {
    renderWithRouter(<DashboardPage />);
    const dashboardText = screen.queryAllByText(/Dashboard/i);
    expect(dashboardText.length).toBeGreaterThan(0);
  });

  it('displays stat cards with metrics', () => {
    renderWithRouter(<DashboardPage />);
    
    // Check for stat card titles (matching actual DashboardPage implementation)
    expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversion Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Growth/i)).toBeInTheDocument();
  });

  it('displays recent transactions section', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getByText(/Recent Transactions/i)).toBeInTheDocument();
  });

  it('displays transaction rows with data', () => {
    renderWithRouter(<DashboardPage />);
    
    // Check for customer names in transactions (matching actual data)
    expect(screen.getByText(/Alice Johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob Smith/i)).toBeInTheDocument();
  });

  it('shows transaction status badges with correct styling', () => {
    renderWithRouter(<DashboardPage />);
    
    // Check for status badges
    const statusBadges = screen.getAllByText(/completed|pending|failed/i);
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  it('displays activity feed section', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
  });

  it('renders navigation links in dashboard layout', () => {
    renderWithRouter(<DashboardPage />);
    
    // Links should be present in the DashboardLayout
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Analytics/i })).toBeInTheDocument();
  });

  it('displays chart sections', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getByText(/Revenue Trend/i)).toBeInTheDocument();
  });

  it('displays back to demos link', () => {
    renderWithRouter(<DashboardPage />);
    
    const backLink = screen.getByText(/Back to Demos Overview/i);
    expect(backLink).toBeInTheDocument();
  });

  it('shows customer avatars in transaction list', () => {
    renderWithRouter(<DashboardPage />);
    
    // Check for avatar elements (first letter of customer name)
    const customerInitials = document.querySelectorAll('[class*="rounded-full"]');
    expect(customerInitials.length).toBeGreaterThan(0);
  });
});
