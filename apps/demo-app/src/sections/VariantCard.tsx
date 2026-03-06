import type { AIVariant } from '../types/chat-api';

interface VariantCardProps {
  variant: AIVariant;
  isSelected: boolean;
  onSelect: (variant: AIVariant) => void;
  isFeatured?: boolean;
}

export default function VariantCard({ variant, isSelected, onSelect, isFeatured = false }: VariantCardProps) {
  const temp = parseFloat(variant.temperature);

  return (
    <div
      className={`flex flex-col rounded-lg border p-4 transition hover:shadow-md ${
        isSelected
          ? 'border-brand bg-brand/5 ring-2 ring-brand/30'
          : 'border-border bg-surface hover:border-brand/50'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-text">{variant.name}</h3>
        {isFeatured && (
          <span className="rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
            ⭐ Featured
          </span>
        )}
      </div>
      <p className="mb-3 flex-1 text-sm text-text-muted line-clamp-2">{variant.description}</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">
          {variant.definitionType}
        </span>
        <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs text-text-muted">
          {variant.model}
        </span>
        {!isNaN(temp) && (
          <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs text-text-muted" title="Temperature">
            🌡️ {variant.temperature}
          </span>
        )}
      </div>
      <button
        onClick={() => onSelect(variant)}
        className="mt-auto rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        aria-label={`Start Chat with ${variant.name}`}
      >
        Start Chat
      </button>
    </div>
  );
}
