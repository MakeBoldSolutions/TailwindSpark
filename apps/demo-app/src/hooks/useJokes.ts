import { useCallback, useEffect, useState } from 'react';
import {
  addToJokeHistory,
  deleteSavedJoke,
  getJokeHistory,
  getLikedJokes,
  getRandomJoke,
  getSavedJokes,
  saveJoke,
  toggleLikeJoke,
} from '../services/joke.service';
import type { Joke } from '../types/joke-api';

interface UseJokesReturn {
  currentJoke: Joke | null;
  savedJokes: Joke[];
  likedJokeIds: number[];
  history: Joke[];
  loading: boolean;
  error: string | null;
  fetchNewJoke: () => Promise<void>;
  handleSave: (joke: Joke) => void;
  handleDelete: (jokeId: number) => void;
  handleLike: (jokeId: number) => void;
}

/**
 * Manages joke fetching, history, and saved state for the joke app.
 *
 * @returns Joke state and user actions
 */
export function useJokes(): UseJokesReturn {
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [savedJokes, setSavedJokes] = useState<Joke[]>(() => getSavedJokes());
  const [likedJokeIds, setLikedJokeIds] = useState<number[]>(() => getLikedJokes());
  const [history, setHistory] = useState<Joke[]>(() => getJokeHistory());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRandomJoke()
      .then(joke => {
        setCurrentJoke(joke);
        addToJokeHistory(joke);
        setHistory(getJokeHistory());
      })
      .catch(() => setError('Failed to fetch a joke. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const fetchNewJoke = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const joke = await getRandomJoke();
      setCurrentJoke(joke);
      addToJokeHistory(joke);
      setHistory(getJokeHistory());
    } catch {
      setError('Failed to fetch a joke. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = useCallback((joke: Joke) => {
    saveJoke(joke);
    setSavedJokes(getSavedJokes());
  }, []);

  const handleDelete = useCallback((jokeId: number) => {
    deleteSavedJoke(jokeId);
    setSavedJokes(getSavedJokes());
  }, []);

  const handleLike = useCallback((jokeId: number) => {
    toggleLikeJoke(jokeId);
    setLikedJokeIds(getLikedJokes());
  }, []);

  return {
    currentJoke,
    savedJokes,
    likedJokeIds,
    history,
    loading,
    error,
    fetchNewJoke,
    handleSave,
    handleDelete,
    handleLike,
  };
}
