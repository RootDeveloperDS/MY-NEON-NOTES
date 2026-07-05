'use client';

import * as React from 'react';
import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  signInWithCustomToken,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
export type TokenPersistence = 'temporary' | 'persistent';
import { apiFetch } from '@/lib/api-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from './use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthContextType {
  user: User | null; // Firebase user object
  activeUid: string | null; // The UID to use for DB operations (from Firebase or URL)
  loading: boolean;
  isUrlAuth: boolean; // Flag to indicate if auth is from URL
  signInWithGoogle: (persistence: TokenPersistence) => Promise<void>;
  signInWithEmail: (email: string, password: string, persistence: TokenPersistence) => Promise<void>;
  signUpWithEmail: (email: string, password: string, persistence: TokenPersistence) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEFAULT_IDLE_LOGOUT_MS = 15 * 60 * 1000; //15 minutes logout timer
const IDLE_WARNING_LEAD_MS = 60 * 1000; // To Show warning 1 minute before logout, can be configured via env by adjusting the idle logout time and warning lead time accordingly. For example, for a 30 minute logout timer, you might set the warning lead time to 5 minutes (300000 ms) to give users ample notice.

const getIdleTimeoutMs = () => {
  const rawValue = process.env.NEXT_PUBLIC_IDLE_LOGOUT_MS;
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_IDLE_LOGOUT_MS;
  }
  return parsed;
};

function AuthProviderInternal({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeUid, setActiveUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUrlAuth, setIsUrlAuth] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const urlUid = searchParams.get('UID');
    
    if (urlUid) {
      // Prevent re-running if we already authenticated via URL
      if (isUrlAuth && activeUid === urlUid) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      apiFetch(`https://visar-backend.onrender.com/api/verify_uid_return_customtoken_for_neon_notes?uid=${urlUid}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(async data => {
          if (data.valid) {
            if (data.customToken) {
              await signInWithCustomToken(auth, data.customToken);
              setActiveUid(urlUid);
              setIsUrlAuth(true);
              toast({ title: 'Login Successful', description: 'Logged in securely via URL.' });
            } else {
              // Fallback for backwards compatibility if backend is not updated yet
              setActiveUid(urlUid);
              setIsUrlAuth(true);
              toast({ title: 'Login Successful', description: 'Logged in using URL UID (Unsecured Mode).' });
            }
          } else {
            toast({ variant: 'destructive', title: 'Invalid UID', description: 'The UID in the URL is not valid. Please log in normally.' });
            setIsUrlAuth(false);
            // Fallback to normal auth
            const unsubscribe = onAuthStateChanged(auth, (user) => {
              setUser(user);
              setActiveUid(user?.uid || null);
              setLoading(false);
            });
            return unsubscribe;
          }
        })
        .catch((err) => {
          toast({ variant: 'destructive', title: 'API Error', description: `Could not verify UID: ${err.message}` });
          setIsUrlAuth(false);
        })
        .finally(() => {
            setLoading(false);
        });

    } else {
       // Standard Firebase Auth
       const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        if (!isUrlAuth) {
          setActiveUid(user ? user.uid : null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const applyPersistence = async (persistence: TokenPersistence) => {
    if (typeof window !== 'undefined') {
      if (persistence === 'temporary') {
        sessionStorage.setItem('neon_auth_persistence', 'temporary');
      } else {
        sessionStorage.removeItem('neon_auth_persistence');
      }
    }
    const firebasePersistence = persistence === 'temporary' ? browserSessionPersistence : browserLocalPersistence;
    await setPersistence(auth, firebasePersistence);
  };

  const signInWithGoogle = async (persistence: TokenPersistence) => {
    await applyPersistence(persistence);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  
  const signUpWithEmail = async (email: string, password: string, persistence: TokenPersistence) => {
    await applyPersistence(persistence);
    await createUserWithEmailAndPassword(auth, email, password);
  };
  
  const signInWithEmail = async (email: string, password: string, persistence: TokenPersistence) => {
    await applyPersistence(persistence);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = useCallback(async () => {
    try {
      setIsUrlAuth(false);
      setActiveUid(null);
      setUser(null);
      await signOut(auth);
    } finally {
      // Use window.location.href to force a hard reload and completely wipe any ?UID= query parameters
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (!activeUid) {
      return;
    }

    const isTemporary = typeof window !== 'undefined' && sessionStorage.getItem('neon_auth_persistence') === 'temporary';
    if (!isTemporary && !isUrlAuth) {
      return; // Do not run idle logout for persistent sessions.
    }

    const idleTimeoutMs = getIdleTimeoutMs();
    const warningTimeoutMs = idleTimeoutMs - IDLE_WARNING_LEAD_MS;
    const throttleMs = 1000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let warningId: ReturnType<typeof setTimeout> | null = null;
    let throttleId: ReturnType<typeof setTimeout> | null = null;
    let lastRun = 0;

    const resetTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (warningId) {
        clearTimeout(warningId);
      }

      if (warningTimeoutMs > 0) {
        warningId = setTimeout(() => {
          toast({
            title: 'Session expiring soon',
            description: 'You will be logged out in 1 minute due to inactivity.',
          });
        }, warningTimeoutMs);
      }

      timeoutId = setTimeout(() => {
        void logout();
      }, idleTimeoutMs);
    };

    const throttledReset = () => {
      const now = Date.now();
      const remaining = throttleMs - (now - lastRun);

      if (remaining <= 0) {
        lastRun = now;
        resetTimer();
        return;
      }

      if (throttleId) {
        return;
      }

      throttleId = setTimeout(() => {
        throttleId = null;
        lastRun = Date.now();
        resetTimer();
      }, remaining);
    };

    const events: Array<keyof WindowEventMap> = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((eventName) => {
      window.addEventListener(eventName, throttledReset, { passive: true });
    });

    resetTimer();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (throttleId) {
        clearTimeout(throttleId);
      }
      if (warningId) {
        clearTimeout(warningId);
      }
      events.forEach((eventName) => {
        window.removeEventListener(eventName, throttledReset);
      });
    };
  }, [activeUid, logout, toast]);

  const value = { user, activeUid, loading, isUrlAuth, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    // Suspense Boundary is needed for useSearchParams in child
    return (
        <React.Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><Loader /></div>}>
            <AuthProviderInternal>{children}</AuthProviderInternal>
        </React.Suspense>
    );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Need a loader for suspense
export function Loader({ className, ...props }: React.ComponentProps<typeof Loader2>) {
  return (
    <Loader2 className={cn("animate-spin", className)} {...props} />
  );
}
