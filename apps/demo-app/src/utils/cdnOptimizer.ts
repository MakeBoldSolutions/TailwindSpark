/**
 * CDN Optimization Utilities
 * Provides CDN-specific optimizations for GitHub Pages deployment
 */

interface CDNConfig {
  baseUrl: string;
  assetUrl: string;
  enablePreconnect: boolean;
  enablePrefetch: boolean;
  cacheStrategy: 'aggressive' | 'balanced' | 'conservative';
}

interface ResourceHint {
  href: string;
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch' | 'modulepreload';
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch';
  crossorigin?: 'anonymous' | 'use-credentials';
  type?: string;
}

/**
 * CDN Optimizer class for managing CDN-specific optimizations
 */
class CDNOptimizer {
  private config: CDNConfig;
  private appliedHints = new Set<string>();
  private initialized = false;

  /**
   * Creates a new CDN optimizer instance
   * @param config - Optional CDN configuration
   */
  constructor(config: Partial<CDNConfig> = {}) {
    this.config = {
      baseUrl: 'https://markhazleton.github.io/TailwindSpark/',
      assetUrl: 'https://markhazleton.github.io/TailwindSpark/assets/',
      enablePreconnect: true,
      enablePrefetch: true,
      cacheStrategy: 'balanced',
      ...config,
    };
  }

  /**
   * Initialize CDN optimizations
   */
  init(): void {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;

    this.initialized = true;

    this.setupPreconnections();
    this.optimizeResourceLoading();
    this.setupServiceWorkerUpdates();
    this.setupCacheManagement();
  }

  /**
   * Setup DNS preconnections for external resources
   */
  private setupPreconnections(): void {
    if (!this.config.enablePreconnect) return;

    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
    ];

    preconnectDomains.forEach(domain => {
      this.addResourceHint({
        href: domain,
        rel: 'preconnect',
        crossorigin: 'anonymous',
      });
    });

