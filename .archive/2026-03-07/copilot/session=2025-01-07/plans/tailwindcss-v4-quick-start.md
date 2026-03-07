# TailwindCSS v4 Migration Quick Start Guide

## Immediate Action Items

This guide provides the essential first steps to begin migrating TailwindSpark from TailwindCSS v3 to v4.

### Step 1: Create Migration Branch

```bash
# Create and switch to migration branch
git checkout -b feat/tailwindcss-v4-migration

# Ensure clean working directory
git status
```

### Step 2: Install TailwindCSS v4 Alpha

```bash
# Remove existing TailwindCSS v3 packages
npm uninstall tailwindcss @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio autoprefixer

# Install TailwindCSS v4 alpha packages
npm install tailwindcss@next @tailwindcss/vite@next

# Update root package.json
npm install --save-dev tailwindcss@next

# Update design-tokens package
cd packages/design-tokens
npm install tailwindcss@next
cd ../..

# Update ui-components package  
cd packages/ui-components
npm install --save-dev tailwindcss@next
cd ../..

# Update demo-app package
cd apps/demo-app
npm install --save-dev tailwindcss@next @tailwindcss/vite@next
cd ../..
```

### Step 3: Update Vite Configuration

Replace the Vite configuration in `apps/demo-app/vite.config.ts`:

```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // New v4 Vite plugin
  ],
  base: '/TailwindSpark/',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
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
  },
});
```

### Step 4: Create CSS-First Theme Configuration

Replace the content of `apps/demo-app/src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Primary Color System */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;
  --color-primary-950: #082f49;

  /* Accent Color System */
  --color-accent-50: #faf5ff;
  --color-accent-100: #f3e8ff;
  --color-accent-200: #e9d5ff;
  --color-accent-300: #d8b4fe;
  --color-accent-400: #c084fc;
  --color-accent-500: #a855f7;
  --color-accent-600: #9333ea;
  --color-accent-700: #7c3aed;
  --color-accent-800: #6b21a8;
  --color-accent-900: #581c87;
  --color-accent-950: #3b0764;

  /* Secondary Color System */
  --color-secondary-50: #fafaf9;
  --color-secondary-100: #f5f5f4;
  --color-secondary-200: #e7e5e4;
  --color-secondary-300: #d6d3d1;
  --color-secondary-400: #a8a29e;
  --color-secondary-500: #78716c;
  --color-secondary-600: #57534e;
  --color-secondary-700: #44403c;
  --color-secondary-800: #292524;
  --color-secondary-900: #1c1917;
  --color-secondary-950: #0c0a09;

  /* Success Color System */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-300: #86efac;
  --color-success-400: #4ade80;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;
  --color-success-800: #166534;
  --color-success-900: #14532d;
  --color-success-950: #052e16;

  /* Warning Color System */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-300: #fcd34d;
  --color-warning-400: #fbbf24;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;
  --color-warning-800: #92400e;
  --color-warning-900: #78350f;
  --color-warning-950: #451a03;

  /* Error Color System */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-300: #fca5a5;
  --color-error-400: #f87171;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;
  --color-error-800: #991b1b;
  --color-error-900: #7f1d1d;
  --color-error-950: #450a0a;

  /* Font Family System */
  --font-family-sans: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-family-mono: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace;

  /* Spacing System */
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;

  /* Border Radius System */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-DEFAULT: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
}

@layer base {
  html {
    font-family: var(--font-family-sans);
  }

  body {
    @apply bg-white text-secondary-900 transition-colors duration-300 dark:bg-secondary-900 dark:text-secondary-100;
  }
}

@layer components {
  .prose-custom {
    @apply prose prose-secondary dark:prose-invert max-w-none;
  }

  .section-padding {
    @apply px-4 sm:px-6 lg:px-8;
  }

  .container-custom {
    @apply section-padding mx-auto max-w-7xl;
  }

  /* Custom range slider styles */
  .slider::-webkit-slider-thumb {
    @apply h-5 w-5 cursor-pointer appearance-none rounded-full bg-indigo-600;
  }

  .slider::-moz-range-thumb {
    @apply h-5 w-5 cursor-pointer rounded-full border-0 bg-indigo-600;
  }

  /* Custom animations for marketing page */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(2rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 1s ease-out both;
  }

  /* Intersection observer animation classes */
  .fade-in-up {
    @apply translate-y-10 opacity-0 transition-all duration-700 ease-out;
  }

  .fade-in-up.visible {
    @apply translate-y-0 opacity-100;
  }

  /* Parallax background pattern */
  .bg-pattern-dots {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* Aspect ratio utilities for older browsers */
  .aspect-w-4 {
    position: relative;
    padding-bottom: 75%; /* 4:3 Aspect Ratio */
  }

  .aspect-w-4 > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  /* Line clamp utility */
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
```

