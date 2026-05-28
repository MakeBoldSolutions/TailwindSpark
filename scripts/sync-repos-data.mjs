import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../apps/demo-app/public/data/repositories.json');
const sourceUrl =
  'https://raw.githubusercontent.com/markhazleton/github-stats-spark/refs/heads/main/data/users/markhazleton/repositories.json';
const maxSnapshotBytes = 2 * 1024 * 1024;

function assertValidRepository(repo, index) {
  if (typeof repo !== 'object' || repo === null || Array.isArray(repo)) {
    throw new Error(`Repository at index ${index} must be an object`);
  }

  if (typeof repo.name !== 'string' || repo.name.trim().length === 0) {
    throw new Error(`Repository at index ${index} has an invalid name`);
  }

  if (typeof repo.url !== 'string') {
    throw new Error(`Repository at index ${index} has an invalid url`);
  }

  if (typeof repo.composite_score !== 'number' || !Number.isFinite(repo.composite_score)) {
    throw new Error(`Repository at index ${index} has an invalid composite_score`);
  }

  if (typeof repo.rank !== 'number') {
    throw new Error(`Repository at index ${index} has an invalid rank`);
  }
}

function sanitizeReposSnapshot(jsonText) {
  if (Buffer.byteLength(jsonText, 'utf8') > maxSnapshotBytes) {
    throw new Error(`Repositories snapshot exceeds ${maxSnapshotBytes} bytes`);
  }

  const parsed = JSON.parse(jsonText);

  // The source JSON is { profile, repositories, metadata }
  const repos = Array.isArray(parsed) ? parsed : parsed.repositories;
  if (!Array.isArray(repos)) {
    throw new Error('Repositories snapshot must contain a repositories array');
  }

  repos.forEach((repo, index) => {
    assertValidRepository(repo, index);
  });

  // Preserve the full structure (profile has aggregate stats, metadata has generation info)
  const output = Array.isArray(parsed) ? { repositories: parsed } : parsed;
  return `${JSON.stringify(output, null, 2)}\n`;
}

async function hasExistingSnapshot(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeSnapshot(sanitizedContent) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  let current = '';

  if (await hasExistingSnapshot(outputPath)) {
    current = await readFile(outputPath, 'utf8');
  }

  if (current === sanitizedContent) {
    console.log(`[sync-repos-data] Snapshot already current: ${outputPath}`);
    return;
  }

  await writeFile(outputPath, sanitizedContent, 'utf8');
  console.log(`[sync-repos-data] Wrote snapshot: ${outputPath}`);
}

async function main() {
  try {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const jsonText = await response.text();
    const sanitized = sanitizeReposSnapshot(jsonText);
    await writeSnapshot(sanitized);
  } catch (error) {
    if (await hasExistingSnapshot(outputPath)) {
      console.warn(`[sync-repos-data] Using existing snapshot after refresh failure: ${String(error)}`);
      return;
    }

    throw error;
  }
}

main().catch(error => {
  console.error('[sync-repos-data] Failed to refresh repositories snapshot.', error);
  process.exitCode = 1;
});
