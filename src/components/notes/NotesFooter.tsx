'use client';

import Link from 'next/link';
import { ExternalLink, Github, Heart } from 'lucide-react';

const TECH_STACK = ['React', 'Next.js', 'Firebase', 'TailwindCSS', 'Genkit'];

export function NotesFooter() {
  return (
    <footer className="mt-14 border-t border-primary/25 bg-card/40 px-5 py-7 backdrop-blur-sm animate-footer-fade">
      <div className="font-body flex flex-col gap-6 text-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:text-left">
        <div className="space-y-2.5">
          <p className="text-sm leading-relaxed text-foreground md:text-base">
            Neon Notes — made by{' '}
            <Link
              href="https://devanshsharma.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Devansh Sharma portfolio"
              className="font-medium text-primary underline decoration-primary/70 underline-offset-4 transition-colors hover:text-accent"
            >
              Devansh Sharma
            </Link>{' '}
            (RootDeveloperDS)
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Built with <span aria-hidden="true">🛠️</span> and
            <Heart className="mx-1 inline h-3.5 w-3.5 text-destructive" aria-hidden="true" />
            <span className="sr-only"> love</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 lg:max-w-md">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-primary/35 bg-background/55 px-2.5 py-1 text-xs font-medium text-foreground/90"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="space-y-2.5 lg:text-right">
          <p className="text-sm leading-relaxed text-muted-foreground">100% Open Source • Contributions are Welcome</p>
          <p className="text-sm leading-relaxed text-muted-foreground">⭐ Star the repo if you like the project</p>
          <Link
            href="https://github.com/RootDeveloperDS/MY-NEON-NOTES/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Neon Notes repository on GitHub"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary underline decoration-primary/60 underline-offset-4 transition-colors duration-200 hover:text-accent"
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
