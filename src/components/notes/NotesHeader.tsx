'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

interface NotesHeaderProps {
  onSearchChange: (term: string) => void;
  onLogout: () => void;
}

export function NotesHeader({ onSearchChange, onLogout }: NotesHeaderProps) {
  return (
    <header className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <h1 className="font-headline text-4xl text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]">
        Neon Notes
      </h1>
      <div className="flex w-full items-center gap-2 md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-10 h-11"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button asChild variant="ghost" size="icon" aria-label="System Status">
          <Link href="/status">
            <Settings className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Logout">
          <LogOut className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
        </Button>
      </div>
    </header>
  );
}
