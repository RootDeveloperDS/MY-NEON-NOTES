'use client';

import { useState, useEffect } from 'react';
import { getFirestore, onSnapshot, collection, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Wifi, WifiOff, Loader } from 'lucide-react';

type Status = 'checking' | 'connected' | 'error';

export default function StatusPage() {
  const [connectionStatus, setConnectionStatus] = useState<Status>('checking');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    try {
      const firestore = getFirestore();
      // Using a non-reserved collection name for the health check.
      const unsubscribe = onSnapshot(
        doc(collection(firestore, 'status-check')), // a lightweight check
        {
          next: () => {
            if (connectionStatus === 'checking') {
               setConnectionStatus('connected')
            }
          },
          error: (err) => {
            setConnectionStatus('error');
            setErrorDetails(err.message);
          },
        }
      );
      
      const timeout = setTimeout(() => {
          if (connectionStatus === 'checking') {
              setConnectionStatus('error');
              setErrorDetails('Connection timed out. This often happens if the database hasn\'t been created in Firebase or if security rules are too restrictive.');
          }
      }, 10000);

      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } catch (e: any) {
      setConnectionStatus('error');
      setErrorDetails(e.message);
    }
  }, [connectionStatus]);

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

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
        <CardContent className="font-note space-y-6">
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
          
          {connectionStatus === 'connected' && (
            <div className="rounded-md border border-green-400/50 bg-green-400/10 p-4">
              <h3 className="font-bold text-green-400">Connection Successful</h3>
              <p className="mt-2 text-sm text-green-400/90">
                Your app is successfully connected to the Firestore database. If notes are still not saving, ensure your security rules allow writes to the 'notes' collection.
              </p>
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                <h3 className="font-bold text-destructive">Troubleshooting Tips</h3>
                <p className='text-sm text-destructive/80 mt-2 mb-3'><strong>Error:</strong> {errorDetails}</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-destructive/90 space-y-2">
                    <li><strong>Most Common Fix:</strong> Have you created the Firestore database in your Firebase project? Go to the "Firestore Database" section in the Firebase Console and click "Create database".</li>
                    <li><strong>Security Rules:</strong> During creation, select **"Start in test mode"**. If you already created it, go to the "Rules" tab in Firestore and ensure your rules allow writes (for testing, you can use `allow read, write: if true;`).</li>
                    <li>Double-check that you have copied your Firebase config values correctly into your <strong>.env.local</strong> file.</li>
                    <li>Check your browser's developer console (F12) for more specific error messages.</li>
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
