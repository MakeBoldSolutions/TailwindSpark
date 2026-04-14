import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Demos overview page component.
 * 
 * Displays gallery of available demo applications (Dashboard, E-commerce, Marketing)
 * with descriptions and navigation links.
 * 
 * @returns Demos page component
 * 
 * @example
 * ```tsx
 * <DemosPage />
 * ```
 */
export const DemosPage: React.FC = () => {
  const demos = [
    {
      id: 'dashboard',
      title: 'SaaS Dashboard',
      path: '/dashboard',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'A comprehensive SaaS dashboard showcasing complex data visualization, responsive design, and interactive analytics.',
      features: [
        'Real-time data visualization with charts and metrics',
        'Responsive grid layouts and complex table structures',
        'Dark mode implementation with smooth transitions',
        'Interactive filtering and search functionality',
        'Modern card-based interface design',
        'Navigation with breadcrumbs and user management',
      ],
      techHighlights: [
        'Advanced Grid Systems',
        'Complex Flexbox Layouts',
        'Dark Mode Implementation',
        'Interactive States & Hover Effects',
        'Responsive Design Patterns',
        'Component Composition',
      ],
      businessValue:
        'Perfect for demonstrating enterprise application interfaces, data visualization capabilities, and complex user workflows that are common in B2B SaaS products.',
      tailwindShowcase:
        'Demonstrates grid systems, dark mode utilities, responsive design, complex layouts, and modern UI patterns with production-level component organization.',
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Store',
      path: '/ecommerce',
      image:
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'A modern online store with product grids, advanced filtering, shopping cart functionality, and responsive checkout flow.',
      features: [
        'Product gallery with high-quality image displays',
        'Advanced filtering and search capabilities',
        'Shopping cart with quantity management',
        'Responsive product cards and layouts',
        'Modal dialogs for quick product views',
        'Mobile-optimized navigation and checkout',
      ],
      techHighlights: [
        'CSS Grid & Flexbox Mastery',
        'Modal & Overlay Systems',
        'Form Validation States',
        'Image Optimization Techniques',
        'Mobile-First Design',
        'Animation & Micro-interactions',
      ],
      businessValue:
        'Showcases e-commerce expertise with product-focused design, conversion optimization, and user experience patterns that drive sales and engagement.',
      tailwindShowcase:
        'Highlights responsive grid systems, form styling, modal implementations, image optimization, and advanced filtering interfaces using Tailwind utilities.',
    },
    {
      id: 'marketing',
      title: 'Marketing Landing Page',
      path: '/marketing',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'A high-converting agency-style landing page with hero sections, testimonials, portfolio gallery, and contact forms.',
      features: [
        'Compelling hero section with gradient backgrounds',
        'Testimonial carousel with auto-rotation',
        'Portfolio gallery with hover effects',
        'Advanced form validation and user feedback',
        'Smooth scroll animations and parallax effects',
        'Conversion-optimized call-to-action elements',
      ],
      techHighlights: [
        'Advanced Gradient Systems',
        'Custom Animation Keyframes',
        'Parallax Scrolling Effects',
        'Form Validation States',
        'Complex Background Patterns',
        'Transform & Transition Utilities',
      ],
      businessValue:
        'Demonstrates marketing website expertise with conversion-focused design, modern animations, and lead generation forms that drive business results.',
      tailwindShowcase:
        'Showcases advanced animations, gradient backgrounds, form validation, parallax effects, and conversion-optimized layouts using cutting-edge Tailwind features.',
    },
  ];

  return (
    <div className="bg-surface py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-text md:text-5xl">
            Real-World Tailwind CSS Demos
          </h1>
          <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-text-muted">
            These three production-style examples showcase Tailwind CSS in real business scenarios,
            demonstrating technical complexity, business value, and modern best practices that
            employers and clients recognize.
          </p>
          <div className="mx-auto max-w-4xl rounded-xl border border-border bg-surface-alt p-6">
            <p className="italic text-text">
              "Each demo represents a different business use case, showcasing advanced Tailwind
              features, responsive design, accessibility considerations, and modern UI patterns that
              solve real problems."
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-data-viz-1 to-data-viz-2">
              <span className="text-2xl">🏗️</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-text">
              Technical Complexity
            </h3>
            <p className="text-text-muted">
              Advanced Tailwind features like responsive design, dark mode, animations, and complex
              layouts that mirror actual development projects.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-data-viz-5 to-data-viz-6">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-text">
              Business Value
            </h3>
            <p className="text-text-muted">
              Common use cases covering SaaS dashboards, e-commerce, and marketing sites that
              potential employers and clients immediately understand.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-data-viz-3 to-data-viz-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-text">
              Best Practices
            </h3>
            <p className="text-text-muted">
              Proper component organization, semantic HTML, accessibility considerations, and modern
              UI patterns following industry standards.
            </p>
          </div>
        </div>

        {/* Demo Showcase */}
        <div className="space-y-16">
          {demos.map((demo, index) => (
            <div
              key={demo.id}
              className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand to-brand-hover opacity-20 transition-opacity group-hover:opacity-30"></div>
                  <img
                    src={demo.image}
                    alt={demo.title}
                    className="relative z-10 h-80 w-full rounded-2xl object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                    <Link
                      to={demo.path}
                      className="translate-y-4 transform rounded-full border border-border bg-surface px-6 py-3 font-semibold text-text opacity-0 shadow-card transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      View {demo.title} →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-3 text-3xl font-bold text-text">
                      {demo.title}
                    </h2>
                    <p className="text-lg leading-relaxed text-text-muted">
                      {demo.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-text">
                      Key Features
                    </h4>
                    <ul className="grid gap-2 md:grid-cols-2">
                      {demo.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-success"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-text-muted">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Highlights */}
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-text">
                      Tailwind Techniques
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {demo.techHighlights.map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-text"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Business Value */}
                  <div className="rounded-lg bg-surface-alt p-4">
                    <h4 className="mb-2 text-lg font-semibold text-text">
                      Business Impact
                    </h4>
                    <p className="text-sm text-text-muted">{demo.businessValue}</p>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-4">
                    <Link
                      to={demo.path}
                      className="transform rounded-control bg-[var(--button-primary-bg)] px-6 py-3 font-semibold text-[var(--button-primary-fg)] shadow-button transition-all duration-300 hover:scale-105 hover:bg-[var(--button-primary-bg-hover)]"
                    >
                      Explore {demo.title}
                    </Link>
                    <button className="rounded-lg border-2 border-border px-6 py-3 font-semibold text-text transition-colors duration-300 hover:border-brand hover:text-brand">
                      View Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-brand to-brand-hover p-12 text-white">
            <h3 className="mb-4 text-3xl font-bold">Ready to Explore These Demos?</h3>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-white/80">
              Each demo represents hundreds of hours of development work, showcasing
              production-ready Tailwind CSS implementations that solve real business problems.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/dashboard"
                className="transform rounded-full border border-border bg-surface px-8 py-4 font-semibold text-text transition-all duration-300 hover:scale-105 hover:bg-surface-alt"
              >
                Start with SaaS Dashboard
              </Link>
              <Link
                to="/design-system"
                className="rounded-full border border-white/40 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                View Components Library
              </Link>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-16 text-center">
          <h3 className="mb-8 text-2xl font-bold text-text">
            Built with Modern Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'React 19',
              'TypeScript 5.3',
              'Tailwind CSS 4.1',
              'Vite 7',
              'Turborepo',
              'React Router',
              'Headless UI',
              'React Hook Form',
            ].map(tech => (
              <span
                key={tech}
                className="rounded-lg bg-surface-alt px-4 py-2 font-medium text-text"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
