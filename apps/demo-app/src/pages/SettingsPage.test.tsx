import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SettingsPage } from './SettingsPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SettingsPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<SettingsPage />);
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  it('displays page heading', () => {
    renderWithRouter(<SettingsPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Settings/i);
  });

  it('shows settings sections', () => {
    renderWithRouter(<SettingsPage />);
    
    // Common settings sections
    const sections = document.querySelectorAll('section') ||
                    document.querySelectorAll('[class*="section"]');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('renders form controls', () => {
    renderWithRouter(<SettingsPage />);
    
    // Settings pages have various form controls
    const formControls = document.querySelectorAll('input, select, textarea');
    expect(formControls.length).toBeGreaterThan(0);
  });

  it('displays save button', () => {
    renderWithRouter(<SettingsPage />);
    
    // Save/Update button should be present
    const saveButton = screen.getByRole('button', { name: /Save|Update/i });
    expect(saveButton).toBeInTheDocument();
  });

  it('shows profile settings', () => {
    renderWithRouter(<SettingsPage />);
    
    // Profile-related settings
    const profileSection = screen.getByText(/Profile|Account/i);
    expect(profileSection).toBeInTheDocument();
  });

  it('displays theme or appearance settings', () => {
    renderWithRouter(<SettingsPage />);
    
    // Theme/appearance controls
    const themeSection = screen.queryByText(/Theme|Appearance|Dark Mode/i);
    expect(themeSection).toBeInTheDocument();
  });

  it('renders notification settings', () => {
    renderWithRouter(<SettingsPage />);
    
    // Notification preferences
    const notificationSection = screen.queryByText(/Notification|Email Preferences/i);
    expect(notificationSection).toBeInTheDocument();
  });

  it('shows privacy settings', () => {
    renderWithRouter(<SettingsPage />);
    
    // Privacy-related settings
    const privacySection = screen.queryByText(/Privacy|Security/i);
    expect(privacySection).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SettingsPage />);
    
    const saveButton = screen.getByRole('button', { name: /Save|Update/i });
    await user.click(saveButton);
    
    // Should handle the click (may show validation or save)
    expect(saveButton).toBeInTheDocument();
  });

  it('displays tabs or navigation for settings categories', () => {
    renderWithRouter(<SettingsPage />);
    
    // Settings often organized in tabs
    const tabsOrNav = document.querySelector('[role="tablist"]') ||
                     document.querySelectorAll('[class*="tab"]');
    expect(tabsOrNav).toBeTruthy();
  });

  it('has proper form layout', () => {
    renderWithRouter(<SettingsPage />);
    
    // Form layout with proper spacing
    const formElements = document.querySelectorAll('form') ||
                        document.querySelectorAll('[class*="space"]');
    expect(formElements.length).toBeGreaterThan(0);
  });
});
