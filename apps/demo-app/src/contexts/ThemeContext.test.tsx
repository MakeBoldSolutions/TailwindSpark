import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

// Test component to consume the theme context
const TestComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-status">{isDark ? 'dark' : 'light'}</span>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Clear localStorage before each test
    localStorage.clear();
    store = {};
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => store[key] ?? null);
    vi.mocked(localStorage.setItem).mockImplementation((key: string, value: string) => {
      store[key] = value;
    });
    vi.mocked(localStorage.removeItem).mockImplementation((key: string) => {
      delete store[key];
    });
    vi.mocked(localStorage.clear).mockImplementation(() => {
      store = {};
    });
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Reset document class list
    document.documentElement.className = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('provides default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('toggles theme when toggleTheme is called', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeStatus = screen.getByTestId('theme-status');
    const toggleButton = screen.getByTestId('toggle-theme');

    // Initially light
    expect(themeStatus).toHaveTextContent('light');

    // Toggle to dark
    await user.click(toggleButton);
    expect(themeStatus).toHaveTextContent('dark');

    // Toggle back to light
    await user.click(toggleButton);
    expect(themeStatus).toHaveTextContent('light');
  });

  it('adds and removes dark class from document root', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');

    // Initially no dark class
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to dark
    await user.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle back to light
    await user.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('uses system preference when no saved theme exists', () => {
    // Mock system dark mode preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('persists theme selection across remounts using localStorage', async () => {
    const user = userEvent.setup();

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByTestId('toggle-theme'));

    await waitFor(() => {
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    unmount();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });
});

describe('useTheme', () => {
  it('throws error when used outside ThemeProvider', () => {
    const TestComponentWithoutProvider = () => {
      useTheme();
      return <div>Test</div>;
    };

    // Expect the component to throw an error
    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('returns theme context when used within provider', () => {
    const TestComponentWithHook = () => {
      const context = useTheme();
      return (
        <div>
          <span data-testid="context-type">{typeof context.isDark}</span>
          <span data-testid="toggle-type">{typeof context.toggleTheme}</span>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponentWithHook />
      </ThemeProvider>
    );

    expect(screen.getByTestId('context-type')).toHaveTextContent('boolean');
    expect(screen.getByTestId('toggle-type')).toHaveTextContent('function');
  });
});