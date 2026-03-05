import { useEffect, useState } from 'react';
import { useSEO } from '../../contexts/SEOContext';
import { useVariants } from '../../hooks/useVariants';
import ChatInterface from '../../sections/ChatInterface';
import VariantCard from '../../sections/VariantCard';
import type { AIVariant } from '../../types/chat-api';

function AIChatPage() {
  const { setSEO } = useSEO();
  const {
    categories,
    loading,
    error,
    filterByCategory,
    searchVariants,
    filteredVariants,
  } = useVariants();
  const [selectedVariant, setSelectedVariant] = useState<AIVariant | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string | null>(null);

  useEffect(() => {
    setSEO({
      title: 'AI Chat - TailwindSpark',
      description: 'Chat with AI variants powered by PromptSpark in real-time.',
    });
  }, [setSEO]);

  const handleCategoryChange = (cat: string | null) => {
    setCatFilter(cat);
    filterByCategory(cat);
  };

  const handleSearchChange = (term: string) => {
    setSearch(term);
    searchVariants(term);
  };

  // Chat view when variant is selected
  if (selectedVariant) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ChatInterface
          variant={selectedVariant}
          onBack={() => setSelectedVariant(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-text">AI Chat</h1>
        <p className="text-text-muted">
          Select an AI variant to start chatting — powered by PromptSpark
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="Search variants..."
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          aria-label="Search AI variants"
        />
        <select
          value={catFilter ?? ''}
          onChange={e =>
            handleCategoryChange(
              e.target.value ? e.target.value : null,
            )
          }
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : filteredVariants.length === 0 ? (
        <p className="py-12 text-center text-text-muted">
          No variants found. Try adjusting your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVariants.map(variant => (
            <VariantCard
              key={variant.definitionId}
              variant={variant}
              isSelected={false}
              onSelect={setSelectedVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AIChatPage;
