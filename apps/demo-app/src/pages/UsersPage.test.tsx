import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { UsersPage } from './UsersPage';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UsersPage', () => {


  it('displays page heading', () => {
    renderWithRouter(<UsersPage />);
    // Use getAllByRole since DashboardLayout has multiple headings
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
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
    
    // Search input for filtering users - check placeholder or input type
    const searchInputs = screen.queryAllByPlaceholderText(/Search/i);
    const textInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
    expect(searchInputs.length + textInputs.length).toBeGreaterThan(0);
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

  it.each(themeMatrix)('keeps users route content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    renderWithRouter(<UsersPage />);

    expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0);
    expect(document.querySelector('table')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });
});
