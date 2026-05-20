import { getAuthToken } from '@/lib/auth-token';

const buildHeaders = (initHeaders?: HeadersInit): Headers => {
  const headers = new Headers(initHeaders);
  const token = getAuthToken();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

export const apiFetch = (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  const headers = buildHeaders(init.headers);

  return fetch(input, {
    ...init,
    headers,
  });
};
