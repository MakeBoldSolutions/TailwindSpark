import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

const themes = [
  {
    id: 'material',
    label: 'Material',
    description: 'Material theme',
    defaultMode: 'light',
    supportedModes: ['light', 'dark'],
    metadata: {
      density: 'comfortable',
      typography: 'system',
      motion: 'smooth',
      shape: 'rounded',
    },
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Minimal theme',
    defaultMode: 'light',
    supportedModes: ['light', 'dark'],
    metadata: {
      density: 'compact',
      typography: 'editorial',
      motion: 'minimal',
      shape: 'soft',
    },
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    description: 'Brutalist theme',
    defaultMode: 'dark',
    supportedModes: ['light', 'dark'],
    metadata: {
      density: 'roomy',
      typography: 'display',
      motion: 'snappy',
      shape: 'sharp',
    },
  },
] as const;

describe('ThemeToggle', () => {
  it('renders a theme selector and mode toggle', () => {
    render(
      <ThemeToggle
        themeId="material"
        mode="light"
        themes={themes}
        onThemeChange={vi.fn()}
        onModeToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox', { name: /select theme/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('shows the current selected theme', () => {
    render(
      <ThemeToggle
        themeId="minimal"
        mode="light"
        themes={themes}
        onThemeChange={vi.fn()}
        onModeToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox')).toHaveValue('minimal');
  });

  it('calls onThemeChange when a new theme is selected', async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();

    render(
      <ThemeToggle
        themeId="material"
        mode="light"
        themes={themes}
        onThemeChange={onThemeChange}
        onModeToggle={vi.fn()}
      />
    );

    await user.selectOptions(screen.getByRole('combobox'), 'brutalist');

    expect(onThemeChange).toHaveBeenCalledWith('brutalist');
  });

  it('calls onModeToggle when the mode button is clicked', async () => {
    const user = userEvent.setup();
    const onModeToggle = vi.fn();

    render(
      <ThemeToggle
        themeId="material"
        mode="dark"
        themes={themes}
        onThemeChange={vi.fn()}
        onModeToggle={onModeToggle}
      />
    );

    await user.click(screen.getByRole('button', { name: /switch to light mode/i }));

    expect(onModeToggle).toHaveBeenCalledOnce();
  });
});
