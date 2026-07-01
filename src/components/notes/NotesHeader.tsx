'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { UserProfile } from '@/components/auth/UserProfile';

interface NotesHeaderProps {
  onSearchChange: (term: string) => void;
  showSettings?: boolean;
}

export function NotesHeader({ onSearchChange }: NotesHeaderProps) {
  return (
    <header className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <h1 className="font-headline text-4xl text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]">
        Neon Notes
      </h1>
      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-nowrap">
        <div className="relative w-full sm:flex-1 md:w-64 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-10 h-11"
            onChange={(e) => onSearchChange(e.target.value)}
          />
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
            aria-label="Open Neon Notes GitHub repository in a new tab"
            className="flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            <span className="font-note text-sm">View Source</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </Link>
        </Button>
        <UserProfile />
      </div>
    </header>
  );
}
