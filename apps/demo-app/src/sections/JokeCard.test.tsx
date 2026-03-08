import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Joke } from '../types/joke-api';
import JokeCard from './JokeCard';

const singleJoke: Joke = {
  id: 1,
  type: 'single',
  joke: 'Why do programmers prefer dark mode?',
  category: 'Programming',
  safe: true,
  flags: { nsfw: false, religious: false, political: false, racist: false, sexist: false, explicit: false },
};

const twoPartJoke: Joke = {
  id: 2,
  type: 'twopart',
  setup: 'Why do Java developers wear glasses?',
  delivery: "Because they can't C#",
  category: 'Programming',
  safe: true,
  flags: { nsfw: false, religious: false, political: false, racist: false, sexist: false, explicit: false },
};

const defaultProps = {
  joke: singleJoke,
  isLiked: false,
  isSaved: false,
  onLike: vi.fn(),
  onSave: vi.fn(),
};

describe('JokeCard', () => {
  it('renders single joke', () => {
    render(<JokeCard {...defaultProps} />);
    expect(screen.getByText(/Why do programmers prefer dark mode/)).toBeInTheDocument();
  });

  it('renders two-part joke', () => {
    render(<JokeCard {...defaultProps} joke={twoPartJoke} />);
    expect(screen.getByText(/Why do Java developers wear glasses/)).toBeInTheDocument();
    expect(screen.getByText(/Because they can't C#/)).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<JokeCard {...defaultProps} />);
    expect(screen.getByText('Programming')).toBeInTheDocument();
  });

  it('calls onLike when Like button clicked', async () => {
    const onLike = vi.fn();
    const user = userEvent.setup();
    render(<JokeCard {...defaultProps} onLike={onLike} />);
    await user.click(screen.getByRole('button', { name: /Like joke/i }));
    expect(onLike).toHaveBeenCalledWith(1);
  });

  it('shows liked state', () => {
    render(<JokeCard {...defaultProps} isLiked />);
    expect(screen.getByRole('button', { name: /Unlike joke/i })).toBeInTheDocument();
  });

  it('calls onSave when Save button clicked', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<JokeCard {...defaultProps} onSave={onSave} />);
    await user.click(screen.getByRole('button', { name: /Save joke/i }));
    expect(onSave).toHaveBeenCalledWith(singleJoke);
  });

  it('disables Save button when already saved', () => {
    render(<JokeCard {...defaultProps} isSaved />);
    const button = screen.getByRole('button', { name: /Already saved/i });
    expect(button).toBeDisabled();
  });

  it('renders Share button', () => {
    render(<JokeCard {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Share joke/i })).toBeInTheDocument();
  });

  it('renders Explain button', () => {
    render(<JokeCard {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Explain joke/i })).toBeInTheDocument();
  });

  it('toggles explanation on Explain click', async () => {
    const user = userEvent.setup();
    render(<JokeCard {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Explain joke/i }));
    expect(screen.getByText(/Why it's funny/i)).toBeInTheDocument();
  });

  it('renders Remove button when showDeleteBtn is true', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<JokeCard {...defaultProps} showDeleteBtn onDelete={onDelete} />);
    const btn = screen.getByRole('button', { name: /Remove saved joke/i });
    await user.click(btn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
