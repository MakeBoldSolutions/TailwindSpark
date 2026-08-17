import { describe, expect, it } from 'vitest';
import { ARTICLES_API_CONFIG, mapRawArticle } from './rss-api';

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

  it('prefers optimized thumbnails for preview images', () => {
    const article = mapRawArticle({
      id: 3,
      name: 'Preview Article',
      description: 'Uses optimized preview image',
      slug: 'blog/preview-article',
      img_src: '/img/full-size.jpg',
      image_metadata: {
        thumbnail: '/img/optimized/thumbnails/preview-thumb.jpg',
        webp: '/img/optimized/webp/preview.webp',
      },
    });

    expect(article.image_url).toBe(
      'https://markhazleton.com/img/optimized/thumbnails/preview-thumb.jpg'
    );
  });

  it('falls back to img_src for preview images', () => {
    const article = mapRawArticle({
      id: 4,
      name: 'Legacy Preview Article',
      description: 'Uses legacy preview image',
      slug: 'blog/legacy-preview-article',
      img_src: '/img/legacy.jpg',
    });

    expect(article.image_url).toBe('https://markhazleton.com/img/legacy.jpg');
  });

  it('keeps the remote article feed as the snapshot source while serving production data same-origin', () => {
    expect(ARTICLES_API_CONFIG.REMOTE_URL).toBe('https://markhazleton.com/articles.json');
    expect(ARTICLES_API_CONFIG.PROD_URL).toBe('/data/articles.json');
    expect(ARTICLES_API_CONFIG.FALLBACK_URL).toBe('/data/articles.json');
  });
});
