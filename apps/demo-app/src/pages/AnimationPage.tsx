import React from 'react';
import { AnimationShowcase } from '../sections/AnimationShowcase';

/**
 * Animation gallery page showcasing Tailwind CSS animations.
 * 
 * Interactive demonstration of CSS animations and transitions including
 * hover effects, keyframes, and complex multi-property animations.
 * 
 * @returns Animation page component
 * 
 * @example
 * ```tsx
 * <AnimationPage />
 * ```
 */
export const AnimationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface transition-colors">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-text">
            TailwindSpark Animation Gallery
          </h1>
          <p className="mx-auto mb-6 max-w-3xl text-xl text-text-muted">
            Discover the power of Tailwind CSS animations and transitions through interactive
            examples. From subtle hover effects to complex keyframe animations, see how
            utility-first CSS creates smooth, performant animations.
          </p>
          <div className="flex justify-center gap-3 text-sm">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 font-medium text-brand">
              ✨ Interactive Examples
            </span>
            <span className="inline-flex items-center rounded-full bg-success-100/50 px-3 py-1 font-medium text-success-700">
              🎬 CSS Animations
            </span>
            <a
              href="https://tailwindcss.com/docs/animation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-surface-alt px-3 py-1 font-medium text-text transition-colors hover:bg-border"
            >
              📚 Tailwind Docs
            </a>
          </div>
        </div>

        <div className="space-y-16">
          <AnimationShowcase />
        </div>
      </div>
    </div>
  );
};
