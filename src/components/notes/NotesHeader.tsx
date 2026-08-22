'use client';

import { useRef, useEffect, useState, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Github, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import { UserProfile } from '@/components/auth/UserProfile';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';
import { useAuth } from '@/hooks/use-auth';

interface NotesHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

// Bolt Optimization: Wrap NotesHeader with React.memo to prevent unnecessary re-renders when dashboard state (like viewingNote) updates.
export const NotesHeader = memo(function NotesHeader({ searchTerm, onSearchChange }: NotesHeaderProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kbdShortcut, setKbdShortcut] = useState('Ctrl');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);
      setKbdShortcut(isMac ? '⌘' : 'Ctrl');
    }

  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Title & Mobile Profile Row */}
      <div className="flex w-full items-center justify-between md:w-auto">
        <div className="flex items-center gap-3">
          <Image
            src="/favicon.svg"
            alt="Neon Notes Logo"
            width={60}
            height={60}
            className="drop-shadow-[0_0_5px_hsl(var(--primary))]"
          />
          <h1 className="font-headline text-4xl text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]">
            Neon Notes
          </h1>
        </div>
        <div className="block md:hidden">
          <UserProfile />
        </div>
      </div>
      
      {/* Actions Row */}
      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-nowrap">
        <div className="relative w-full sm:flex-1 md:w-64 md:flex-none md:focus-within:w-80 transition-all duration-300 ease-in-out group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
          <Input
            ref={inputRef}
            type="search"
            value={searchTerm}
            placeholder="Search notes..."
            className="pl-10 pr-10 md:pr-24 h-11 focus-visible:ring-primary/50 focus-visible:shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-all duration-300 [&::-webkit-search-cancel-button]:hidden"
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                if (searchTerm) {
                  onSearchChange('');
                } else {
                  inputRef.current?.blur();
                }
              }
            }}
          />
          {searchTerm && (
            <button
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 md:right-20 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border border-primary/20 bg-muted/30 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 md:flex group-focus-within:border-primary/50 group-focus-within:text-primary/70">
            <span className="text-[10px]">{kbdShortcut}</span>K
          </kbd>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full border-primary/60 bg-card/70 px-3 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)] transition-all duration-300 hover:border-primary hover:bg-card hover:shadow-[0_0_18px_hsl(var(--primary)/0.45)] sm:w-auto mr-2"
        >
          <Link
            href="https://github.com/RootDeveloperDS/MY-NEON-NOTES/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('Social Click', 'Clicked GitHub Repository (Header)', user?.displayName || 'Anonymous', user?.email || null)}
            aria-label="Open Neon Notes GitHub repository in a new tab"
            className="flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            <span className="font-note text-sm">View Source</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </Link>
        </Button>
        <div className="hidden md:block">
          <UserProfile />
        </div>
      </div>
    </header>
  );
});
