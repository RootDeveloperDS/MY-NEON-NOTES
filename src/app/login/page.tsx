'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/LoginPage';
import Image from 'next/image';

export default function LoginRoute() {
  const { activeUid, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && activeUid) {
      router.replace('/');
    }
  }, [activeUid, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background">
        <div className="relative">
          {/* Glowing background ring */}
          <div className="absolute inset-0 -m-1 rounded-full bg-primary/20 blur-md animate-pulse" />
          <Image
            src="/favicon.svg"
            alt="Neon Notes Logo"
            width={64}
            height={64}
            className="relative animate-pulse drop-shadow-[0_0_15px_hsl(var(--primary))]"
            priority
          />
        </div>
        <p className="font-note text-sm uppercase tracking-[0.2em] text-primary/80 animate-pulse">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  if (activeUid) return null;

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <LoginPage />
    </main>
  );
}
