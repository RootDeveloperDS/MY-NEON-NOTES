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
    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    // Explicitly handle safe relative paths early (prevents parsing failures)
    // Reject protocol-relative (//) or backslash (/\) bypass attempts
    if (urlString.startsWith('/') && !/^\/([\\\/])/.test(urlString)) return true;

    try {
      const isClient = typeof window !== 'undefined';
      const fallbackUrl = isClient ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

      const parsed = new URL(urlString, fallbackUrl);
      const expectedOrigin = new URL(fallbackUrl).origin;

      return parsed.origin === expectedOrigin;
    } catch {
      return false; // Fail safe
    }
  };

  const headers = isFirstParty() ? await buildHeaders(init.headers) : new Headers(init.headers);

  return fetch(input, {
    ...init,
    headers,
  });
};
