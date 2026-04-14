import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

const THEME_STORAGE_KEY = 'tailwindspark:theme-preference';

const TestComponent = () => {
  const { themeId, mode, isDark, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme-id">{themeId}</span>
      <span data-testid="theme-mode">{mode}</span>
      <span data-testid="theme-state">{isDark ? 'dark' : 'light'}</span>
      <button data-testid="toggle-mode" onClick={toggleTheme}>
        Toggle Mode
      </button>
      <button data-testid="set-minimal" onClick={() => setTheme('minimal')}>
        Set Minimal
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  let store: Record<string, string>;

  beforeEach(() => {
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
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-mode');

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('provides the default material light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-id')).toHaveTextContent('material');
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    expect(screen.getByTestId('theme-state')).toHaveTextContent('light');
  });

  it('toggles between light and dark modes', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByTestId('toggle-mode'));

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme-mode', 'dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('switches the active named theme', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByTestId('set-minimal'));

    expect(screen.getByTestId('theme-id')).toHaveTextContent('minimal');
    expect(document.documentElement).toHaveAttribute('data-theme', 'minimal');
  });

  it('restores a stored named theme preference', async () => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        themeId: 'brutalist',
        mode: 'dark',
        source: 'stored',
        version: 2,
      })
    );

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-id')).toHaveTextContent('brutalist');
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    });
  });

  it('migrates the legacy light or dark preference key', async () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
      expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? '{}')).toMatchObject({
        themeId: 'material',
        mode: 'dark',
      });
    });
  });

  it('falls back to the default theme when stored theme id is invalid', async () => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        themeId: 'unknown-theme',
        mode: 'dark',
        source: 'stored',
        version: 2,
      })
    );

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-id')).toHaveTextContent('material');
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    });
  });

  it('falls back to a safe default mode when stored mode is invalid', async () => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        themeId: 'minimal',
        mode: 'sepia',
        source: 'stored',
        version: 2,
      })
    );

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-id')).toHaveTextContent('material');
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    });
  });
});

describe('useTheme', () => {
  it('throws error when used outside ThemeProvider', () => {
    const TestComponentWithoutProvider = () => {
      useTheme();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('returns theme context when used within provider', () => {
    const TestComponentWithHook = () => {
      const context = useTheme();
      return (
        <div>
          <span data-testid="theme-id-type">{typeof context.themeId}</span>
          <span data-testid="set-theme-type">{typeof context.setTheme}</span>
          <span data-testid="set-mode-type">{typeof context.setMode}</span>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponentWithHook />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-id-type')).toHaveTextContent('string');
    expect(screen.getByTestId('set-theme-type')).toHaveTextContent('function');
    expect(screen.getByTestId('set-mode-type')).toHaveTextContent('function');
  });
});