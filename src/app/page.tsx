'use client';

import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/LoginPage';
import { NotesDashboard } from '@/components/notes/NotesDashboard';
import { Loader } from '@/components/ui/loader';

export default function Home() {
  const { activeUid, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader className="h-10 w-10 text-primary" />
        <p className="font-note text-muted-foreground">Verifying Credentials...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      {activeUid ? <NotesDashboard /> : <LoginPage />}
    </main>
  );
}
