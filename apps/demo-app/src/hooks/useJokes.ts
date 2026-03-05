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

export function useJokes(): UseJokesReturn {
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [savedJokes, setSavedJokes] = useState<Joke[]>([]);
  const [likedJokeIds, setLikedJokeIds] = useState<number[]>([]);
  const [history, setHistory] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSavedJokes(getSavedJokes());
    setLikedJokeIds(getLikedJokes());
    setHistory(getJokeHistory());
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

  useEffect(() => {
    fetchNewJoke();
  }, [fetchNewJoke]);

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
