'use client';

import Link from 'next/link';
import { ExternalLink, Github, Heart } from 'lucide-react';

const TECH_STACK = ['React', 'Next.js', 'Firebase', 'TailwindCSS', 'Genkit'];

export function NotesFooter() {
  return (
    <footer className="mt-12 rounded-xl border border-primary/30 border-t-primary/60 bg-card/60 px-5 py-6 shadow-[0_-2px_20px_hsl(var(--primary)/0.18)] backdrop-blur-sm animate-footer-fade">
      <div className="flex flex-col gap-6 text-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:text-left">
        <div className="space-y-2">
          <p className="font-note text-primary">
            Neon Notes — made by Devansh Sharma (RootDeveloperDS)
          </p>
          <p className="text-sm text-muted-foreground" aria-label="Built with tools and love">
            Built with <span aria-hidden="true">🛠️</span> and <Heart className="mx-1 inline h-3.5 w-3.5 text-destructive" aria-hidden="true" />
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 lg:max-w-md">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-primary/50 bg-background/60 px-2.5 py-1 text-xs text-primary shadow-[0_0_10px_hsl(var(--primary)/0.22)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="space-y-2 lg:text-right">
          <p className="text-sm text-muted-foreground">100% Open Source • Contributions are Welcome</p>
          <p className="text-sm text-primary">⭐ Star the repo if you like the project</p>
          <Link
            href="https://github.com/RootDeveloperDS/MY-NEON-NOTES/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Neon Notes repository on GitHub"
            className="inline-flex items-center gap-2 text-sm text-primary transition-all duration-300 hover:text-accent hover:drop-shadow-[0_0_8px_hsl(var(--primary))]"
          >
            <Github className="h-4 w-4" />
            <span>GitHub Repository</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
