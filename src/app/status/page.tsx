'use client';

import { useState, useEffect } from 'react';
import { getFirestore, onSnapshot, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Wifi, WifiOff, Loader } from 'lucide-react';

type Status = 'checking' | 'connected' | 'error';

export default function StatusPage() {
  const [connectionStatus, setConnectionStatus] = useState<Status>('checking');

  useEffect(() => {
    try {
      const firestore = getFirestore();
      // Using a lightweight query to check connection.
      // onSnapshot on a non-existent document is a low-cost way to check.
      const unsubscribe = onSnapshot(collection(firestore, 'notes'), {
        next: () => setConnectionStatus('connected'),
        error: () => setConnectionStatus('error'),
      });
      
      // If we don't get a response in 10 seconds, assume error.
      const timeout = setTimeout(() => {
          if (connectionStatus === 'checking') {
              setConnectionStatus('error');
          }
      }, 10000);

      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } catch (e) {
      setConnectionStatus('error');
    }
  }, [connectionStatus]);

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  const areVarsPresent = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;

  const StatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <div className="flex items-center text-green-400"><Wifi className="mr-2 h-5 w-5" /> Connected</div>;
      case 'error':
        return <div className="flex items-center text-destructive"><WifiOff className="mr-2 h-5 w-5" /> Connection Error</div>;
      default:
        return <div className="flex items-center text-amber-400"><Loader className="mr-2 h-5 w-5 animate-spin" /> Checking...</div>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-primary/50 bg-card/80 shadow-[0_0_15px_hsl(var(--primary)/0.5)] backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center justify-between">
            <span>System Status</span>
            <StatusIndicator />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-accent">Firebase Configuration</h3>
            <p className="text-sm text-muted-foreground">
              This checks if your Firebase environment variables are available in the browser.
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p>Project ID: <span className={firebaseConfig.projectId ? 'text-green-400' : 'text-red-400'}>{firebaseConfig.projectId || 'Not Found'}</span></p>
              <p>Auth Domain: <span className={firebaseConfig.authDomain ? 'text-green-400' : 'text-red-400'}>{firebaseConfig.authDomain || 'Not Found'}</span></p>
              <p>API Key Loaded: <span className={firebaseConfig.apiKey ? 'text-green-400' : 'text-red-400'}>{firebaseConfig.apiKey ? 'Yes' : 'No'}</span></p>
            </div>
          </div>
          
          {connectionStatus === 'error' && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                <h3 className="font-bold text-destructive">Troubleshooting Tips</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-destructive/90">
                    <li>Double-check that you have copied your Firebase config values correctly into a <strong>.env.local</strong> file in the root of the project.</li>
                    <li>Ensure your Firestore database has been created in the Firebase console.</li>
                    <li>Check your browser's developer console (F12) for any specific error messages related to Firebase or network requests.</li>
                    <li>Make sure your Firestore security rules allow read/write operations. For testing, you can set them to be public (but be sure to secure them later!).</li>
                </ul>
            </div>
          )}

        </CardContent>
      </Card>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> Back to App</Link>
      </Button>
    </div>
  );
}
