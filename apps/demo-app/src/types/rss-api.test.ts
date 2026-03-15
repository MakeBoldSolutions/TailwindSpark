import { describe, expect, it } from 'vitest';
import { mapRawArticle } from './rss-api';

describe('mapRawArticle', () => {
  it('prefers seo canonical for article links', () => {
    const article = mapRawArticle({
      id: 1,
      name: 'Canonical Article',
      description: 'Uses canonical URL',
      slug: 'blog/canonical-article',
      seo: {
        canonical: 'https://markhazleton.com/blog/canonical-article',
      },
      Section: 'ReactSpark',
      publishedDate: '2025-01-15',
    });

    expect(article.link).toBe('https://markhazleton.com/blog/canonical-article');
  });

  it('falls back to slug when canonical is missing', () => {
    const article = mapRawArticle({
      id: 2,
      name: 'Legacy Article',
      description: 'Uses slug fallback',
      slug: 'blog/legacy-article',
      Section: 'ReactSpark',
      publishedDate: '2025-01-15',
    });

    expect(article.link).toBe('https://markhazleton.com/blog/legacy-article');
  });
});