/**
 * Resource hints utility for optimizing asset loading
 * Provides preconnect and DNS prefetch functionality
 */

/**
 * Add preconnect resource hint for external domains
 * @param href - URL of the domain to preconnect to
 * @param crossOrigin - Whether to use cross-origin for the connection
 */
const addPreconnectHint = (href: string, crossOrigin?: boolean) => {
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
const addDnsPrefetchHint = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = href;
  document.head.appendChild(link);
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
