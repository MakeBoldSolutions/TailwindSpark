import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithA11yTest, testA11y, testAriaAttributes, testKeyboardNavigation } from '../test/a11y-utils';
import { Button } from './Button';

const themeMatrix = [
  ['material', 'light'],
  ['material', 'dark'],
  ['minimal', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
  ['brutalist', 'dark'],
] as const;

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it.each(themeMatrix)(
    'uses semantic theme token classes for %s %s mode',
    (themeId, mode) => {
      document.documentElement.dataset.theme = themeId;
      document.documentElement.dataset.themeMode = mode;
      document.documentElement.classList.toggle('dark', mode === 'dark');

      render(<Button variant="primary">Themed Button</Button>);
      const button = screen.getByRole('button', { name: 'Themed Button' });

      expect(button).toHaveClass(
        'rounded-control',
        'bg-[var(--button-primary-bg)]',
        'text-[var(--button-primary-fg)]',
        'hover:bg-[var(--button-primary-bg-hover)]',
        'shadow-button'
      );
    }
  );

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      await renderWithA11yTest(<Button>Accessible Button</Button>);
    });

    it('should have correct ARIA attributes when disabled', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      
      testAriaAttributes(button, {
        'aria-disabled': 'true',
      });
      
      await testA11y(container);
    });

    it('should be keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard Test</Button>);
      const button = screen.getByRole('button');
      
      // Test that button is focusable
      button.focus();
      expect(button).toHaveFocus();
      
      // Test keyboard activation
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      
      // Button should respond to Enter and Space keys when clicked via keyboard
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should support custom aria-label', async () => {
      const { container } = render(
        <Button aria-label="Close dialog">×</Button>
      );
      const button = screen.getByRole('button');
      
      testAriaAttributes(button, {
        'aria-label': 'Close dialog',
      });
      
      await testA11y(container);
    });

    it('should be discoverable by keyboard navigation', () => {
      const { container } = render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
          <Button disabled>Disabled</Button>
        </div>
      );
      
      const focusableElements = testKeyboardNavigation(container, 3);
      expect(focusableElements).toHaveLength(3);
      
      // Disabled button should still be in tab order but not clickable
      expect(focusableElements[2]).toBeDisabled();
    });
  });
});
