import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SEOProvider } from '../../contexts/SEOContext';
import JokePage from './JokePage';

const themeMatrix = [
  ['material', 'light'],
  ['minimal', 'dark'],
  ['brutalist', 'light'],
] as const;

const mockJoke = {
  id: 42,
  category: 'Programming',
  type: 'single',
  joke: 'Why do Java devs wear glasses? Because they can\'t C#',
  setup: undefined,
  delivery: undefined,
  lang: 'en',
  safe: true,
  flags: { nsfw: false, religious: false, political: false, racist: false, sexist: false, explicit: false },
};

const mockFetchNewJoke = vi.fn();
const mockHandleSave = vi.fn();
const mockHandleDelete = vi.fn();
const mockHandleLike = vi.fn();

vi.mock('../../hooks/useJokes', () => ({
  useJokes: () => ({
    currentJoke: mockJoke,
    savedJokes: [mockJoke],
    likedJokeIds: [42],
    history: [mockJoke],
    loading: false,
    error: null,
    fetchNewJoke: mockFetchNewJoke,
    handleSave: mockHandleSave,
    handleDelete: mockHandleDelete,
    handleLike: mockHandleLike,
  }),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <SEOProvider>
        <JokePage />
      </SEOProvider>
    </BrowserRouter>,
  );

describe('JokePage', () => {
  it('renders heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /Joke Generator/i })).toBeInTheDocument();
  });

  it('shows tabs', () => {
    renderPage();
    expect(screen.getByRole('tab', { name: /Current Joke/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Saved/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /History/i })).toBeInTheDocument();
  });

  it('has Get New Joke button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Get New Joke/i })).toBeInTheDocument();
  });

  it('calls fetchNewJoke on button click', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Get New Joke/i }));
    expect(mockFetchNewJoke).toHaveBeenCalled();
  });

  it('switches to saved tab', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('tab', { name: /Saved/i }));
    // The saved tab should be selected
    expect(screen.getByRole('tab', { name: /Saved/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches to history tab', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('tab', { name: /History/i }));
    expect(screen.getByRole('tab', { name: /History/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders without critical axe violations', async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it.each(themeMatrix)('keeps joke route content available under %s %s mode', (themeId, mode) => {
    document.documentElement.dataset.theme = themeId;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: /Joke Generator/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get New Joke/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Current Joke/i })).toBeInTheDocument();
  });
});
