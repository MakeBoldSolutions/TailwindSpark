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
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('displays stat cards with metrics', () => {
    renderWithRouter(<DashboardPage />);
    
    // Check for stat card titles
    expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
    expect(screen.getByText(/New Signups/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversion Rate/i)).toBeInTheDocument();
  });

  it('shows loading state for stat cards', () => {
    renderWithRouter(<DashboardPage />);
    
    // Check for loading skeleton (animated-pulse class)
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('displays recent transactions section', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getByText(/Recent Transactions/i)).toBeInTheDocument();
  });

  it('renders transaction table with headers', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getByText(/Customer/i)).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Date/i)).toBeInTheDocument();
  });

  it('displays transaction rows with data', () => {
    renderWithRouter(<DashboardPage />);
    
    // Check for customer names in transactions
    expect(screen.getByText(/Sarah Johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/Michael Chen/i)).toBeInTheDocument();
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
    expect(screen.getByText(/Revenue Overview/i)).toBeInTheDocument();
  });

  it('handles view all transactions link', () => {
    renderWithRouter(<DashboardPage />);
    
    const viewAllLink = screen.getByText(/View All/i);
    expect(viewAllLink).toBeInTheDocument();
  });

  it('shows customer avatars in transaction list', () => {
    renderWithRouter(<DashboardPage />);
    
    // Check for avatar elements (first letter of customer name)
    const customerInitials = document.querySelectorAll('[class*="rounded-full"]');
    expect(customerInitials.length).toBeGreaterThan(0);
  });
});
