import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { onCLS, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { RuntimePerformanceBudget } from '../utils/performanceBudget';

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Analytics hook for tracking page views and performance metrics.
 * 
 * Automatically tracks page navigation and Web Vitals metrics (CLS, FCP, LCP, TTFB)
 * with Google Analytics integration and performance budget monitoring.
 * 
 * @returns Object with trackEvent, trackComponentInteraction, trackAnimationInteraction, trackDemoInteraction functions and budgetMonitor instance
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { trackEvent, trackComponentInteraction } = useAnalytics();
 *   return <Routes />;
 * }
 * ```
 */
export const useAnalytics = () => {
  const location = useLocation();
  const budgetMonitor = RuntimePerformanceBudget.getInstance();

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-319249408', {
        page_path: location.pathname + location.hash,
        page_title: getPageTitle(location.pathname + location.hash),
      });
    }
  }, [location]);

  // Core Web Vitals tracking with performance budget monitoring
  useEffect(() => {
    const trackWebVitals = () => {
      const sendToAnalytics = (metric: Metric) => {
        // Check against performance budget
        const metricName = metric.name.toLowerCase() as keyof ReturnType<
          typeof budgetMonitor.getBudgets
        >;
        if (metricName in budgetMonitor.getBudgets()) {
          budgetMonitor.checkMetric(metricName, metric.value);
        }

        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          });
        }

        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Web Vital tracked:', metric);
        }
      };

      // Track all Core Web Vitals
      onCLS(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    };

    trackWebVitals();
  }, [budgetMonitor]);

  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackComponentInteraction = (componentName: string, action: string) => {
    trackEvent(action, 'component_interaction', componentName);
  };

  const trackAnimationInteraction = (animationType: string, action: string) => {
    trackEvent(action, 'animation_interaction', animationType);
  };

  const trackDemoInteraction = (demoName: string, action: string) => {
    trackEvent(action, 'demo_interaction', demoName);
  };

  return {
    trackEvent,
    trackComponentInteraction,
    trackAnimationInteraction,
    trackDemoInteraction,
    budgetMonitor,
  };
};

const getPageTitle = (path: string): string => {
  const titles: Record<string, string> = {
    '/': 'TailwindSpark - Home',
    '/#/': 'TailwindSpark - Home',
    '/#/design-system': 'TailwindSpark - Design System',
    '/#/animations': 'TailwindSpark - Animation Showcase',
    '/#/dashboard': 'TailwindSpark - SaaS Dashboard',
    '/#/ecommerce': 'TailwindSpark - E-commerce Demo',
    '/#/marketing': 'TailwindSpark - Marketing Demo',
    '/#/demos': 'TailwindSpark - All Demos',
  };

  return titles[path] || 'TailwindSpark';
};
