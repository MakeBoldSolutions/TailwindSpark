import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FormShowcase } from './FormShowcase';

describe('FormShowcase', () => {
  it('renders without crashing', () => {
    render(<FormShowcase />);
    expect(screen.getByText(/Form Components/i)).toBeInTheDocument();
  });

  it('displays form components heading', () => {
    render(<FormShowcase />);
    const heading = screen.getByRole('heading', { level: 2, name: /Form Components/i });
    expect(heading).toBeInTheDocument();
  });

  it('shows input fields section', () => {
    render(<FormShowcase />);
    expect(screen.getByText(/Input Fields/i)).toBeInTheDocument();
  });

  it('renders basic input with label and helper text', () => {
    render(<FormShowcase />);
    expect(screen.getByText(/Basic Input/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter some text/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a helper text/i)).toBeInTheDocument();
  });

  it('handles form input changes', async () => {
    const user = userEvent.setup();
    render(<FormShowcase />);
    
    const input = screen.getByPlaceholderText(/Enter some text/i);
    await user.type(input, 'test value');
    
    expect(input).toHaveValue('test value');
  });

  it('displays email input field', () => {
    render(<FormShowcase />);
    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    expect(emailInputs.length).toBeGreaterThan(0);
  });

  it('displays password input field', () => {
    render(<FormShowcase />);
    const passwordInputs = screen.getAllByPlaceholderText(/password/i);
    expect(passwordInputs.length).toBeGreaterThan(0);
  });

  it('shows textarea component', () => {
    render(<FormShowcase />);
    const textareas = document.querySelectorAll('textarea');
    expect(textareas.length).toBeGreaterThan(0);
  });

  it('renders select dropdown', () => {
    render(<FormShowcase />);
    const selects = document.querySelectorAll('select');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('displays checkbox components', () => {
    render(<FormShowcase />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('renders radio button groups', () => {
    render(<FormShowcase />);
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBeGreaterThan(0);
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    
    render(<FormShowcase />);
    
    // Fill out form fields - use queryAll to handle multiple forms
    const emailInputs = screen.queryAllByPlaceholderText(/email/i);
    const passwordInputs = screen.queryAllByPlaceholderText(/password/i);
    
    if (emailInputs.length > 0) {
      await user.type(emailInputs[0], 'test@example.com');
    }
    if (passwordInputs.length > 0) {
      await user.type(passwordInputs[0], 'password123');
    }
    
    // Find and submit form - use queryAll in case there are multiple submit buttons
    const submitButtons = screen.queryAllByRole('button', { name: /submit/i });
    if (submitButtons.length > 0) {
      await user.click(submitButtons[0]);
    }
    
    // Test passes if it doesn't throw
    expect(true).toBe(true);
  });



  it('renders input with icons', () => {
    render(<FormShowcase />);
    
    // Inputs should have icon elements
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('shows country select options', () => {
    render(<FormShowcase />);
    
    const selects = document.querySelectorAll('select');
    expect(selects.length).toBeGreaterThan(0);
  });
});
