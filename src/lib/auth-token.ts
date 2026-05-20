const TOKEN_STORAGE_KEY = 'neon_notes_auth_token';
const TOKEN_PATTERN = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

type StorageType = 'sessionStorage' | 'localStorage';

export type TokenPersistence = 'temporary' | 'persistent';
export type TokenStorageTarget = 'sessionStorage' | 'localStorage';

export interface TokenStorageResult {
  stored: boolean;
  fallbackToMemory: boolean;
  target: TokenStorageTarget;
}

let memorySessionToken: string | null = null;
let memoryPersistentToken: string | null = null;

const canUseStorage = (storage: Storage | null): boolean => {
  if (!storage) {
    return false;
  }
  try {
    const testKey = '__neon_notes_storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const getBrowserStorage = (type: StorageType): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const storage = window[type];
  return canUseStorage(storage) ? storage : null;
};

const safeGetItem = (storage: Storage | null): string | null => {
  if (!storage) {
    return null;
  }
  try {
    return storage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

const safeSetItem = (storage: Storage | null, value: string): boolean => {
  if (!storage) {
    return false;
  }
  try {
    storage.setItem(TOKEN_STORAGE_KEY, value);
    return true;
  } catch {
    return false;
  }
};

const safeRemoveItem = (storage: Storage | null): void => {
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    return;
  }
};

const isTokenSafe = (token: string): boolean => TOKEN_PATTERN.test(token);

export const storeAuthToken = (token: string, persistence: TokenPersistence): TokenStorageResult => {
  if (!isTokenSafe(token)) {
    clearStoredAuthTokens();
    return { stored: false, fallbackToMemory: false, target: persistence === 'temporary' ? 'sessionStorage' : 'localStorage' };
  }

  const sessionStorage = getBrowserStorage('sessionStorage');
  const localStorage = getBrowserStorage('localStorage');

  if (persistence === 'temporary') {
    const stored = safeSetItem(sessionStorage, token);
    const fallbackToMemory = !stored;
    memorySessionToken = fallbackToMemory ? token : null;
    safeRemoveItem(localStorage);
    memoryPersistentToken = null;
    return { stored, fallbackToMemory, target: 'sessionStorage' };
  }

  const stored = safeSetItem(localStorage, token);
  const fallbackToMemory = !stored;
  memoryPersistentToken = fallbackToMemory ? token : null;
  safeRemoveItem(sessionStorage);
  memorySessionToken = null;
  return { stored, fallbackToMemory, target: 'localStorage' };
};

export const getAuthToken = (): string | null => {
  const sessionStorage = getBrowserStorage('sessionStorage');
  const localStorage = getBrowserStorage('localStorage');

  const sessionToken = safeGetItem(sessionStorage) ?? memorySessionToken;
  if (sessionToken) {
    return sessionToken;
  }

  return safeGetItem(localStorage) ?? memoryPersistentToken;
};

export const getAuthTokenStorageState = (): { sessionStorageBlocked: boolean; localStorageBlocked: boolean } => ({
  sessionStorageBlocked: typeof window !== 'undefined' ? !canUseStorage(window.sessionStorage) : false,
  localStorageBlocked: typeof window !== 'undefined' ? !canUseStorage(window.localStorage) : false,
});

export const clearStoredAuthTokens = (): void => {
  const sessionStorage = getBrowserStorage('sessionStorage');
  const localStorage = getBrowserStorage('localStorage');

  safeRemoveItem(sessionStorage);
  safeRemoveItem(localStorage);
  memorySessionToken = null;
  memoryPersistentToken = null;
};
