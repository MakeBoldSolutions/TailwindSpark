import type { Article } from '../types/rss-api';

interface ArticleCardProps {
  article: Article;
}

/**
 * Displays a summary card for an article.
 *
 * @param props - Component props
 * @param props.article - Article metadata to display
 * @returns Article card element
 */
export const ArticleCard: React.FC<ArticleCardProps> = (props) => {
  const { article } = props;
  const formattedDate = new Date(article.pub_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col rounded-panel border border-border bg-[var(--card-bg)] p-5 shadow-card transition-shadow hover:shadow-lg">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
          {article.category}
        </span>
        <span className="text-xs text-text-muted">{formattedDate}</span>
      </div>
      <h2 className="mb-2 text-lg font-semibold text-text" style={{ fontFamily: 'var(--font-display)' }}>
        {article.title}
      </h2>
      <p className="mb-4 flex-1 text-sm text-text-muted line-clamp-3">{article.description}</p>
      {article.author && (
        <p className="mb-3 text-xs text-text-muted">By {article.author}</p>
      )}
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-medium text-brand transition-colors hover:text-brand-hover"
      >
        Read article →
      </a>
    </div>
  );
};
