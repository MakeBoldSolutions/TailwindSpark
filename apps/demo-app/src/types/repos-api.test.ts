import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { RawReposResponseSchema, mapRawRepository } from './repos-api';

describe('repos-api', () => {
  it('normalizes sparse commit metrics from the shipped repository snapshot', () => {
    const json = JSON.parse(
      readFileSync(resolve('public/data/repositories.json'), 'utf8')
    ) as unknown;

    const parsed = RawReposResponseSchema.parse(json);
    const repositories = parsed.repositories.map(mapRawRepository);

    expect(repositories).toHaveLength(13);
    expect(repositories[0].commitMetrics).toMatchObject({
      avg_size: 0,
      total_commits: 0,
      largest_commit: {
        sha: '',
        date: '',
        size: 0,
        files_changed: 0,
        lines_added: 0,
        lines_deleted: 0,
      },
      smallest_commit: {
        sha: '',
        date: '',
        size: 0,
        files_changed: 0,
        lines_added: 0,
        lines_deleted: 0,
      },
      commit_size_distribution: {
        min: 0,
        q1: 0,
        median: 0,
        q3: 0,
        max: 0,
      },
    });
  });
});
