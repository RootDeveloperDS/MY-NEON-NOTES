'use client';

import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/LoginPage';
import { NotesDashboard } from '@/components/notes/NotesDashboard';
import { Loader } from '@/components/ui/loader';

export default function Home() {
  const { activeUid, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      {activeUid ? <NotesDashboard /> : <LoginPage />}
    </main>
  );
}
