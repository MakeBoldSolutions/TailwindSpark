import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../apps/demo-app/public/data/articles.json');
const sourceUrl = 'https://markhazleton.com/articles.json';
const maxSnapshotBytes = 2 * 1024 * 1024; // 2MB limit

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertValidArticle(article, index) {
  if (!isRecord(article)) {
    throw new Error(`Article at index ${index} must be an object`);
  }

  // Check for the actual API format (id, name, slug, etc.)
  if (typeof article.id !== 'number' && typeof article.id !== 'string') {
    throw new Error(`Article at index ${index} has an invalid id`);
  }

  if (typeof article.name !== 'string' || article.name.trim().length === 0) {
    throw new Error(`Article at index ${index} has an invalid name`);
  }

  if (typeof article.slug !== 'string' || article.slug.trim().length === 0) {
    throw new Error(`Article at index ${index} has an invalid slug`);
  }
}

function sanitizeArticlesSnapshot(jsonText) {
  const byteLength = Buffer.byteLength(jsonText, 'utf8');
  if (byteLength > maxSnapshotBytes) {
    throw new Error(`Articles snapshot exceeds max size: ${byteLength} bytes > ${maxSnapshotBytes} bytes`);
  }

  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) {
    throw new Error('Articles snapshot must be an array');
  }

  const sanitized = parsed.map((article, index) => {
    assertValidArticle(article, index);

    // Keep the article in its original API format
    // The app's rss.service will map it to the UI format
    return article;
  });

  return `${JSON.stringify(sanitized, null, 2)}\n`;
}

async function hasExistingSnapshot(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeSnapshot(jsonText) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  const normalized = sanitizeArticlesSnapshot(jsonText);
  let current = '';

  if (await hasExistingSnapshot(outputPath)) {
    current = await readFile(outputPath, 'utf8');
  }

  if (current === normalized) {
    console.log(`[sync-articles-data] Snapshot already current: ${outputPath}`);
    return;
  }

  await writeFile(outputPath, normalized, 'utf8');
  console.log(`[sync-articles-data] Wrote snapshot: ${outputPath}`);
}

async function writeEmptyFallback() {
  const emptySnapshot = '[\n]\n';
  
  if (await hasExistingSnapshot(outputPath)) {
    const current = await readFile(outputPath, 'utf8');
    if (current === emptySnapshot) {
      console.log(`[sync-articles-data] Empty fallback already exists: ${outputPath}`);
      return;
    }
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, emptySnapshot, 'utf8');
  console.log(`[sync-articles-data] Created empty fallback: ${outputPath}`);
}

async function main() {
  try {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: 'application/json',
      },
      // Set a timeout to avoid hanging
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const jsonText = await response.text();
    await writeSnapshot(jsonText);
  } catch (error) {
    // If fetch fails (CORS, timeout, network error), create empty fallback instead of failing
    console.warn(`[sync-articles-data] Failed to fetch from ${sourceUrl}:`, error.message);
    console.log(`[sync-articles-data] Creating empty fallback instead...`);
    await writeEmptyFallback();
  }
}

main().catch((error) => {
  console.error('[sync-articles-data] Fatal error:', error);
  process.exit(1);
});
