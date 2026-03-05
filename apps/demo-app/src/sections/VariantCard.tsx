import type { AIVariant } from '../types/chat-api';

interface VariantCardProps {
  variant: AIVariant;
  isSelected: boolean;
  onSelect: (variant: AIVariant) => void;
}

export default function VariantCard({ variant, isSelected, onSelect }: VariantCardProps) {
  return (
    <button
      onClick={() => onSelect(variant)}
      className={`w-full rounded-lg border p-4 text-left transition hover:shadow-md ${
        isSelected
          ? 'border-brand bg-brand/5 ring-2 ring-brand/30'
          : 'border-border bg-surface hover:border-brand/50'
      }`}
      aria-pressed={isSelected}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-text">{variant.name}</h3>
        {variant.featured && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            ⭐ Featured
          </span>
        )}
      </div>
      <p className="mb-2 text-sm text-text-muted line-clamp-2">{variant.description}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">
          {variant.category}
        </span>
        <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs text-text-muted">
          {variant.model}
        </span>
      </div>
    </button>
  );
}
