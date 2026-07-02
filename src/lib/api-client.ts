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
  const headers = await buildHeaders(init.headers);

  return fetch(input, {
    ...init,
    headers,
  });
};
