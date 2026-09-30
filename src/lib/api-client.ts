import { auth } from '@/lib/firebase';

const buildHeaders = async (initHeaders?: HeadersInit): Promise<Headers> => {
  const headers = new Headers(initHeaders);
  const user = auth.currentUser;
  
  if (user && !headers.has('Authorization')) {
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
  const isFirstParty = () => {
    let urlString = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    // Explicitly handle safe relative paths early to prevent URL parsing failures
    if (urlString.startsWith('/') && !/^\/([\\\/])/.test(urlString)) return true;

    try {
      const isServer = typeof window === 'undefined';
      const baseOrigin = isServer
        ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        : window.location.origin;

      const parsed = new URL(urlString, baseOrigin);
      const parsedBase = new URL(baseOrigin);
      return parsed.origin === parsedBase.origin;
    } catch {
      return false;
    }
  };

  const headers = isFirstParty() ? await buildHeaders(init.headers) : new Headers(init.headers);

  return fetch(input, {
    ...init,
    headers,
  });
};
