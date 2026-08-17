#!/usr/bin/env tsx
/**
 * Generate sitemap.xml and robots.txt into a build output directory.
 * - Uses a static route manifest
 * - Writes only to the provided artifact directory, never tracked source
 */
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetDirArg = process.argv[2];
const OUTPUT_DIR = targetDirArg ? join(process.cwd(), targetDirArg) : join(__dirname, '../dist');
const BASE_URL = 'https://makeboldsolutions.github.io/TailwindSpark';
const today = new Date().toISOString().split('T')[0];

// Central route manifest for published routes.
const routes: { path: string; priority: number; changefreq: string }[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.9, changefreq: 'monthly' },
  { path: '/apps', priority: 0.95, changefreq: 'weekly' },
  { path: '/apps/projects', priority: 0.9, changefreq: 'weekly' },
  { path: '/apps/articles', priority: 0.9, changefreq: 'weekly' },
  { path: '/apps/joke', priority: 0.8, changefreq: 'monthly' },
  { path: '/apps/weather', priority: 0.8, changefreq: 'monthly' },
  { path: '/apps/ai-chat', priority: 0.8, changefreq: 'monthly' },
  { path: '/design-system', priority: 0.85, changefreq: 'monthly' },
  { path: '/animations', priority: 0.85, changefreq: 'monthly' },
  { path: '/dashboard', priority: 0.8, changefreq: 'monthly' },
  { path: '/ecommerce', priority: 0.75, changefreq: 'monthly' },
  { path: '/marketing', priority: 0.75, changefreq: 'monthly' },
  { path: '/demos', priority: 0.7, changefreq: 'monthly' },
  { path: '/analytics', priority: 0.65, changefreq: 'monthly' },
  { path: '/users', priority: 0.65, changefreq: 'monthly' },
  { path: '/settings', priority: 0.6, changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map(
    r =>
      `  <url>\n    <loc>${BASE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(2)}</priority>\n  </url>`
  )
  .join('\n')}\n</urlset>\n`;

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  '# Sitemap',
  `Sitemap: ${BASE_URL}/sitemap.xml`,
  '',
  '# Crawl-delay',
  'Crawl-delay: 1',
  '',
  `# Generated: ${today}`,
  '',
].join('\n');

async function main(): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(join(OUTPUT_DIR, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(join(OUTPUT_DIR, 'robots.txt'), robots, 'utf8');
  console.warn(`Generated sitemap.xml and robots.txt in ${OUTPUT_DIR}`);
}

main().catch(error => {
  console.error('Failed to generate deployment metadata:', error);
  process.exitCode = 1;
});
