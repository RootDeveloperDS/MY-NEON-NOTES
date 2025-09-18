'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, use a backend to verify the password.
    // For this demo, we use an environment variable.
    if (password === process.env.NEXT_PUBLIC_MASTER_PASSWORD) {
      setError('');
      onLoginSuccess();
    } else {
      setError('ACCESS DENIED');
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm border-primary/50 bg-card/80 shadow-[0_0_15px_hsl(var(--primary)/0.5)] backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">NEON NOTES</CardTitle>
          <CardDescription>System Access Protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="ENTER MASTER KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-center text-lg tracking-[0.2em] focus-visible:ring-offset-0 focus-visible:ring-primary/80"
              />
            </div>
            {error && (
              <div
                className="relative text-center font-bold text-destructive glitch"
                data-text={error}
              >
                {error}
              </div>
            )}
            <Button type="submit" className="w-full font-bold uppercase tracking-widest hover:bg-primary/90 hover:text-primary-foreground hover:shadow-[0_0_10px_hsl(var(--primary))]">
              Initiate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
