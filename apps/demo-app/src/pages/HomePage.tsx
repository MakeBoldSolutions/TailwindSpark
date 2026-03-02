import { Button } from '@tailwindspark/ui-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { TailwindSparkBrand } from '../components/TailwindSparkBrand';

/**
 * Home page component showcasing TailwindSpark features and navigation.
 * 
 * Displays project overview, feature highlights, demo links, and WebSpark ecosystem
 * integration. Serves as the main landing page for the application.
 * 
 * @returns Home page component
 * 
 * @example
 * ```tsx
 * <HomePage />
 * ```
 */
export const HomePage: React.FC = () => {
  return (
    <div className="bg-surface py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-12">
          <TailwindSparkBrand variant="hero" logoTitleTogether={true} />
          <div className="mt-8 text-center">
            <p className="text-lg italic text-text-muted">
              "Making technology work for business - lifelong learner, not sidetracked by sizzle."
            </p>
          </div>
        </div>

        {/* WebSpark Portfolio Integration */}
        <div className="mb-12 rounded-lg border border-border bg-surface-alt p-6">
          <h3 className="mb-3 text-lg font-semibold text-text">
            🌐 Part of the WebSpark Ecosystem
          </h3>
          <p className="mb-4 text-text-muted">
            TailwindSpark demonstrates practical application of modern web technologies as part of
            the WebSpark suite, showcasing real-world implementations rather than theoretical
            concepts. Explore other WebSpark applications:
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://webspark.markhazleton.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/20"
            >
              🌟 WebSpark Portfolio
            </a>
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
              🤖 PromptSpark - AI Prompts
            </span>
            <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
              🍳 RecipeSpark - Recipe Management
            </span>
            <span className="inline-flex items-center rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
              🧠 TriviaSpark - Interactive Quizzes
            </span>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-text">
              Component Library
            </h3>
            <p className="text-text-muted">
              Production-ready UI components built with Tailwind CSS, TypeScript, and accessibility
              best practices.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-text">
              Dark Mode & Accessibility
            </h3>
            <p className="text-text-muted">
              WCAG compliant components with automatic dark mode support and system preference
              detection.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-text">
              TailwindSpark Dashboard
            </h3>
            <p className="mb-3 text-text-muted">
              Full-featured SaaS dashboard showcasing modern UI patterns with responsive design and
              interactive analytics.
            </p>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-brand hover:text-brand-hover"
            >
              View Dashboard →
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-text">
              E-commerce Store
            </h3>
            <p className="mb-3 text-text-muted">
              Modern online store with product grids, filtering, shopping cart, and responsive
              checkout flow.
            </p>
            <Link
              to="/ecommerce"
              className="text-sm font-medium text-brand hover:text-brand-hover"
            >
              View Store →
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-text">
              Marketing Landing Page
            </h3>
            <p className="mb-3 text-text-muted">
              Agency-style landing page with hero sections, testimonials, portfolio gallery, and
              contact forms.
            </p>
            <Link
              to="/marketing"
              className="text-sm font-medium text-brand hover:text-brand-hover"
            >
              View Landing Page →
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-text">
              Animation Showcase
            </h3>
            <p className="mb-3 text-text-muted">
              Interactive animations, transitions, and micro-interactions demonstrating Tailwind's
              animation utilities.
            </p>
            <Link
              to="/animations"
              className="text-sm font-medium text-brand hover:text-brand-hover"
            >
              View Animations →
            </Link>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex flex-wrap justify-center gap-4">
            <Link to="/design-system">
              <Button variant="primary" size="lg">
                Explore Components
              </Button>
            </Link>
            <Link to="/animations">
              <Button variant="secondary" size="lg">
                View Animations
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="lg">
                SaaS Dashboard Demo
              </Button>
            </Link>
            <Link to="/ecommerce">
              <Button variant="ghost" size="lg">
                E-commerce Store Demo
              </Button>
            </Link>
            <Link to="/marketing">
              <Button variant="ghost" size="lg">
                Marketing Landing Page
              </Button>
            </Link>
          </div>
          <div className="mt-6">
            <a
              href="https://webspark.markhazleton.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:text-brand-hover"
            >
              Visit WebSpark Portfolio →
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-2xl font-bold text-text">
              TailwindSpark Features
            </h3>
            <p className="text-text-muted">
              Professional-grade components and patterns for modern web applications
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
                  <span className="font-semibold text-white">🎨</span>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-lg font-semibold text-text">
                  Professional Design System
                </h4>
                <p className="text-text-muted">
                  Production-ready component library with buttons, forms, cards, modals, and
                  animations. All components include TypeScript definitions and accessibility
                  features.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success">
                  <span className="font-semibold text-white">⚡</span>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-lg font-semibold text-text">
                  Performance & Modern Stack
                </h4>
                <p className="text-text-muted">
                  Built with React 19, TypeScript 5.3, Tailwind CSS 4.1, and Vite 7 for optimal
                  performance. Monorepo architecture with Turborepo for efficient builds.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-accent-500 flex h-8 w-8 items-center justify-center rounded-lg">
                  <span className="font-semibold text-white">🌙</span>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-lg font-semibold text-text">
                  Dark Mode Support
                </h4>
                <p className="text-text-muted">
                  Seamless dark mode with system preference detection and manual toggle. All
                  components adapt automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning">
                  <span className="font-semibold text-white">📦</span>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-lg font-semibold text-text">
                  Monorepo Architecture
                </h4>
                <p className="text-text-muted">
                  Organized with Turborepo for efficient development. Shared design tokens and UI
                  components across projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
