import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../apps/demo-app/public/data/projects.json');
const sourceUrl = 'https://makeboldspark.com/subsites.json';
const maxSnapshotBytes = 1024 * 1024;

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeOptionalString(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .filter(item => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : undefined;
}

function createCategoryLookup(parsed) {
  if (!isRecord(parsed.taxonomy) || !Array.isArray(parsed.taxonomy.categories)) {
    return new Map();
  }

  return new Map(
    parsed.taxonomy.categories
      .filter(category => isRecord(category) && typeof category.id === 'string')
      .map(category => [
        category.id,
        {
          name: normalizeOptionalString(category.name) ?? category.id,
          description: normalizeOptionalString(category.description),
          sortOrder: Number.isFinite(category.sortOrder) ? category.sortOrder : 999,
        },
      ])
  );
}

function assertValidLegacyProject(project, index) {
  if (!isRecord(project)) {
    throw new Error(`Project at index ${index} must be an object`);
  }

  if (typeof project.id !== 'number' || !Number.isFinite(project.id)) {
    throw new Error(`Project at index ${index} has an invalid id`);
  }

  if (typeof project.p !== 'string' || project.p.trim().length === 0) {
    throw new Error(`Project at index ${index} has an invalid name`);
  }

  if (typeof project.d !== 'string' || project.d.trim().length === 0) {
    throw new Error(`Project at index ${index} has an invalid description`);
  }

  if (typeof project.h !== 'string') {
    throw new Error(`Project at index ${index} has an invalid project URL`);
  }

  const projectUrl = new URL(project.h);
  if (!['http:', 'https:'].includes(projectUrl.protocol)) {
    throw new Error(`Project at index ${index} uses an unsupported project URL protocol`);
  }

  if (typeof project.image !== 'string') {
    throw new Error(`Project at index ${index} has an invalid image path`);
  }

  if (project.slug !== undefined && typeof project.slug !== 'string') {
    throw new Error(`Project at index ${index} has an invalid slug`);
  }

  if (project.summary !== undefined && typeof project.summary !== 'string') {
    throw new Error(`Project at index ${index} has an invalid summary`);
  }

  if (project.keywords !== undefined && typeof project.keywords !== 'string') {
    throw new Error(`Project at index ${index} has invalid keywords`);
  }

  if (project.promotion !== undefined) {
    if (!isRecord(project.promotion)) {
      throw new Error(`Project at index ${index} has an invalid promotion object`);
    }

    if (project.promotion.status !== undefined && typeof project.promotion.status !== 'string') {
      throw new Error(`Project at index ${index} has an invalid promotion status`);
    }
  }
}

function assertValidSubsiteProject(project, index) {
  if (!isRecord(project)) {
    throw new Error(`Subsite at index ${index} must be an object`);
  }

  if (typeof project.id !== 'string' || project.id.trim().length === 0) {
    throw new Error(`Subsite at index ${index} has an invalid id`);
  }

  if (typeof project.name !== 'string' || project.name.trim().length === 0) {
    throw new Error(`Subsite at index ${index} has an invalid name`);
  }

  if (typeof project.description !== 'string' || project.description.trim().length === 0) {
    throw new Error(`Subsite at index ${index} has an invalid description`);
  }

  const projectUrl = typeof project.links?.site === 'string' ? project.links.site : project.url;
  if (typeof projectUrl !== 'string') {
    throw new Error(`Subsite at index ${index} has an invalid project URL`);
  }

  const url = new URL(projectUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Subsite at index ${index} uses an unsupported project URL protocol`);
  }

  if (project.sortOrder !== undefined && typeof project.sortOrder !== 'number') {
    throw new Error(`Subsite at index ${index} has an invalid sortOrder`);
  }

  if (project.status !== undefined && typeof project.status !== 'string') {
    throw new Error(`Subsite at index ${index} has an invalid status`);
  }
}

function normalizeLegacyProject(project, index) {
  assertValidLegacyProject(project, index);

  const normalizedProject = {
    id: +project.id,
    p: project.p.trim(),
    d: project.d.trim(),
    h: String(project.h),
    image: String(project.image),
  };

  if (project.slug !== undefined) {
    normalizedProject.slug = String(project.slug);
  }

  if (project.summary !== undefined) {
    normalizedProject.summary = String(project.summary);
  }

  if (project.keywords !== undefined) {
    normalizedProject.keywords = String(project.keywords);
  }

  if (project.promotion?.status !== undefined) {
    normalizedProject.promotion = { status: String(project.promotion.status) };
  }

  return normalizedProject;
}

function normalizeSubsiteProject(project, index, categories) {
  assertValidSubsiteProject(project, index);

  const projectUrl = project.links?.site ?? project.url;
  const capabilities = normalizeStringArray(project.capabilities);
  const relatedInitiatives = normalizeStringArray(project.relatedInitiatives);
  const categoryId = normalizeOptionalString(project.strategicCategory);
  const category = categoryId ? categories.get(categoryId) : undefined;
  const normalizedProject = {
    id: Number.isFinite(project.sortOrder) ? project.sortOrder : index + 1,
    p: normalizeOptionalString(project.displayName) ?? project.name.trim(),
    d: project.description.trim(),
    h: String(projectUrl),
    image: '',
    slug: project.id.trim(),
    promotion: { status: normalizeOptionalString(project.status) ?? 'Active' },
  };

  const icon = normalizeOptionalString(project.icon);
  if (icon !== undefined) {
    normalizedProject.icon = icon;
  }

  const summary =
    normalizeOptionalString(project.tagline) ?? normalizeOptionalString(project.makeBoldSparkRole);
  if (summary !== undefined) {
    normalizedProject.summary = summary;
  }

  const deliveryPattern = normalizeOptionalString(project.deliveryPattern);
  if (deliveryPattern !== undefined) {
    normalizedProject.deliveryPattern = deliveryPattern;
  }

  if (categoryId !== undefined) {
    normalizedProject.categoryId = categoryId;
    normalizedProject.category = category?.name ?? categoryId;
  }

  if (category?.description !== undefined) {
    normalizedProject.categoryDescription = category.description;
  }

  if (Number.isFinite(category?.sortOrder)) {
    normalizedProject.categorySortOrder = category.sortOrder;
  }

  const initiativeType = normalizeOptionalString(project.initiativeType);
  if (initiativeType !== undefined) {
    normalizedProject.initiativeType = initiativeType;
  }

  const hostType = normalizeOptionalString(project.hostType);
  if (hostType !== undefined) {
    normalizedProject.hostType = hostType;
  }

  const hostTag = normalizeOptionalString(project.tag);
  if (hostTag !== undefined) {
    normalizedProject.hostTag = hostTag;
  }

  if (capabilities !== undefined) {
    normalizedProject.keywords = capabilities.join(', ');
    normalizedProject.technologies = capabilities;
  }

  if (relatedInitiatives !== undefined) {
    normalizedProject.relatedInitiatives = relatedInitiatives;
  }

  if (typeof project.featured === 'boolean') {
    normalizedProject.featured = project.featured;
  }

  return normalizedProject;
}

function sanitizeProjectsSnapshot(jsonText) {
  if (Buffer.byteLength(jsonText, 'utf8') > maxSnapshotBytes) {
    throw new Error(`Projects snapshot exceeds ${maxSnapshotBytes} bytes`);
  }

  const parsed = JSON.parse(jsonText);
  const categories = isRecord(parsed) ? createCategoryLookup(parsed) : new Map();
  const sanitized = Array.isArray(parsed)
    ? parsed.map(normalizeLegacyProject)
    : isRecord(parsed) && Array.isArray(parsed.subsites)
      ? parsed.subsites.map((project, index) => normalizeSubsiteProject(project, index, categories))
      : null;

  if (!sanitized) {
    throw new Error('Projects snapshot must be an array or an object with a subsites array');
  }

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
    console.log(`[sync-projects-data] Snapshot already current: ${outputPath}`);
    return;
  }

  // codeql[js/http-to-file-access]
  // The remote project feed is schema-normalized and written only to this fixed snapshot path.
  await writeFile(outputPath, sanitizedContent, 'utf8');
  console.log(`[sync-projects-data] Wrote snapshot: ${outputPath}`);
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
    const sanitized = sanitizeProjectsSnapshot(jsonText);
    await writeSnapshot(sanitized);
  } catch (error) {
    if (await hasExistingSnapshot(outputPath)) {
      console.warn(
        `[sync-projects-data] Using existing snapshot after refresh failure: ${String(error)}`
      );
      return;
    }

    throw error;
  }
}

main().catch(error => {
  console.error('[sync-projects-data] Failed to refresh projects snapshot.', error);
  process.exitCode = 1;
});