### Step 5: Remove Legacy Configuration Files

```bash
# Remove PostCSS configuration (no longer needed with v4 Vite plugin)
rm apps/demo-app/postcss.config.js

# Remove old Tailwind config files (will be replaced with CSS-first approach)
rm apps/demo-app/tailwind.config.js
rm packages/design-tokens/tailwind.config.js
rm packages/ui-components/tailwind.config.js
```

### Step 6: Test Basic Setup

```bash
# Try to build the project
npm run build

# If successful, try development server
npm run dev
```

### Step 7: Address Breaking Changes (Critical)

#### Fix Border Utilities

Search for border utilities that need explicit colors:

```bash
# Find potential issues
grep -r "border\b(?!\-[a-z])" apps/demo-app/src/ || echo "No border utilities found"
```

Update border utilities to be explicit:

```html
<!-- Before (v3) -->
<div class="border bg-white"></div>

<!-- After (v4) -->
<div class="border border-gray-200 bg-white"></div>
```

#### Fix Ring Utilities

Search for ring utilities that need updates:

```bash
# Find ring utilities
grep -r "focus:ring\b" apps/demo-app/src/ || echo "No ring utilities found"
```

Update ring utilities:

```html
<!-- Before (v3) -->
<input class="focus:ring-2 focus:ring-primary-500" />

<!-- After (v4) - keep ring-2 or change to ring-1 -->
<input class="focus:ring-2 focus:ring-primary-500" />
```

### Step 8: Verify VS Code Extension

Make sure you're using the TailwindCSS IntelliSense prerelease version:

1. Open VS Code
2. Go to Extensions
3. Search for "Tailwind CSS IntelliSense"
4. Switch to the prerelease version

### Step 9: Test and Iterate

```bash
# Run development server
npm run dev

# Check for any console errors
# Test major components and pages
# Verify styles are rendering correctly
```

## Expected Issues and Solutions

### Issue: Build Fails with Module Not Found

**Solution**: Ensure all v4 packages are properly installed:

```bash
npm install tailwindcss@next @tailwindcss/vite@next --save-dev
```

### Issue: Styles Not Loading

**Solution**: Verify the CSS import is correct:

```css
/* Make sure this is at the top of your CSS file */
@import "tailwindcss";
```

### Issue: Custom Colors Not Working

**Solution**: Ensure color variables are properly defined in @theme:

```css
@theme {
  --color-brand-primary: #0ea5e9;
}
```

### Issue: TypeScript Errors

**Solution**: v4 is still in alpha, some TypeScript definitions may be incomplete. Add type assertions as needed:

```typescript
// If needed, create type declarations
declare module '@tailwindcss/vite';
```

## Next Steps After Basic Setup

Once the basic setup is working:

1. **Fix Breaking Changes**: Systematically update border and ring utilities
2. **Test Components**: Verify all major components render correctly
3. **Performance Testing**: Measure build time improvements
4. **Advanced Features**: Implement container queries and composable variants
5. **Documentation**: Update project documentation

## Rollback Plan

If issues arise:

```bash
# Rollback to previous commit
git reset --hard HEAD~1

# Or switch back to main branch
git checkout main

# Remove migration branch if needed
git branch -D feat/tailwindcss-v4-migration
```

## Success Criteria

- [x] TailwindCSS v4 packages installed successfully
- [x] Vite plugin configured correctly
- [x] CSS-first theme configuration working
- [x] Development server starts without errors
- [x] Basic styles render correctly
- [x] Build process completes successfully

This quick start guide should get you up and running with TailwindCSS v4 in about 30-60 minutes. Once basic functionality is confirmed, you can proceed with the comprehensive migration plan.
