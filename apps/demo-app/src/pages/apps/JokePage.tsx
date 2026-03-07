import { useEffect, useState } from 'react';
import { useSEO } from '../../contexts/SEOContext';
import { useJokes } from '../../hooks/useJokes';
import JokeCard from '../../sections/JokeCard';

type Tab = 'current' | 'saved' | 'history';

/**
 * Renders the programming joke generator page.
 *
 * @returns Joke app page
 */
function JokePage() {
  const { setSEO } = useSEO();
  const {
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
  } = useJokes();
  const [tab, setTab] = useState<Tab>('current');

  useEffect(() => {
    setSEO({
      title: 'Joke Generator - TailwindSpark',
      description: 'Get random programming jokes. Like, save, and share your favorites.',
    });
  }, [setSEO]);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'current', label: 'Current Joke' },
    { key: 'saved', label: 'Saved', count: savedJokes.length },
    { key: 'history', label: 'History', count: history.length },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-text">Joke Generator</h1>
        <p className="text-text-muted">
          Random programming jokes powered by JokeAPI
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-surface-alt p-1" role="tablist">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === key
                ? 'bg-surface text-text shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {label}
            {count !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Current Joke Tab */}
      {tab === 'current' && (
        <div className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            </div>
          ) : currentJoke ? (
            <JokeCard
              joke={currentJoke}
              isLiked={likedJokeIds.includes(currentJoke.id)}
              isSaved={savedJokes.some(j => j.id === currentJoke.id)}
              onLike={handleLike}
              onSave={handleSave}
            />
          ) : null}

          <div className="flex justify-center">
            <button
              onClick={fetchNewJoke}
              disabled={loading}
              className="rounded-lg bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand/90 disabled:opacity-50"
            >
              {loading ? 'Loading...' : '🎲 Get New Joke'}
            </button>
          </div>
        </div>
      )}

      {/* Saved Jokes Tab */}
      {tab === 'saved' && (
        <div className="space-y-4">
          {savedJokes.length === 0 ? (
            <p className="py-12 text-center text-text-muted">
              No saved jokes yet. Save a joke you like!
            </p>
          ) : (
            savedJokes.map(joke => (
              <JokeCard
                key={joke.id}
                joke={joke}
                isLiked={likedJokeIds.includes(joke.id)}
                isSaved={true}
                onLike={handleLike}
                onSave={handleSave}
                onDelete={handleDelete}
                showDeleteBtn
              />
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="py-12 text-center text-text-muted">
              No joke history yet. Fetch a joke to get started!
            </p>
          ) : (
            history.map(joke => (
              <JokeCard
                key={joke.id}
                joke={joke}
                isLiked={likedJokeIds.includes(joke.id)}
                isSaved={savedJokes.some(j => j.id === joke.id)}
                onLike={handleLike}
                onSave={handleSave}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default JokePage;
