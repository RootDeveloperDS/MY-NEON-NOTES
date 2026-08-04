'use client';

import Link from 'next/link';
import { ExternalLink, Github, Globe, Mail, Linkedin, Twitter, Send, Monitor } from 'lucide-react';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';
import { useAuth } from '@/hooks/use-auth';

export function NotesFooter() {
  const { user } = useAuth();
  
  return (
    <footer className="mt-14 border-t border-primary/25 bg-card/40 pb-12 pt-14 backdrop-blur-sm animate-footer-fade">
      <div className="w-full px-4 md:px-8 flex flex-col md:flex-row justify-between gap-12 md:gap-8">
        
        {/* Brand & Identity */}
        <div className="flex flex-col gap-5 md:w-2/5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/favicon.svg"
              alt="Neon Notes Logo"
              width={36}
              height={36}
              className="opacity-90 drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
            />
            <span className="font-headline text-3xl text-primary drop-shadow-[0_0_5px_hsl(var(--primary)/0.8)] leading-none tracking-wide">
              Neon Notes
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed pr-4">
            A futuristic, neon-themed workspace designed for secure note-taking, dynamic idea generation, and structured knowledge management. Built with Next.js and Firebase.
          </p>
          <div className="text-sm text-muted-foreground mt-2">
            &copy; {new Date().getFullYear()} Neon Notes.
            <br className="mb-1" />
            Product by <a href="https://devanshsharma.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:text-accent transition-colors underline decoration-primary/50 underline-offset-4">Devansh Sharma</a> (RootDeveloperDS)
          </div>
        </div>

        {/* Navigation / Quick Links */}
        <div className="flex flex-col gap-4 md:w-1/4">
          <h3 className="font-semibold text-foreground tracking-widest uppercase text-xs font-headline text-primary/80">Navigation</h3>
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex w-fit">Dashboard</Link>
            <a 
              href="https://github.com/RootDeveloperDS/MY-NEON-NOTES/" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => trackEvent('Social Click', 'Clicked GitHub Repository', user?.displayName || 'Anonymous', user?.email || null)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 w-fit">
              GitHub Repository <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
            <a href="https://github.com/RootDeveloperDS/MY-NEON-NOTES/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex w-fit">MIT License</a>
          </nav>
        </div>

        {/* Connect & Socials */}
        <div className="flex flex-col gap-4 md:w-1/3">
          <h3 className="font-semibold text-foreground tracking-widest uppercase text-xs font-headline text-primary/80">Connect</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Monitor, label: "Portfolio", href: "https://devanshsharma.vercel.app/" },
              { icon: Globe, label: "Business", href: "https://rootdeveloperds.odoo.com" },
              { icon: Mail, label: "Email", href: "mailto:developersofroot@gmail.com" },
              { icon: Github, label: "GitHub", href: "https://github.com/RootDeveloperDS" },
              { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/devanshsharma987" },
              { icon: Twitter, label: "X/Twitter", href: "https://x.com/devanshsha6563" },
              { icon: Send, label: "Telegram", href: "https://t.me/developerofroot" },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Social Click', `Clicked ${link.label}`, user?.displayName || 'Anonymous', user?.email || null)}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-background border border-primary/30 text-muted-foreground shadow-[0_0_10px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] hover:scale-110"
                aria-label={link.label}
              >
                <link.icon className="h-4 w-4" />
                <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 scale-50 whitespace-nowrap rounded border border-primary/50 bg-card px-2 py-1 text-[11px] font-medium text-foreground shadow-md opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 font-note z-10">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
