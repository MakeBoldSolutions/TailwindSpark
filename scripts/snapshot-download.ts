/**
 * Validates a snapshot link before it reaches a browser link or image attribute.
 * @param value - Untrusted URL field; null or empty optional fields remain null.
 * @returns An absolute HTTP(S) URL or null for an absent field.
 */
export function normalizeSnapshotUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new Error('Snapshot URL must be a string');
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Snapshot URL must use HTTP(S)');
  }
  return url.href;
}

/**
 * Downloads an HTTPS JSON feed with a deadline and a streaming byte limit.
 * @param sourceUrl - The script's fixed HTTPS source URL.
 * @param maxBytes - Maximum decoded response-body size in bytes.
 * @returns The bounded response text, ready for schema validation.
 */
export async function downloadSnapshot(sourceUrl: string, maxBytes: number): Promise<string> {
  if (new URL(sourceUrl).protocol !== 'https:') {
    throw new Error('Snapshot sources must use HTTPS');
  }
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) {
    throw new Error('Snapshot byte limit must be a positive safe integer');
  }

  const response = await fetch(sourceUrl, {
    headers: { Accept: 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`HTTP ${response.status}`);
  }
  if (!response.body) {
    throw new Error('Snapshot response has no body');
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > maxBytes) {
        throw new Error(`Snapshot exceeds ${maxBytes} bytes`);
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks, byteLength).toString('utf8');
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    throw error;
  } finally {
    reader.releaseLock();
  }
}
