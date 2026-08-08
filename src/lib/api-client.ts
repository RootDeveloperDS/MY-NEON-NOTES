import { auth } from '@/lib/firebase';

const isSafeUrl = (input: RequestInfo | URL): boolean => {
  let urlString = '';
  if (typeof input === 'string') {
    urlString = input;
  } else if (input instanceof URL) {
    urlString = input.href;
  } else if (input instanceof Request) {
    urlString = input.url;
  }

  if (!urlString) return false;

  try {
    // If running in browser context, validate against the current origin
    if (typeof window !== 'undefined') {
      // Create a URL object using the current origin as the base.
      // This correctly handles absolute URLs, path-absolute URLs (like '/api/data'),
      // relative paths (like 'api/data'), and prevents protocol-relative bypasses.
      const url = new URL(urlString, window.location.origin);
      return url.origin === window.location.origin;
    }

    // Server-side: since there's no window.location, we rely on checking if it's a relative path
    // without a host/protocol. Absolute URLs from server-side fetch will not receive the token.
    // If it throws when constructed without a base, it's a relative path (safe).
    new URL(urlString);
    return false; // If it parsed without a base, it's an absolute URL
  } catch {
    // Throws if it's a relative path and no base is provided (server-side case)
    return true;
  }
};

const buildHeaders = async (input: RequestInfo | URL, initHeaders?: HeadersInit): Promise<Headers> => {
  const headers = new Headers(initHeaders);
  const user = auth.currentUser;
  
  if (user && !headers.has('Authorization') && isSafeUrl(input)) {
    try {
      // getIdToken(false) gets a fresh token if expired, otherwise returns cached token
      const token = await user.getIdToken(false);
      headers.set('Authorization', `Bearer ${token}`);
    } catch (e) {
      console.warn('Failed to get Firebase ID token for API request', e);
    }
  }

  return headers;
};

export const apiFetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  const headers = await buildHeaders(input, init.headers);

  return fetch(input, {
    ...init,
    headers,
  });
};
