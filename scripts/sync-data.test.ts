import { execFile } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const run = promisify(execFile);
const feeds = [
  {
    name: 'articles',
    output: 'articles',
    valid:
      '[{"id":1,"name":"Article","slug":"article","description":"<script>untrusted text</script>","unknown":"discard"}]',
  },
  {
    name: 'projects',
    output: 'projects',
    valid:
      '{"subsites":[{"id":"project","name":"Project","description":"description","url":"https://example.com/","links":{"site":42},"unknown":"discard"}]}',
  },
  {
    name: 'repos',
    output: 'repositories',
    valid:
      '{"repositories":[{"name":"repo","url":"https://example.com/","rank":1,"composite_score":1,"unknown":"discard"}]}',
  },
] as const;

describe.each(feeds)('$name snapshot ingestion', feed => {
  it.each(['invalid-json', 'invalid-schema', 'unsafe-url', 'oversized', 'network-error', 'valid'])(
    'handles %s without unsafe writes or losing the previous snapshot',
    async mode => {
      const root = await mkdtemp(path.join(tmpdir(), 'tailwindspark-sync-'));
      try {
        await mkdir(path.join(root, 'scripts'));
        const outputDir = path.join(root, 'apps/demo-app/public/data');
        await mkdir(outputDir, { recursive: true });
        for (const file of [`sync-${feed.name}-data.mjs`, 'snapshot-download.ts']) {
          await copyFile(path.resolve('scripts', file), path.join(root, 'scripts', file));
        }
        const output = path.join(outputDir, `${feed.output}.json`);
        const previous = '{"previous":"snapshot"}\n';
        await writeFile(output, previous);
        const mock = path.join(root, 'mock.mjs');
        await writeFile(
          mock,
          `
          globalThis.fetch = async () => {
            const mode = process.env.SNAPSHOT_TEST_MODE;
            if (mode === 'network-error') throw new Error('offline');
            const text = mode === 'invalid-json' ? '{broken'
              : mode === 'invalid-schema' ? '[null]'
              : mode === 'unsafe-url' ? process.env.SNAPSHOT_TEST_UNSAFE
              : mode === 'oversized' ? ' '.repeat(3 * 1024 * 1024)
              : process.env.SNAPSHOT_TEST_VALID;
            return new Response(text);
          };
        `
        );
        await run(
          process.execPath,
          [
            '--import',
            pathToFileURL(mock).href,
            path.join(root, 'scripts', `sync-${feed.name}-data.mjs`),
          ],
          {
            env: {
              ...process.env,
              SNAPSHOT_TEST_MODE: mode,
              SNAPSHOT_TEST_VALID: feed.valid,
              SNAPSHOT_TEST_UNSAFE: JSON.stringify(
                feed.name === 'repos'
                  ? {
                      repositories: [
                        { name: 'repo', url: 'javascript:alert(1)', rank: 1, composite_score: 1 },
                      ],
                    }
                  : feed.name === 'projects'
                    ? [
                        {
                          id: 1,
                          p: 'project',
                          d: 'description',
                          h: 'javascript:alert(1)',
                          image: '',
                        },
                      ]
                    : [
                        {
                          id: 1,
                          name: 'article',
                          slug: 'article',
                          description: '',
                          seo: { canonical: 'javascript:alert(1)' },
                        },
                      ]
              ),
            },
            timeout: 15_000,
          }
        );
        const content = await readFile(output, 'utf8');
        if (mode === 'valid') {
          const parsed = JSON.parse(content) as unknown;
          if (feed.name === 'repos') {
            expect(parsed).toMatchObject({
              repositories: [{ name: 'repo', url: 'https://example.com/' }],
            });
          } else if (feed.name === 'projects') {
            expect(parsed).toMatchObject([{ p: 'Project', h: 'https://example.com/' }]);
          } else {
            expect(parsed).toMatchObject([
              { name: 'Article', slug: 'article', description: '<script>untrusted text</script>' },
            ]);
          }
          expect(content).not.toContain('unknown');
        } else {
          expect(content).toBe(previous);
        }
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    }
  );
});
