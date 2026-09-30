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

    if (typeof window !== 'undefined') {
      try {
        const parsed = new URL(urlString, window.location.origin);
        return parsed.origin === window.location.origin;
      } catch {
        return false;
      }
    } else {
      // Server-side: ensure it's a relative internal path or matches our actual site origin
      if (urlString.startsWith('/') && !urlString.startsWith('//')) {
        return true;
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      if (siteUrl) {
        try {
          const parsed = new URL(urlString);
          const siteParsed = new URL(siteUrl);
          return parsed.origin === siteParsed.origin;
        } catch {
          return false;
        }
      }
      return false; // Fail safe if unable to determine
    }
  };

  const headers = isFirstParty() ? await buildHeaders(init.headers) : new Headers(init.headers);

  return fetch(input, {
    ...init,
    headers,
  });
};
