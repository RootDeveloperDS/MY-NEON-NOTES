'use client';

import * as React from 'react';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';
import { useToast } from './use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthContextType {
  user: User | null; // Firebase user object
  activeUid: string | null; // The UID to use for DB operations (from Firebase or URL)
  loading: boolean;
  isUrlAuth: boolean; // Flag to indicate if auth is from URL
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInternal({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeUid, setActiveUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUrlAuth, setIsUrlAuth] = useState(false);
  const searchParams = useSearchParams();
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
      fetch(`https://visar-backend.onrender.com/api/verify_uid?uid=${urlUid}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => {
          if (data.valid) {
            setActiveUid(urlUid);
            setIsUrlAuth(true);
            toast({ title: 'Login Successful', description: 'Logged in using URL UID.' });
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

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  
  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    // For URL auth, we just redirect to the base URL
    if (isUrlAuth) {
      window.location.href = '/';
    } else {
      await signOut(auth);
    }
  };

  const value = { user, activeUid, loading, isUrlAuth, signInWithGoogle, signInWithEmail, signUpWithEmail, logout };

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
