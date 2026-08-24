'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Note } from '@/lib/types';
import dynamic from 'next/dynamic';
import { detectContentType, LANGUAGE_DISPLAY_NAMES } from '@/lib/code-detect';
import { ViewModeToggle, type ViewMode } from '@/components/notes/ViewModeToggle';
import { Loader, Globe, FileCode2, BookText, Copy, Check, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { NotesFooter } from '@/components/notes/NotesFooter';
import { useAuth } from '@/hooks/use-auth';
import { trackEvent } from '@/lib/analytics';

const NoteCodeBlock = dynamic(() => import('@/components/notes/NoteCodeBlock').then(mod => mod.NoteCodeBlock), { ssr: false });
const NoteMarkdown = dynamic(() => import('@/components/notes/NoteMarkdown').then(mod => mod.NoteMarkdown), { ssr: false });

export default function SharedNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const hasTrackedRef = useRef<string | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('markdown');
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isContentCopied, setIsContentCopied] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchNote = async () => {
      try {
        const docRef = doc(db, 'notes', id);
        const docSnap = await getDoc(docRef);

        const isClient = typeof window !== 'undefined';
        const fullPath = isClient
          ? `${window.location.pathname}${window.location.search}${window.location.hash}`
          : `/shared/${id}`;

        if (docSnap.exists()) {
          const noteData = docSnap.data() as Note;
          if (noteData.isPublic) {
            setNote({ ...noteData, id: docSnap.id });

            if (hasTrackedRef.current !== id) {
              hasTrackedRef.current = id;
              const details = [
                `Note Title: ${noteData.title}`,
                `Note ID: ${docSnap.id}`,
                `Note Author ID: ${noteData.userId || 'Unknown'}`,
                `Route: ${fullPath}`,
              ].join('\n');

              trackEvent(
                'Shared Note Visit',
                details,
                user?.displayName || 'Shared Visitor (Guest)',
                user?.email || null
              );
            }
          } else {
            setError('This note is private.');

            if (hasTrackedRef.current !== id) {
              hasTrackedRef.current = id;
              const details = [
                `Note Title: ${noteData.title || 'Private Note'}`,
                `Note ID: ${docSnap.id}`,
                `Status: Access Denied (Private)`,
                `Route: ${fullPath}`,
              ].join('\n');

              trackEvent(
                'Shared Note Visit (Private)',
                details,
                user?.displayName || 'Shared Visitor (Guest)',
                user?.email || null
              );
            }
          }
        } else {
          setError('Note not found.');

          if (hasTrackedRef.current !== id) {
            hasTrackedRef.current = id;
            const details = [
              `Note ID: ${id}`,
              `Status: Note Not Found / Deleted`,
              `Route: ${fullPath}`,
            ].join('\n');

            trackEvent(
              'Shared Note Visit (Not Found)',
              details,
              user?.displayName || 'Shared Visitor (Guest)',
              user?.email || null
            );
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load the note.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, user]);

  const contentDetection = useMemo(
    () => (note ? detectContentType(note.content) : null),
    [note]
  );

  useEffect(() => {
    if (contentDetection) {
      setViewMode(contentDetection.isMarkdown || contentDetection.isCode ? 'markdown' : 'raw');
    }
  }, [contentDetection]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: note?.title || 'Neon Note',
          url: window.location.href,
        });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    handleCopyLink();
  };

  const handleCopyContent = async () => {
    if (!note) return;
    try {
      await navigator.clipboard.writeText(note.content);
      setIsContentCopied(true);
      setTimeout(() => setIsContentCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">Decrypting Note...</p>
      </div>
    );
  }

  if (error || !note || !contentDetection) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <h1 className="text-3xl font-headline text-destructive tracking-widest uppercase">Access Denied</h1>
        <p className="font-note text-muted-foreground max-w-md">{error}</p>
        <Button variant="outline" className="mt-4 border-primary/20 hover:bg-primary/10" onClick={() => router.push('/')}>
          Return to Neon Notes
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body p-4 sm:p-8 flex flex-col">
      <div className="mx-auto w-full max-w-4xl flex-grow space-y-8">
        {/* Top Navigation Bar */}
        <nav className="flex items-center justify-between border-b border-primary/10 pb-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" title="Neon Notes Home">
            <Image
              src="/favicon.svg"
              alt="Neon Notes Logo"
              width={32}
              height={32}
              priority
              className="drop-shadow-[0_0_5px_hsl(var(--primary))] transition-transform group-hover:scale-105"
            />
            <span className="font-headline text-lg tracking-widest text-primary drop-shadow-[0_0_5px_hsl(var(--primary)/0.6)] group-hover:text-primary transition-colors hidden sm:inline-block">
              NEON NOTES
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <ViewModeToggle mode={viewMode} onModeChange={setViewMode} />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyContent}
              title={isContentCopied ? 'Content copied to clipboard!' : 'Copy note content'}
              aria-label="Copy note content"
              className="h-8 px-2 sm:h-9 sm:px-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {isContentCopied ? (
                <Check className="h-4 w-4 mr-0 sm:mr-2 text-green-500 shrink-0" />
              ) : (
                <Copy className="h-4 w-4 mr-0 sm:mr-2 shrink-0" />
              )}
              <span className="hidden sm:inline">{isContentCopied ? 'Content Copied' : 'Copy Content'}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              title={isLinkCopied ? 'Share link copied!' : 'Share note link'}
              aria-label="Share note link"
              className="h-8 px-2 sm:h-9 sm:px-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {isLinkCopied ? (
                <Check className="h-4 w-4 mr-0 sm:mr-2 text-green-500 shrink-0" />
              ) : (
                <Share2 className="h-4 w-4 mr-0 sm:mr-2 shrink-0" />
              )}
              <span className="hidden sm:inline">{isLinkCopied ? 'Link Copied' : 'Share Link'}</span>
            </Button>
          </div>
        </nav>

        {/* Note Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 font-semibold text-green-500 shadow-sm uppercase tracking-wider">
              <Globe className="h-3 w-3" />
              Public Note
            </span>
            <span>•</span>
            <span className="font-mono uppercase tracking-widest">{note.updatedAt ? format(note.updatedAt.toDate(), 'PPpp') : ''}</span>
            {contentDetection.isMarkdown && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-semibold text-accent uppercase tracking-wider">
                  <BookText className="h-3 w-3" />
                  Markdown
                </span>
              </>
            )}
            {contentDetection.isCode && contentDetection.language !== 'unknown' && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-semibold text-primary uppercase tracking-wider">
                  <FileCode2 className="h-3 w-3" />
                  {LANGUAGE_DISPLAY_NAMES[contentDetection.language]}
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-headline text-primary break-words leading-tight shadow-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            {note.title}
          </h1>
        </header>

        {/* Note Content */}
        <section className="min-h-[300px] w-full">
          {viewMode === 'raw' ? (
            <div className="rounded-xl overflow-hidden border border-primary/20 bg-card/40 p-6 shadow-inner">
              <pre className="whitespace-pre-wrap break-words font-note text-sm sm:text-base leading-relaxed text-foreground/90 select-text">
                {note.content}
              </pre>
            </div>
          ) : contentDetection.isCode ? (
            <div className="rounded-xl overflow-hidden border border-primary/20 shadow-[0_0_30px_hsl(var(--primary)/0.05)]">
              <NoteCodeBlock content={note.content} language={contentDetection.language} className="!m-0 text-xs sm:text-sm !p-6" />
            </div>
          ) : (
            <div className="rounded-xl border border-primary/15 bg-card/30 p-6 sm:p-8 shadow-[0_0_30px_hsl(var(--primary)/0.05)]">
              <NoteMarkdown content={note.content} />
            </div>
          )}
        </section>
      </div>
      
      <div className="w-full">
        <NotesFooter />
      </div>
    </main>
  );
}
