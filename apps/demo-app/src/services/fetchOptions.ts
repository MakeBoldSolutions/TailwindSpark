/**
 * Shared request options for public cross-origin JSON endpoints.
 *
 * @returns Fetch options for anonymous CORS-safe GET requests
 */
export function getPublicJsonFetchOptions(): RequestInit {
  return {
    method: 'GET',
    cache: 'no-store',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
    },
  };
}
