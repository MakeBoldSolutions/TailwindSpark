import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
}

interface SEOContextType {
  seo: SEOData;
  setSEO: (data: Partial<SEOData>) => void;
}

const defaultSEO: SEOData = {
  title: 'TailwindSpark',
  description: 'Interactive showcase of Tailwind CSS components and design system',
};

const SEOContext = createContext<SEOContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useSEO() {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
}

interface SEOProviderProps {
  children: React.ReactNode;
}

export const SEOProvider: React.FC<SEOProviderProps> = ({ children }) => {
  const [seo, setSEOState] = useState<SEOData>(defaultSEO);

  const setSEO = useCallback((data: Partial<SEOData>) => {
    setSEOState(prev => ({ ...prev, ...data }));
  }, []);

  useEffect(() => {
    document.title = seo.title;

    const setMeta = (name: string, content: string | undefined) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (name.startsWith('og:')) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', seo.description);
    if (seo.keywords) setMeta('keywords', seo.keywords);
    setMeta('og:title', seo.ogTitle || seo.title);
    setMeta('og:description', seo.ogDescription || seo.description);
    if (seo.ogImage) setMeta('og:image', seo.ogImage);
    if (seo.ogUrl) setMeta('og:url', seo.ogUrl);

    // Canonical URL
    if (seo.canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', seo.canonicalUrl);
    }
  }, [seo]);

  return (
    <SEOContext.Provider value={{ seo, setSEO }}>
      {children}
    </SEOContext.Provider>
  );
};
