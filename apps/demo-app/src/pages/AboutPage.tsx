import { useEffect, useMemo, type FC } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../contexts/SEOContext';
import { useArticles } from '../hooks/useArticles';

/**
 * Renders the About page and related ReactSpark content.
 *
 * @returns About page element
 */
export const AboutPage: FC = (): React.JSX.Element => {
  const { setSEO } = useSEO();
  const { articles, loading: articlesLoading } = useArticles();

  useEffect(() => {
    setSEO({
      title: 'About - TailwindSpark',
      description:
        'Learn about TailwindSpark, a comprehensive React TypeScript monorepo demonstrating modern web development with Tailwind CSS.',
    });
  }, [setSEO]);

  // Filter articles to ReactSpark category and show most recent 5
  const reactSparkArticles = useMemo(() => {
    return articles
      .filter(a => a.category?.toLowerCase().includes('reactspark'))
      .sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime())
      .slice(0, 5);
  }, [articles]);

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

        {/* ReactSpark Articles */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-text">Recent ReactSpark Articles</h2>
          {articlesLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            </div>
          ) : reactSparkArticles.length > 0 ? (
            <div className="space-y-4">
              {reactSparkArticles.map(article => (
                <a
                  key={article.id}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-border bg-surface-alt p-4 transition hover:shadow-md"
                >
                  <h3 className="font-semibold text-text">{article.title}</h3>
                  <p className="mt-1 text-sm text-text-muted line-clamp-2">{article.description}</p>
                  <span className="mt-2 inline-block text-xs text-text-muted">
                    {new Date(article.pub_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No ReactSpark articles found.</p>
          )}
          <Link
            to="/apps/articles"
            className="mt-4 inline-flex text-sm font-medium text-brand hover:text-brand-hover"
          >
            View all articles →
          </Link>
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
};