    // DNS prefetch for analytics and other third-party domains
    const prefetchDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ];

    prefetchDomains.forEach(domain => {
      this.addResourceHint({
        href: domain,
        rel: 'dns-prefetch',
      });
    });
  }

  /**
   * Optimize resource loading based on CDN strategy
   */
  private optimizeResourceLoading(): void {
    this.preloadCriticalResources();

    // Setup lazy loading for non-critical resources
    this.setupLazyLoading();

    // Prefetch next-page resources
    if (this.config.enablePrefetch) {
      this.setupIntelligentPrefetching();
    }
  }

  /**
   * Preload critical resources for faster page load
   * 
   * NOTE: Disabled because the referenced resources don't exist in the build output:
   * - Fonts are loaded from Google Fonts or embedded in CSS by Vite
   * - CSS files have unpredictable hash-based names that can't be hardcoded
   * 
   * Attempting to preload non-existent resources generates 404 errors.
   */
  private preloadCriticalResources(): void {
    // Disabled - see method documentation
    return;
    
    /* Disabled implementation:
    const criticalFonts = [
      { href: '/assets/fonts/inter.woff2', type: 'font/woff2' },
      { href: '/assets/fonts/inter-bold.woff2', type: 'font/woff2' },
    ];

    criticalFonts.forEach(font => {
      this.addResourceHint({
        href: this.config.baseUrl + font.href.slice(1),
        rel: 'preload',
        as: 'font',
        type: font.type,
        crossorigin: 'anonymous',
      });
    });

    this.addResourceHint({
      href: this.getCriticalStylesUrl(),
      rel: 'preload',
      as: 'style',
    });
    */
  }

  /**
   * Setup intelligent prefetching based on user behavior
   */
  private setupIntelligentPrefetching(): void {
    // Prefetch resources when user hovers over navigation links
    const navLinks = document.querySelectorAll('a[href^="/"]');

    navLinks.forEach(link => {
      let prefetchTimer: NodeJS.Timeout;

      link.addEventListener('mouseenter', () => {
        prefetchTimer = setTimeout(() => {
          const href = (link as HTMLAnchorElement).href;
          this.prefetchPageResources(href);
        }, 100); // Delay to avoid prefetching on quick hovers
      });

      link.addEventListener('mouseleave', () => {
        if (prefetchTimer) {
          clearTimeout(prefetchTimer);
        }
      });
    });

    // Prefetch on touch start for mobile
    navLinks.forEach(link => {
      link.addEventListener(
        'touchstart',
        () => {
          const href = (link as HTMLAnchorElement).href;
          this.prefetchPageResources(href);
        },
        { passive: true }
      );
    });
  }

  /**
   * Prefetch resources for a specific page
   * @param url - URL of the page to prefetch resources for
   */
  private prefetchPageResources(url: string): void {
    // Don't prefetch external links
    if (!url.startsWith(this.config.baseUrl) && !url.startsWith('/')) {
      return;
    }

    // Extract page name from URL
    const pageName = this.extractPageName(url);
    if (!pageName) return;

    // Prefetch the page's JavaScript chunk
    this.addResourceHint({
      href: `${this.config.assetUrl}js/page-${pageName}-[hash].js`,
      rel: 'prefetch',
      as: 'script',
    });

    // Prefetch page-specific CSS if it exists
    this.addResourceHint({
      href: `${this.config.assetUrl}styles/page-${pageName}-[hash].css`,
      rel: 'prefetch',
      as: 'style',
    });
  }

  /**
   * Setup service worker updates for CDN cache invalidation
   */
  private setupServiceWorkerUpdates(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          // Handle cache updates
          this.handleCacheUpdate(event.data.updatedAssets);
        }
      });
    }
  }

  /**
   * Setup cache management for CDN optimization
   */
  private setupCacheManagement(): void {
    if (this.config.cacheStrategy !== 'conservative') {
      this.warmCache();
    }

    // Monitor performance and adjust caching strategy
    this.monitorPerformance();
  }

  /**
   * Monitor performance metrics and adjust CDN strategy
   */
  private monitorPerformance(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      // Monitor resource timing
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'resource') {
            this.analyzeResourcePerformance(entry as PerformanceResourceTiming);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * Analyze resource performance and optimize CDN usage
   * @param entry - Performance resource timing entry to analyze
   */
  private analyzeResourcePerformance(entry: PerformanceResourceTiming): void {
    // Check for slow-loading resources
    const loadTime = entry.responseEnd - entry.startTime;
    const isFromCache = entry.transferSize === 0;

    if (loadTime > 1000 && !isFromCache) {
      console.warn(`Slow resource detected: ${entry.name} (${Math.round(loadTime)}ms)`);

      // Consider preloading this resource in future visits
      this.flagForPreloading(entry.name);
    }
  }

  /**
   * Warm cache with critical resources
   * 
   * NOTE: Disabled because Vite generates unpredictable hash-based filenames.
   * Attempting to fetch '[hash]' placeholders generates 404 errors in console.
   */
  private warmCache(): void {
    // Early return - cache warming disabled
    return;
    
    /* Disabled implementation:
    const criticalResources = [
      '/assets/js/react-vendor-[hash].js',
      '/assets/js/components-[hash].js',
      '/assets/styles/index-[hash].css',
    ];

    criticalResources.forEach(resource => {
      fetch(this.config.baseUrl + resource.slice(1), {
        mode: 'no-cors',
        priority: 'low',
      } as RequestInit).catch(() => {
        // Ignore errors as this is just cache warming
      });
    });
    */
  }

  /**
   * Add a resource hint to the document head
   * @param hint - Resource hint configuration
   */
  private addResourceHint(hint: ResourceHint): void {
    const key = `${hint.rel}:${hint.href}`;

    if (this.appliedHints.has(key)) {
      return; // Already applied
    }

    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;

    if (hint.as) link.setAttribute('as', hint.as);
    if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
    if (hint.type) link.type = hint.type;

    document.head.appendChild(link);
    this.appliedHints.add(key);
  }

  /**
   * Setup lazy loading for images and other resources
   */
  private setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Handle cache updates from service worker
   * @param updatedAssets - Array of updated asset URLs
   */
  private handleCacheUpdate(updatedAssets: string[]): void {
    // Invalidate prefetch hints for updated assets
    updatedAssets.forEach(asset => {
      this.appliedHints.delete(`prefetch:${asset}`);
    });
  }

  /**
   * Flag resource for future preloading
   * @param resourceUrl - URL of the resource to flag
   */
  private flagForPreloading(resourceUrl: string): void {
    // Store in localStorage for future visits
    const preloadList = JSON.parse(localStorage.getItem('cdn-preload-list') || '[]');
    if (!preloadList.includes(resourceUrl)) {
      preloadList.push(resourceUrl);
      localStorage.setItem('cdn-preload-list', JSON.stringify(preloadList.slice(-10))); // Keep last 10
    }
  }

  /**
   * Get critical styles URL
   * @returns URL for critical CSS file
   */
  /** private */ getCriticalStylesUrl(): string {
    // In production, this would be the actual CSS file with hash
    return `${this.config.assetUrl}styles/index-[hash].css`;
  }

  /**
   * Extract page name from URL
   * @param url - URL to extract page name from
   * @returns Extracted page name or null if not extractable
   */
  private extractPageName(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.replace(
        this.config.baseUrl.replace(/^https?:\/\/[^/]+/, ''),
        ''
      );
      const segments = pathname.split('/').filter(Boolean);
      return segments[0] || 'home';
    } catch {
      return null;
    }
  }

  /**
   * Get current cache strategy configuration
   * @returns Cache strategy configuration with TTL values in seconds
   */
  getCacheStrategy(): Record<string, number> {
    const strategies = {
      aggressive: {
        staticAssets: 31536000, // 1 year
        dynamicContent: 86400, // 1 day
        api: 300, // 5 minutes
      },
      balanced: {
        staticAssets: 7776000, // 3 months
        dynamicContent: 3600, // 1 hour
        api: 300, // 5 minutes
      },
      conservative: {
        staticAssets: 86400, // 1 day
        dynamicContent: 300, // 5 minutes
        api: 60, // 1 minute
      },
    };

    return strategies[this.config.cacheStrategy];
  }
}

/**
 * Global CDN optimizer instance
 */
export const cdnOptimizer = new CDNOptimizer({
  cacheStrategy: process.env.NODE_ENV === 'production' ? 'balanced' : 'conservative',
});

// Auto-initialize in browser environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => cdnOptimizer.init());
  } else {
    cdnOptimizer.init();
  }
}

export default CDNOptimizer;
