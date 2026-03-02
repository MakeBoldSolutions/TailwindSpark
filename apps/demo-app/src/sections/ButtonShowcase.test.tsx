import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ButtonShowcase } from './ButtonShowcase';

describe('ButtonShowcase', () => {
  it('renders without crashing', () => {
    render(<ButtonShowcase />);
    expect(screen.getByText(/Button Components/i)).toBeInTheDocument();
  });

  it('displays button components heading', () => {
    render(<ButtonShowcase />);
    const heading = screen.getByRole('heading', { level: 2, name: /Button Components/i });
    expect(heading).toBeInTheDocument();
  });

  it('shows all button variants', () => {
    render(<ButtonShowcase />);
    expect(screen.getByRole('button', { name: /Primary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Secondary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Success/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Warning/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Error/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ghost/i })).toBeInTheDocument();
  });

  it('displays all button sizes', () => {
    render(<ButtonShowcase />);
    expect(screen.getByRole('button', { name: /Small/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Medium/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Large/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Extra Large/i })).toBeInTheDocument();
  });

  it('renders buttons with icons', () => {
    render(<ButtonShowcase />);
    expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Star/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Love & Star/i })).toBeInTheDocument();
  });

  it('shows disabled button state', () => {
    render(<ButtonShowcase />);
    const disabledButton = screen.getByRole('button', { name: /Disabled/i });
    expect(disabledButton).toBeInTheDocument();
    expect(disabledButton).toBeDisabled();
  });

  it('displays loading button', () => {
    render(<ButtonShowcase />);
    const loadingButton = screen.getByRole('button', { name: /Click to Load|Loading/i });
    expect(loadingButton).toBeInTheDocument();
  });

  it('handles loading state on click', async () => {
    const user = userEvent.setup();
    vi.useFakeTimers();
    
    render(<ButtonShowcase />);
    
    const loadingButton = screen.getByRole('button', { name: /Click to Load/i });
    await user.click(loadingButton);
    
    // Button should show loading state
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    // Fast-forward timer
    await vi.runAllTimersAsync();
    
    vi.useRealTimers();
  });

  it('shows full width button', () => {
    render(<ButtonShowcase />);
    const fullWidthButton = screen.getByRole('button', { name: /Full Width Button/i });
    expect(fullWidthButton).toBeInTheDocument();
  });

  it('renders responsive button grid', () => {
    render(<ButtonShowcase />);
    
    // Check for grid layout
    const gridElements = document.querySelectorAll('[class*="grid"]');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('displays "Variants" section heading', () => {
    render(<ButtonShowcase />);
    expect(screen.getByRole('heading', { level: 3, name: /Variants/i })).toBeInTheDocument();
  });

  it('displays "Sizes" section heading', () => {
    render(<ButtonShowcase />);
    expect(screen.getByRole('heading', { level: 3, name: /Sizes/i })).toBeInTheDocument();
  });

  it('displays "With Icons" section heading', () => {
    render(<ButtonShowcase />);
    expect(screen.getByRole('heading', { level: 3, name: /With Icons/i })).toBeInTheDocument();
  });

  it('displays "States" section heading', () => {
    render(<ButtonShowcase />);
    expect(screen.getByRole('heading', { level: 3, name: /States/i })).toBeInTheDocument();
  });

  it('shows all buttons are clickable unless disabled', async () => {
    const user = userEvent.setup();
    render(<ButtonShowcase />);
    
    const primaryButton = screen.getByRole('button', { name: /^Primary$/i });
    await user.click(primaryButton);
    
    // Button should be clickable (no error thrown)
    expect(primaryButton).toBeInTheDocument();
  });

  it('renders icon elements within buttons', () => {
    render(<ButtonShowcase />);
    
    // Icons should be present
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
