import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadSnapshot, normalizeSnapshotUrl } from './snapshot-download.ts';

afterEach(() => vi.unstubAllGlobals());

describe('normalizeSnapshotUrl', () => {
  it.each([null, undefined, ''])('preserves absent optional URL %s', value => {
    expect(normalizeSnapshotUrl(value)).toBeNull();
  });
  it.each(['javascript:alert(1)', 'data:text/html,unsafe', 'file:///tmp/file', '/relative', 42])(
    'rejects unsafe URL %s',
    value => {
      expect(() => normalizeSnapshotUrl(value)).toThrow(/Snapshot URL|Invalid URL/);
    }
  );
  it('normalizes permitted HTTP(S) URLs', () => {
    expect(normalizeSnapshotUrl('https://example.com')).toBe('https://example.com/');
    expect(normalizeSnapshotUrl('http://example.com/page')).toBe('http://example.com/page');
  });
});

describe('downloadSnapshot', () => {
  it('joins streamed UTF-8 bytes and applies HTTPS, redirect, and deadline controls', async () => {
    const bytes = new TextEncoder().encode('["é"]');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(bytes.slice(0, 3));
            controller.enqueue(bytes.slice(3));
            controller.close();
          },
        })
      )
    );
    vi.stubGlobal('fetch', fetchMock);
    expect(await downloadSnapshot('https://example.com/data.json', bytes.length)).toBe('["é"]');
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/data.json', {
      headers: { Accept: 'application/json' },
      redirect: 'error',
      signal: expect.any(AbortSignal),
    });
  });

  it('cancels a chunked oversized response without trusting Content-Length', async () => {
    const cancel = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          new ReadableStream({
            pull(controller) {
              controller.enqueue(new Uint8Array(5));
            },
            cancel,
          }),
          { headers: { 'Content-Length': '1' } }
        )
      )
    );
    await expect(downloadSnapshot('https://example.com/data.json', 9)).rejects.toThrow(
      'exceeds 9 bytes'
    );
    expect(cancel).toHaveBeenCalledOnce();
  });

  it('cancels an unsuccessful response', async () => {
    const cancel = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(new ReadableStream({ cancel }), { status: 503 }))
    );
    await expect(downloadSnapshot('https://example.com/data.json', 10)).rejects.toThrow('HTTP 503');
    expect(cancel).toHaveBeenCalledOnce();
  });

  it('rejects a missing response body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null)));
    await expect(downloadSnapshot('https://example.com/data.json', 10)).rejects.toThrow('no body');
  });

  it('propagates interrupted streams', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          new ReadableStream({
            start(controller) {
              controller.error(new Error('interrupted'));
            },
          })
        )
      )
    );
    await expect(downloadSnapshot('https://example.com/data.json', 10)).rejects.toThrow(
      'interrupted'
    );
  });

  it('uses a ten-second abort deadline', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new DOMException('timed out', 'TimeoutError'))
    );
    await expect(downloadSnapshot('https://example.com/data.json', 10)).rejects.toThrow(
      'timed out'
    );
    expect(timeout).toHaveBeenCalledWith(10_000);
    timeout.mockRestore();
  });

  it.each([0, -1, 1.5, Infinity])(
    'rejects an invalid byte limit %s before fetching',
    async limit => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      await expect(downloadSnapshot('https://example.com/data.json', limit)).rejects.toThrow(
        'positive safe integer'
      );
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it('rejects an insecure source before fetching', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(downloadSnapshot('http://example.com/data.json', 10)).rejects.toThrow('HTTPS');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
