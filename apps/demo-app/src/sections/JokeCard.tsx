import { useState } from 'react';
import type { Joke } from '../types/joke-api';

interface JokeCardProps {
  joke: Joke;
  isLiked: boolean;
  isSaved: boolean;
  onLike: (id: number) => void;
  onSave: (joke: Joke) => void;
  onDelete?: (id: number) => void;
  showDeleteBtn?: boolean;
}

export default function JokeCard({
  joke,
  isLiked,
  isSaved,
  onLike,
  onSave,
  onDelete,
  showDeleteBtn = false,
}: JokeCardProps) {
  const [showExplain, setShowExplain] = useState(false);

  const handleShare = () => {
    const text =
      joke.type === 'single' ? joke.joke : `${joke.setup}\n\n${joke.delivery}`;
    if (navigator.share) {
      navigator.share({ title: 'Programming Joke', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-sm transition hover:shadow-md">
      <span className="mb-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
        {joke.category}
      </span>

      {joke.type === 'single' ? (
        <p className="text-lg leading-relaxed text-text">{joke.joke}</p>
      ) : (
        <>
          <p className="mb-3 text-lg font-medium text-text">{joke.setup}</p>
          <p className="text-lg italic text-brand">{joke.delivery}</p>
        </>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onLike(joke.id)}
          aria-label={isLiked ? 'Unlike joke' : 'Like joke'}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            isLiked
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-surface-alt text-text-muted hover:bg-brand/10 hover:text-brand'
          }`}
        >
          {isLiked ? '❤️ Liked' : '🤍 Like'}
        </button>

        {!showDeleteBtn && (
          <button
            onClick={() => onSave(joke)}
            disabled={isSaved}
            aria-label={isSaved ? 'Already saved' : 'Save joke'}
            className="rounded-md bg-surface-alt px-3 py-1.5 text-sm font-medium text-text-muted transition hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaved ? '✅ Saved' : '💾 Save'}
          </button>
        )}

        <button
          onClick={handleShare}
          aria-label="Share joke"
          className="rounded-md bg-surface-alt px-3 py-1.5 text-sm font-medium text-text-muted transition hover:bg-brand/10 hover:text-brand"
        >
          📤 Share
        </button>

        <button
          onClick={() => setShowExplain(prev => !prev)}
          aria-label={showExplain ? 'Hide explanation' : 'Explain joke'}
          className="rounded-md bg-surface-alt px-3 py-1.5 text-sm font-medium text-text-muted transition hover:bg-brand/10 hover:text-brand"
        >
          {showExplain ? '🔽 Hide' : '💡 Explain'}
        </button>

        {showDeleteBtn && onDelete && (
          <button
            onClick={() => onDelete(joke.id)}
            aria-label="Remove saved joke"
            className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            🗑️ Remove
          </button>
        )}
      </div>

      {showExplain && (
        <div className="mt-4 rounded-lg border border-border bg-surface-alt p-4">
          <h4 className="mb-2 text-sm font-semibold text-text">💡 Why it&apos;s funny</h4>
          <p className="text-sm text-text-muted">
            {joke.type === 'twopart'
              ? `This joke uses a setup-punchline structure. The setup "${joke.setup}" creates an expectation, and the delivery "${joke.delivery}" subverts it with an unexpected twist — a classic comedy technique.`
              : `This is a one-liner joke in the "${joke.category}" category that plays on programming concepts or stereotypes developers commonly encounter.`}
          </p>
        </div>
      )}
    </div>
  );
}
