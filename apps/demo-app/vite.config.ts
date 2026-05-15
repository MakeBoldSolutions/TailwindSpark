import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use explicit base URL for GitHub Pages deployment
  // Falls back to VITE_BASE_URL env var, then defaults to '/' for local dev
  const basePath = 
    command === 'build' 
      ? (process.env.VITE_BASE_URL ?? '/TailwindSpark/')
      : '/';

  return {
  plugins: [
    react(),
    // Bundle analyzer is opt-in so standard builds stay git-clean.
    command === 'build' && mode === 'analyze' &&
      visualizer({
        filename: '../../reports/bundle-analysis.html',
        open: false, // Don't auto-open in browser
        gzipSize: true,
        brotliSize: true,
        template: 'treemap', // Options: treemap, sunburst, network
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      // Use package source in the workspace during app development so Vite handles JSX runtime imports directly.
      '@tailwindspark/ui-components': resolve(__dirname, '../../packages/ui-components/src/index.ts'),
    },
  },
  base: command === 'build' ? basePath : '/',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // CDN-optimized asset naming with content hashing
        assetFileNames: assetInfo => {
          const fileName = assetInfo.name || 'unknown';
          // Group assets by type for better CDN caching
          if (/\.(png|jpe?g|svg|gif|webp|ico)$/i.test(fileName)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(fileName)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/\.css$/i.test(fileName)) {
            return `assets/styles/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        // Advanced chunk splitting for optimal CDN delivery
        manualChunks: id => {
          // Vendor chunks for long-term caching
          if (id.includes('node_modules')) {
            if (
              id.includes('react-router') ||
              id.includes('@remix-run/router') ||
              id.includes('react-dom') ||
              id.includes('react/') ||
              id.includes('scheduler') ||
              id.includes('use-sync-external-store')
            ) {
              return 'framework-vendor';
            }
            if (id.includes('@microsoft/signalr')) {
              return 'signalr-vendor';
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'maps-vendor';
            }
            if (
              id.includes('react-markdown') ||
              id.includes('remark-') ||
              id.includes('rehype-') ||
              id.includes('mdast-') ||
              id.includes('hast-')
            ) {
              return 'markdown-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            return 'vendor';
          }

          // Feature-based chunks for better caching
          if (id.includes('/pages/')) {
            const pageName = id
              .split('/pages/')[1]
              .split('/')[0]
              .replace('.tsx', '')
              .replace('.ts', '');
            return `page-${pageName.toLowerCase()}`;
          }

          if (id.includes('/components/')) {
            return 'components';
          }

          if (id.includes('/utils/')) {
            return 'utils';
          }
        },
      },
      // Performance budget warnings
      onwarn(warning, warn) {
        // Custom warning for chunk size
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        warn(warning);
      },
    },
    // Performance budget limits for CDN optimization
    chunkSizeWarningLimit: 400, // Stricter limit for CDN delivery
    // Production optimizations
    minify: 'esbuild',
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari15'], // Modern browsers for smaller bundles
    sourcemap: false, // No source maps in production for CDN efficiency
    // Asset optimization
    assetsInlineLimit: 8192, // Inline small assets (8KB) to reduce HTTP requests
    // CSS optimization
    cssCodeSplit: true, // Split CSS for better caching
    // Report bundle analysis
    reportCompressedSize: true,
  },
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __BUILD_VERSION__: JSON.stringify(
      `${new Date().getFullYear()}.${(new Date().getMonth() + 1).toString().padStart(2, '0')}.${new Date().getDate().toString().padStart(2, '0')}.${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`
    ),
  },
  server: {
    // Ensure static assets are served correctly in development
    fs: {
      strict: false,
    },
    // Dev proxy for external API calls
    proxy: {
      '/api/projects.json': {
        target: 'https://markhazleton.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
      '/api/articles.json': {
        target: 'https://markhazleton.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
    // Security headers for development server
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
    },
  },
};
});
