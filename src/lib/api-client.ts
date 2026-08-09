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
    if (typeof window === 'undefined') {
      // If we are on the server, we might not know the exact origin,
      // but relative URLs won't parse with URL without a base anyway.
      // Since apiFetch is currently only used client-side for now, this is a safe default.
      // If used server side later with absolute urls, they will be considered external unless they match an env variable.
      // However, we only care about protecting against external full URLs leaking auth.
      return true; // We can return true or implement stricter server-side checks if needed.
    }
    try {
      const targetUrlString = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      // If the string starts with 'http' and has a different origin, it will fail the condition below
      // If it's a relative URL like '/api/foo', parsing it with window.location.origin keeps it first party.
      const targetUrl = new URL(targetUrlString, window.location.origin);
      return targetUrl.origin === window.location.origin;
    } catch {
      return false; // Invalid URLs or cross-origin parsing issues default to no auth
    }
  };

  // Only append Authorization if the request targets our own domain (or relative path on client)
  // to avoid leaking the token to third-party endpoints (SSRF/leak protection).
  const headers = isFirstParty() ? await buildHeaders(init.headers) : new Headers(init.headers);

  return fetch(input, {
    ...init,
    headers,
  });
};
