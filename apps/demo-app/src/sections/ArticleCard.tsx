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
export const ArticleCard: React.FC<ArticleCardProps> = props => {
  const { article } = props;
  const formattedDate = new Date(article.pub_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="rounded-panel border-border shadow-card flex flex-col overflow-hidden border bg-[var(--card-bg)] transition-shadow hover:shadow-lg">
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="bg-brand/10 text-brand rounded-full px-2.5 py-0.5 text-xs font-medium">
            {article.category}
          </span>
          <span className="text-text-muted text-xs">{formattedDate}</span>
        </div>
        <h2
          className="text-text mb-2 text-lg font-semibold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {article.title}
        </h2>
        <p className="text-text-muted mb-4 line-clamp-3 flex-1 text-sm">{article.description}</p>
        {article.author && <p className="text-text-muted mb-3 text-xs">By {article.author}</p>}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:text-brand-hover inline-flex items-center text-sm font-medium transition-colors"
        >
          Read article →
        </a>
      </div>
    </div>
  );
};
