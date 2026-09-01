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

    if (typeof window === 'undefined') {
      try {
        const fallbackOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const parsed = new URL(urlString, fallbackOrigin);
        const parsedFallback = new URL(fallbackOrigin);
        return parsed.origin === parsedFallback.origin;
      } catch {
        return false;
      }
    }

    try {
      const parsed = new URL(urlString, window.location.origin);
      return parsed.origin === window.location.origin;
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
