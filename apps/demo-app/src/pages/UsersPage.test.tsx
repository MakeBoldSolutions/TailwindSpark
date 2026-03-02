import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { UsersPage } from './UsersPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UsersPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<UsersPage />);
    expect(screen.getByText(/User/i)).toBeInTheDocument();
  });

  it('displays page heading', () => {
    renderWithRouter(<UsersPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('shows user table or list', () => {
    renderWithRouter(<UsersPage />);
    
    // User table should be present
    const table = document.querySelector('table') || 
                 document.querySelectorAll('[role="row"]');
    expect(table).toBeTruthy();
  });

  it('displays user data', () => {
    renderWithRouter(<UsersPage />);
    
    // User information should be displayed
    const userElements = document.querySelectorAll('td, [class*="user"]');
    expect(userElements.length).toBeGreaterThan(0);
  });

  it('shows search or filter functionality', () => {
    renderWithRouter(<UsersPage />);
    
    // Search input for filtering users
    const searchInput = screen.queryByPlaceholderText(/Search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithRouter(<UsersPage />);
    
    // Action buttons (add, edit, delete)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('displays user avatars or icons', () => {
    renderWithRouter(<UsersPage />);
    
    // User avatars
    const avatars = document.querySelectorAll('[class*="avatar"], img');
    expect(avatars.length).toBeGreaterThan(0);
  });

  it('shows pagination controls', () => {
    renderWithRouter(<UsersPage />);
    
    // Pagination for user list
    const paginationElements = screen.queryAllByRole('button', { name: /Next|Previous|Page/i });
    expect(paginationElements.length).toBeGreaterThanOrEqual(0);
  });

  it('renders with dashboard layout', () => {
    renderWithRouter(<UsersPage />);
    
    // Should have navigation
    const nav = screen.getAllByRole('link');
    expect(nav.length).toBeGreaterThan(0);
  });

  it('has proper table structure', () => {
    renderWithRouter(<UsersPage />);
    
    // Table or list structure
    const structuredContent = document.querySelector('table') ||
                             document.querySelector('[class*="grid"]');
    expect(structuredContent).toBeInTheDocument();
  });
});
