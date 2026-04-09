# GitHub Pages Deployment Guide

## Automatic Deployment

This project is configured for automatic deployment to GitHub Pages when changes are pushed to the `main` branch.

### What happens automatically

1. GitHub Actions workflow builds the project
2. Static files are generated in the `dist` folder
3. Files are deployed to GitHub Pages
4. Site becomes available at: `https://markhazleton.github.io/TailwindSpark/`

## Manual Deployment

To deploy manually:

```bash
# Install dependencies
npm ci

# Build the project
npm run build

# The built files will be in the dist/ folder
```

## Configuration Details

- **Base URL**: `/TailwindSpark/` (configured in `apps/demo-app/vite.config.ts` using `base` for production builds)
- **Router Strategy**: Hash-based routing (recommended for GitHub Pages) or SPA fallback approach (a redirecting `404.html` is already provided). If you later switch to standard `BrowserRouter`, the existing `404.html` script will translate deep links into a hash form so the React app can hydrate.
- **Build Output**: The demo app emits to the repository root `dist/` (configured as `outDir: '../../dist'`). The GitHub Actions workflow uploads this folder as the Pages artifact.
- **SPA 404 Handling**: `apps/demo-app/public/404.html` implements the Spa GitHub Pages redirect pattern (RAF graph script). During build it is copied into `dist/` so direct URL refreshes work.
- **Caching**: Default GitHub Pages caching applies; no immutable asset hash strategy yet (potential enhancement: enable file name hashing via Vite asset settings).
- **Security Headers**: Not configurable natively on Pages; consider a Netlify/Cloudflare layer if you need CSP/Headers control.

### Optional Custom Domain

If you map a custom domain:

1. Add a `CNAME` file under `apps/demo-app/public/` with your domain (e.g. `example.com`).
2. Enable the custom domain in the repo Settings → Pages and add DNS `CNAME` pointing to `markhazleton.github.io`.
3. Commit & deploy; GitHub Pages will place the `CNAME` into the published root.

### Asset Paths Verification

All static asset links (icons, manifest, images) use relative paths so they resolve under the `/TailwindSpark/` base.

## Local Development

For local development, the site runs at `http://localhost:5173/` with the development server:

```bash
npm run dev
```

## Troubleshooting

If the deployment fails:

1. Check the Actions tab in GitHub for build logs
2. Ensure GitHub Pages is enabled in repository settings
3. Verify the source is set to "GitHub Actions"
4. Check that all dependencies are properly installed
5. Validate that `vite.config.ts` `base` still matches the repository name if you fork or rename the repo
6. Confirm the `deploy.yml` workflow still grants `pages: write` permissions

### Deep Link 404s

If you observe 404s on direct refreshes of nested routes:

1. Ensure `404.html` is present in the published site (Actions artifact list → Pages deployment log).
2. Verify the script inside `404.html` still contains `pathSegmentsToKeep = 1` (the correct setting for a project pages site under a user/org account where the repository name is one path segment).
3. Clear browser cache or test in an incognito window (old cached 404 may persist).

### Local Hash vs Fallback Mode

If you later migrate from HashRouter to BrowserRouter you can keep the same `base` and `404.html` logic; update documentation links (remove `#/`) and test for proper translation.

## URLs After Deployment

- **Live Site**: <https://markhazleton.github.io/TailwindSpark/>
- **Home Page**: <https://markhazleton.github.io/TailwindSpark/#/>
- **Design System**: <https://markhazleton.github.io/TailwindSpark/#/design-system>
- **Animations**: <https://markhazleton.github.io/TailwindSpark/#/animations>
- **Dashboard**: <https://markhazleton.github.io/TailwindSpark/#/dashboard>
