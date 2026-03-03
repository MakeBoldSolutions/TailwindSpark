/**
 * Resource hints utility for optimizing asset loading
 * Provides preload, prefetch, and preconnect functionality
 */

interface ResourceHintOptions {
  as?: 'script' | 'style' | 'image' | 'font' | 'video' | 'audio' | 'document';
  crossOrigin?: 'anonymous' | 'use-credentials';
  type?: string;
  media?: string;
}

/**
 * Add preload resource hint for critical assets
 * @param href - URL of the resource to preload
 * @param options - Optional resource hint configuration
 */
export const addPreloadHint = (href: string, options: ResourceHintOptions = {}) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;

  if (options.as) link.setAttribute('as', options.as);
  if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
  if (options.type) link.type = options.type;
  if (options.media) link.media = options.media;

  document.head.appendChild(link);
};

/**
 * Add prefetch resource hint for future assets
 * @param href - URL of the resource to prefetch
 */
export const addPrefetchHint = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

/**
 * Add preconnect resource hint for external domains
 * @param href - URL of the domain to preconnect to
 * @param crossOrigin - Whether to use cross-origin for the connection
 */
export const addPreconnectHint = (href: string, crossOrigin?: boolean) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  if (crossOrigin) link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Add DNS prefetch for external domains
 * @param href - URL of the domain for DNS prefetch
 */
export const addDnsPrefetchHint = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = href;
  document.head.appendChild(link);
};

/**
 * Preload critical fonts
 * @param fontUrls - Array of font URLs to preload
 */
export const preloadFonts = (fontUrls: string[]) => {
  fontUrls.forEach(url => {
    addPreloadHint(url, {
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    });
  });
};

/**
 * Preload critical images
 * @param imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    addPreloadHint(url, { as: 'image' });
  });
};

/**
 * Setup CDN preconnections for common services
 */
export const setupCdnPreconnections = () => {
  // Google Fonts
  addPreconnectHint('https://fonts.googleapis.com');
  addPreconnectHint('https://fonts.gstatic.com', true);

  // Google Analytics
  addPreconnectHint('https://www.google-analytics.com');
  addPreconnectHint('https://www.googletagmanager.com');

  // Common CDNs
  addDnsPrefetchHint('https://cdn.jsdelivr.net');
  addDnsPrefetchHint('https://unpkg.com');
};

/**
 * Resource loading priority manager
 */
export class ResourcePriorityManager {
  private static instance: ResourcePriorityManager;
  private preloadedResources = new Set<string>();
  private prefetchedResources = new Set<string>();

  /**
   * Get the singleton instance of ResourcePriorityManager
   * @returns The ResourcePriorityManager instance
   */
  static getInstance(): ResourcePriorityManager {
    if (!ResourcePriorityManager.instance) {
      ResourcePriorityManager.instance = new ResourcePriorityManager();
    }
    return ResourcePriorityManager.instance;
  }

  /**
   * Preload critical resources (above-the-fold content)
   * @param resources - Array of resources to preload with their types and options
   */
  preloadCritical(
    resources: Array<{
      url: string;
      type: ResourceHintOptions['as'];
      options?: ResourceHintOptions;
    }>
  ) {
    resources.forEach(({ url, type, options = {} }) => {
      if (!this.preloadedResources.has(url)) {
        addPreloadHint(url, { as: type, ...options });
        this.preloadedResources.add(url);
      }
    });
  }

  /**
   * Prefetch resources for future navigation
   * @param urls - Array of URLs to prefetch
   */
  prefetchFuture(urls: string[]) {
    urls.forEach(url => {
      if (!this.prefetchedResources.has(url)) {
        addPrefetchHint(url);
        this.prefetchedResources.add(url);
      }
    });
  }

  /**
   * Get resource loading statistics
   * @returns Object containing counts of preloaded and prefetched resources
   */
  getStats() {
    return {
      preloaded: this.preloadedResources.size,
      prefetched: this.prefetchedResources.size,
    };
  }
}
