import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../apps/demo-app/public/data/projects.json');
const sourceUrl = 'https://markhazleton.com/projects.json';
const maxSnapshotBytes = 1024 * 1024;

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertValidProject(project, index) {
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

function sanitizeProjectsSnapshot(jsonText) {
  if (Buffer.byteLength(jsonText, 'utf8') > maxSnapshotBytes) {
    throw new Error(`Projects snapshot exceeds ${maxSnapshotBytes} bytes`);
  }

  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) {
    throw new Error('Projects snapshot must be an array');
  }

  const sanitized = parsed.map((project, index) => {
    assertValidProject(project, index);

    const normalizedProject = {
      id: project.id,
      p: project.p.trim(),
      d: project.d.trim(),
      h: project.h,
      image: project.image,
    };

    if (project.slug !== undefined) {
      normalizedProject.slug = project.slug;
    }

    if (project.summary !== undefined) {
      normalizedProject.summary = project.summary;
    }

    if (project.keywords !== undefined) {
      normalizedProject.keywords = project.keywords;
    }

    if (project.promotion?.status !== undefined) {
      normalizedProject.promotion = { status: project.promotion.status };
    }

    return normalizedProject;
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
  const normalized = sanitizeProjectsSnapshot(jsonText);
  let current = '';

  if (await hasExistingSnapshot(outputPath)) {
    current = await readFile(outputPath, 'utf8');
  }

  if (current === normalized) {
    console.log(`[sync-projects-data] Snapshot already current: ${outputPath}`);
    return;
  }

  await writeFile(outputPath, normalized, 'utf8');
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
    await writeSnapshot(jsonText);
  } catch (error) {
    if (await hasExistingSnapshot(outputPath)) {
      console.warn(`[sync-projects-data] Using existing snapshot after refresh failure: ${String(error)}`);
      return;
    }

    throw error;
  }
}

main().catch(error => {
  console.error('[sync-projects-data] Failed to refresh projects snapshot.', error);
  process.exitCode = 1;
});
