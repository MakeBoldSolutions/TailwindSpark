import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../apps/demo-app/public/data/projects.json');
const sourceUrl = 'https://markhazleton.com/projects.json';

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
  const normalized = `${jsonText.trim()}\n`;
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
    JSON.parse(jsonText);
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
