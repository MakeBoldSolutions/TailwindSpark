import React from 'react';
import { ButtonShowcase } from '../sections/ButtonShowcase';
import { CardShowcase } from '../sections/CardShowcase';
import { FormShowcase } from '../sections/FormShowcase';
import { ModalShowcase } from '../sections/ModalShowcase';

/**
 * Design system showcase page displaying all UI components.
 * 
 * Comprehensive component library demonstration featuring buttons, forms,
 * cards, and modals with interactive examples and variant showcases.
 * 
 * @returns Design system page component
 * 
 * @example
 * ```tsx
 * <DesignSystemShowcase />
 * ```
 */
export const DesignSystemShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface transition-colors">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-text">
            TailwindSpark Component Library
          </h1>
          <p className="mx-auto mb-6 max-w-3xl text-xl text-text-muted">
            A comprehensive showcase of production-ready React components built with Tailwind CSS,
            TypeScript, and accessibility best practices. Featuring buttons, forms, cards, and
            modals with all variants and interactive states.
          </p>
          <div className="flex justify-center gap-3 text-sm">
            <span className="inline-flex items-center rounded-control border border-border bg-surface-alt px-3 py-1 font-medium text-text">
              ✨ TailwindSpark
            </span>
            <a
              href="https://web.makeboldspark.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-control border border-border bg-surface-alt px-3 py-1 font-medium text-text transition-colors hover:bg-surface-hover"
            >
              🌐 WebSpark Portfolio
            </a>
          </div>
        </div>

        <div className="space-y-16">
          <ButtonShowcase />
          <FormShowcase />
          <CardShowcase />
          <ModalShowcase />
        </div>
      </div>
    </div>
  );
};
