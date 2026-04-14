import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const serviceWorkerPath = path.resolve(currentDirectory, '../../public/sw.js');
const serviceWorkerSource = fs.readFileSync(serviceWorkerPath, 'utf8');

const readAppRoutes = (): string[] => {
  const appRoutesMatch = serviceWorkerSource.match(/const appRoutes = \[(?<routes>[\s\S]*?)\];/);
  const routesSource = appRoutesMatch?.groups?.routes ?? '';

  return Array.from(routesSource.matchAll(/'([^']+)'/g), match => match[1]);
};

describe('service worker app route precache list', () => {
  it('uses scope-relative routes so the GitHub Pages base path is preserved', () => {
    const appRoutes = readAppRoutes();

    expect(appRoutes.length).toBeGreaterThan(0);
    expect(appRoutes.every(route => !route.startsWith('/'))).toBe(true);
  });

  it('resolves all app routes under the TailwindSpark deployment scope', () => {
    const scope = 'https://markhazleton.github.io/TailwindSpark/';
    const appRoutes = readAppRoutes();

    const resolvedPaths = appRoutes.map(route => new URL(route, scope).pathname);

    expect(resolvedPaths.every(route => route.startsWith('/TailwindSpark/'))).toBe(true);
  });
});