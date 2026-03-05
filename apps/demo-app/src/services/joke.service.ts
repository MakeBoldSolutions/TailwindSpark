import type { Joke } from '../types/joke-api';
import { JOKE_API_CONFIG, JokeSchema, SAVED_JOKES_CONFIG } from '../types/joke-api';

export async function getRandomJoke(): Promise<Joke> {
  try {
    const params = new URLSearchParams({
      safe: 'true',
      format: 'json',
      lang: 'en',
    });
    const response = await fetch(`${JOKE_API_CONFIG.FULL_URL}?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (json.error) throw new Error(json.message || 'API error');
    return JokeSchema.parse(json);
  } catch {
    return JOKE_API_CONFIG.FALLBACK_JOKE as Joke;
  }
}

export function getSavedJokes(): Joke[] {
  try {
    const raw = localStorage.getItem(SAVED_JOKES_CONFIG.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveJoke(joke: Joke): void {
  const saved = getSavedJokes();
  if (!saved.some(j => j.id === joke.id)) {
    saved.unshift(joke);
    if (saved.length > SAVED_JOKES_CONFIG.MAX_SAVED) saved.pop();
    localStorage.setItem(SAVED_JOKES_CONFIG.STORAGE_KEY, JSON.stringify(saved));
  }
}

export function deleteSavedJoke(jokeId: number): void {
  const saved = getSavedJokes().filter(j => j.id !== jokeId);
  localStorage.setItem(SAVED_JOKES_CONFIG.STORAGE_KEY, JSON.stringify(saved));
}

export function getLikedJokes(): number[] {
  try {
    const raw = localStorage.getItem(SAVED_JOKES_CONFIG.LIKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleLikeJoke(jokeId: number): boolean {
  const liked = getLikedJokes();
  const index = liked.indexOf(jokeId);
  if (index === -1) {
    liked.push(jokeId);
  } else {
    liked.splice(index, 1);
  }
  localStorage.setItem(SAVED_JOKES_CONFIG.LIKED_KEY, JSON.stringify(liked));
  return index === -1;
}

export function getJokeHistory(): Joke[] {
  try {
    const raw = localStorage.getItem(SAVED_JOKES_CONFIG.HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToJokeHistory(joke: Joke): void {
  const history = getJokeHistory().filter(j => j.id !== joke.id);
  history.unshift(joke);
  if (history.length > SAVED_JOKES_CONFIG.MAX_HISTORY) history.pop();
  localStorage.setItem(SAVED_JOKES_CONFIG.HISTORY_KEY, JSON.stringify(history));
}
