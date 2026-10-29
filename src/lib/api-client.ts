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

    if (urlString.startsWith('/') && !/^\/([\\\/])/.test(urlString)) return true;

    try {
      let baseOrigin = '';
      if (typeof window !== 'undefined') {
        baseOrigin = window.location.origin;
      } else {
        const fallback = process.env.NEXT_PUBLIC_SITE_URL;
        if (!fallback) return false;
        baseOrigin = new URL(fallback).origin;
      }
      const parsed = new URL(urlString, baseOrigin);
      return parsed.origin === baseOrigin;
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
