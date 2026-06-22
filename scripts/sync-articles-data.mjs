import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../apps/demo-app/public/data/articles.json');
const sourceUrl = 'https://markhazleton.com/articles.json';
const maxSnapshotBytes = 2 * 1024 * 1024; // 2MB limit
const allowedRemoteProtocols = new Set(['http:', 'https:']);

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeRequiredString(value, fieldName, index) {
  if (typeof value !== 'string') {
    throw new Error(`Article at index ${index} has an invalid ${fieldName}`);
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`Article at index ${index} has an invalid ${fieldName}`);
  }

  return normalized;
}

function normalizeOptionalString(value, fieldName, index) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error(`Article at index ${index} has an invalid ${fieldName}`);
  }

  return value.trim();
}

function normalizeOptionalUrl(value, fieldName, index) {
  if (value === undefined || value === null) {
    return value ?? undefined;
  }

  const normalized = normalizeRequiredString(value, fieldName, index);
  const url = new URL(normalized, 'https://markhazleton.com');
  if (!allowedRemoteProtocols.has(url.protocol)) {
    throw new Error(`Article at index ${index} has an unsupported ${fieldName} protocol`);
  }

  return normalized;
}

function assertValidArticle(article, index) {
  if (!isRecord(article)) {
    throw new Error(`Article at index ${index} must be an object`);
  }

  // Check for the actual API format (id, name, slug, etc.)
  if (typeof article.id !== 'number' && typeof article.id !== 'string') {
    throw new Error(`Article at index ${index} has an invalid id`);
  }

  normalizeRequiredString(article.name, 'name', index);
  normalizeRequiredString(article.slug, 'slug', index);

  if (typeof article.description !== 'string') {
    throw new Error(`Article at index ${index} has an invalid description`);
  }

  if (article.seo !== undefined && article.seo !== null && !isRecord(article.seo)) {
    throw new Error(`Article at index ${index} has an invalid seo object`);
  }
}

function normalizeArticle(article, index) {
  assertValidArticle(article, index);

  const normalizedArticle = {
    id: typeof article.id === 'number' ? article.id : normalizeRequiredString(article.id, 'id', index),
    name: normalizeRequiredString(article.name, 'name', index),
    description: String(article.description),
    slug: normalizeRequiredString(article.slug, 'slug', index),
  };

  const section = normalizeOptionalString(article.Section, 'Section', index);
  if (section !== undefined) {
    normalizedArticle.Section = section;
  }

  const publishedDate = normalizeOptionalString(article.publishedDate, 'publishedDate', index);
  if (publishedDate !== undefined) {
    normalizedArticle.publishedDate = publishedDate;
  }

  const author = normalizeOptionalString(article.author, 'author', index);
  if (author !== undefined) {
    normalizedArticle.author = author;
  }

  const imageSource = normalizeOptionalUrl(article.img_src, 'img_src', index);
  if (imageSource !== undefined) {
    normalizedArticle.img_src = imageSource;
  }

  const keywords = normalizeOptionalString(article.keywords, 'keywords', index);
  if (keywords !== undefined) {
    normalizedArticle.keywords = keywords;
  }

  if (article.seo?.canonical !== undefined && article.seo?.canonical !== null) {
    normalizedArticle.seo = {
      canonical: normalizeOptionalUrl(article.seo.canonical, 'seo.canonical', index),
    };
  }

  return normalizedArticle;
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

  const sanitized = parsed.map((article, index) => normalizeArticle(article, index));

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

async function writeSnapshot(sanitizedContent) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  let current = '';

  if (await hasExistingSnapshot(outputPath)) {
    current = await readFile(outputPath, 'utf8');
  }

  if (current === sanitizedContent) {
    console.log(`[sync-articles-data] Snapshot already current: ${outputPath}`);
    return;
  }

  await writeFile(outputPath, sanitizedContent, 'utf8');
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
    const sanitized = sanitizeArticlesSnapshot(jsonText);
    await writeSnapshot(sanitized);
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
