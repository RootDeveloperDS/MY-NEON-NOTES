'use client';

import { useState, useEffect } from 'react';
import { LoginPage } from '@/components/auth/LoginPage';
import { NotesDashboard } from '@/components/notes/NotesDashboard';
import { Loader } from '@/components/ui/loader';

const AUTH_KEY = 'neon-notes-auth';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const authStatus = localStorage.getItem(AUTH_KEY);
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Could not access localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Could not access localStorage:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Could not access localStorage:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      {isAuthenticated ? (
        <NotesDashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </main>
  );
}
