import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../contexts/SEOContext';

export function AboutPage() {
  const { setSEO } = useSEO();

  useEffect(() => {
    setSEO({
      title: 'About - TailwindSpark',
      description:
        'Learn about TailwindSpark, a comprehensive React TypeScript monorepo demonstrating modern web development with Tailwind CSS.',
    });
  }, [setSEO]);

  return (
    <div className="bg-surface py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-4 text-3xl font-bold text-text">About TailwindSpark</h1>
        <p className="mb-8 text-lg text-text-muted">
          TailwindSpark is a comprehensive React TypeScript monorepo demonstrating
          modern web development with Tailwind CSS. It serves as both an educational
          resource and a production-ready template for building scalable web
          applications with utility-first CSS principles.
        </p>

        {/* Tech stack */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-text">Technology Stack</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { name: 'React 18+', desc: 'TypeScript' },
              { name: 'Tailwind CSS 4', desc: '@theme & design tokens' },
              { name: 'Vite', desc: 'Fast builds' },
              { name: 'Turborepo', desc: 'Monorepo management' },
              { name: 'ESLint + Prettier', desc: 'Code quality' },
              { name: 'Vitest', desc: 'Testing' },
            ].map(tech => (
              <div
                key={tech.name}
                className="rounded-lg border border-border bg-surface-alt p-4"
              >
                <h3 className="font-semibold text-text">{tech.name}</h3>
                <p className="text-sm text-text-muted">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mini-Apps */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-text">Mini-Apps</h2>
          <p className="mb-4 text-text-muted">
            TailwindSpark includes several interactive mini-apps that demonstrate
            real-world patterns like API integration, real-time communication, and
            state management.
          </p>
          <Link
            to="/apps"
            className="inline-flex rounded-lg bg-brand px-5 py-2.5 font-medium text-white transition hover:bg-brand/90"
          >
            Explore Apps →
          </Link>
        </section>

        {/* WebSpark Ecosystem */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text">
            WebSpark Ecosystem
          </h2>
          <p className="mb-4 text-text-muted">
            TailwindSpark is part of the WebSpark portfolio — a suite of
            applications showcasing practical implementations of modern web
            technologies.
          </p>
          <a
            href="https://webspark.markhazleton.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand hover:text-brand-hover"
          >
            Visit WebSpark Portfolio →
          </a>
        </section>
      </div>
    </div>
  );
}
