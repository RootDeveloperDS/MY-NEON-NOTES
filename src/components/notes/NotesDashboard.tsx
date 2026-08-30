'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, useDeferredValue } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Note } from '@/lib/types';
import dynamic from 'next/dynamic';
import { NotesHeader } from '@/components/notes/NotesHeader';
import { NoteCard } from '@/components/notes/NoteCard';
import { NotesFooter } from '@/components/notes/NotesFooter';

const NoteModal = dynamic(() => import('@/components/notes/NoteModal').then(mod => mod.NoteModal), { ssr: false });
const NoteViewer = dynamic(() => import('@/components/notes/NoteViewer').then(mod => mod.NoteViewer), { ssr: false });
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { trackEvent } from '@/lib/analytics';
import { useRouter } from 'next/navigation';

const splitViewMinHeightClass = 'lg:min-h-[calc(100vh-12rem)]';
const splitViewGridClass = 'lg:grid-cols-[minmax(260px,32%)_1fr]';
const activeSidebarGlowClass = 'shadow-[0_0_16px_hsl(var(--primary)/0.35)]';

const searchCache = new WeakMap<Note, string>();

// Extract sidebar note item to a separate memoized component to avoid O(n) rendering recalculations (e.g., formatDistanceToNow) when unrelated state changes.
const SidebarNoteItem = React.memo(({
  note,
  isActive,
  onClick,
}: {
  note: Note;
  isActive: boolean;
  onClick: (note: Note) => void;
}) => {
  const relativeTime = note.updatedAt
    ? formatDistanceToNow(note.updatedAt.toDate(), { addSuffix: true })
    : 'just now';

  return (
    <button
      type="button"
      onClick={() => onClick(note)}
      className={`w-full rounded-lg border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        isActive
          ? `border-primary/80 bg-primary/10 ${activeSidebarGlowClass}`
          : 'border-primary/20 bg-card/70 hover:border-primary/60 hover:bg-card'
      }`}
    >
      <p className="truncate font-note text-sm text-primary">{note.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{relativeTime}</p>
    </button>
  );
});

export function NotesDashboard() {
  const { activeUid, user, loading: authLoading, logout, isUrlAuth } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [isViewerDeleteDialogOpen, setIsViewerDeleteDialogOpen] = useState(false);
  const [hasOpenedModal, setHasOpenedModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cols, setCols] = useState(1);
  const hasTrackedVisit = useRef(false);

  useEffect(() => {
    if (!authLoading && !hasTrackedVisit.current) {
      const userDisplay = user?.displayName || 'Anonymous';
      const userEmail = user?.email || null;
      trackEvent('App Visit', 'User landed on Dashboard', userDisplay, userEmail);
      hasTrackedVisit.current = true;
    }
  }, [authLoading, user]);

  useEffect(() => {
    setMounted(true);
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      // Debounce window resize to prevent excessive re-renders of the masonry grid layout during resizing.
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const width = window.innerWidth;
        if (width >= 1280) setCols(4);
        else if (width >= 1024) setCols(3);
        else if (width >= 640) setCols(2);
        else setCols(1);
      }, 100);
    };
    // Initial evaluation doesn't need delay
    const width = window.innerWidth;
    if (width >= 1280) setCols(4);
    else if (width >= 1024) setCols(3);
    else if (width >= 640) setCols(2);
    else setCols(1);

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!activeUid) {
      setLoading(false);
      setNotes([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', activeUid),
      orderBy('updatedAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData: Note[] = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() } as Note);
      });
      setNotes(notesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notes: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeUid, authLoading]);

  const handleOpenModal = useCallback((note: Note | null = null) => {
    if (!activeUid) {
      router.push('/login');
      return;
    }
    setSelectedNote(note);
    setIsModalOpen(true);
  }, [activeUid, router]);

  useEffect(() => {
    if (isModalOpen && !hasOpenedModal) {
      setHasOpenedModal(true);
    }
  }, [isModalOpen, hasOpenedModal]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  // Use useDeferredValue for searchTerm to avoid blocking main thread on render-heavy filter operations
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredNotes = useMemo(() => {
    if (!deferredSearchTerm) return notes;
    const lowercasedSearchTerm = deferredSearchTerm.toLowerCase();
    return notes.filter((note) => {
      let cachedString = searchCache.get(note);
      if (cachedString === undefined) {
        cachedString = `${note.title}\n${note.content}`.toLowerCase();
        searchCache.set(note, cachedString);
      }
      return cachedString.includes(lowercasedSearchTerm);
    });
  }, [notes, deferredSearchTerm]);

  const masonryColumns = useMemo(() => {
    const result: Note[][] = Array.from({ length: cols }, () => []);
    filteredNotes.forEach((note, index) => {
      result[index % cols].push(note);
    });
    return result;
  }, [filteredNotes, cols]);

  const latestViewingNote = useMemo(() => {
    if (!viewingNote) return null;
    return notes.find((note) => note.id === viewingNote.id) ?? null;
  }, [notes, viewingNote]);

  useEffect(() => {
    if (!viewingNote) return;

    if (!latestViewingNote) {
      setViewingNote(null);
      setIsViewerDeleteDialogOpen(false);
      return;
    }

    const hasUpdatedAtChanged =
      latestViewingNote.updatedAt && viewingNote.updatedAt
        ? !latestViewingNote.updatedAt.isEqual(viewingNote.updatedAt)
        : latestViewingNote.updatedAt !== viewingNote.updatedAt;

    const hasViewerContentChanged =
      latestViewingNote.title !== viewingNote.title ||
      latestViewingNote.content !== viewingNote.content ||
      latestViewingNote.isPublic !== viewingNote.isPublic ||
      hasUpdatedAtChanged;

    if (hasViewerContentChanged) {
      setViewingNote(latestViewingNote);
    }
  }, [latestViewingNote, viewingNote]);

  const handleViewNote = useCallback((note: Note) => {
    setViewingNote(note);
  }, []);

  // Stable callbacks for memoized NoteViewer
  const handleBackViewerNote = useCallback(() => {
    setViewingNote(null);
  }, []);

  const handleEditViewerNote = useCallback(() => {
    if (viewingNote) {
      handleOpenModal(viewingNote);
    }
  }, [handleOpenModal, viewingNote]);

  const handleCopyViewerNote = useCallback(() => {
    if (!viewingNote) return;
    navigator.clipboard.writeText(viewingNote.content);
    toast({
      title: 'Note Copied',
      description: 'The note content has been copied to your clipboard.',
    });
    trackEvent('Copy Note', `Copied content of note titled: "${viewingNote.title}"`, user?.displayName, user?.email);
  }, [viewingNote, toast, user]);

  const handleDeleteViewerNote = useCallback(async () => {
    if (!viewingNote) return;

    if (viewingNote.userId !== activeUid) {
      toast({
        variant: 'destructive',
        title: 'Authorization Error',
        description: 'You are not authorized to delete this note.',
      });
      setIsViewerDeleteDialogOpen(false);
      return;
    }

    try {
      await deleteDoc(doc(db, 'notes', viewingNote.id));
      toast({
        title: 'Note Deleted',
        description: 'The note has been successfully deleted.',
      });
      trackEvent('Delete Note', `Deleted note titled: "${viewingNote.title}"`, user?.displayName, user?.email);
      setViewingNote(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the note.',
      });
    }

    setIsViewerDeleteDialogOpen(false);
  }, [viewingNote, activeUid, toast, user]);

  const handleOpenViewerDeleteDialogOpen = useCallback(() => {
    setIsViewerDeleteDialogOpen(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col p-4 md:p-8 pb-4 md:pb-8">
      <div className="flex-1 pb-28 md:pb-32">
        <NotesHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

      {loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {!viewingNote ? (
            <div className="mt-8">
              {filteredNotes.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-4 pb-2">
                  <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-card/40 px-4 py-2 shadow-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/60">
                    <FileText className="h-5 w-5 text-primary opacity-80" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Total Notes</span>
                      <span className="font-headline text-xl text-primary leading-tight">{filteredNotes.length}</span>
                    </div>
                  </div>
                </div>
              )}
              {!mounted ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onView={handleViewNote}
                      onEdit={handleOpenModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                  {masonryColumns.map((colNotes, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-6">
                      {colNotes.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          onView={handleViewNote}
                          onEdit={handleOpenModal}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
              <div className={`mt-8 transition-all duration-300 lg:grid ${splitViewMinHeightClass} ${splitViewGridClass} lg:gap-5`}>
              <aside className="hidden lg:block overflow-y-auto pr-1">
                <div className="space-y-2">
                  {filteredNotes.map((note) => (
                    <SidebarNoteItem
                      key={note.id}
                      note={note}
                      isActive={note.id === viewingNote.id}
                      onClick={handleViewNote}
                    />
                  ))}
                </div>
              </aside>
              <div className="hidden min-w-0 lg:block">
                <NoteViewer
                  note={viewingNote}
                  onBack={handleBackViewerNote}
                  onEdit={handleEditViewerNote}
                  onCopy={handleCopyViewerNote}
                  onDelete={handleOpenViewerDeleteDialogOpen}
                />
              </div>
            </div>
          )}
        </>
      )}
      
      {filteredNotes.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 px-4 md:py-24">
          <div className="group relative flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-10 text-center sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="mb-6 rounded-full bg-primary/10 p-4 shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-transform duration-500 group-hover:scale-110">
               <FileText className="h-10 w-10 text-primary" />
            </div>

            {notes.length > 0 ? (
              <>
                <h2 className="mb-2 font-headline text-2xl text-primary tracking-wide drop-shadow-[0_0_5px_hsl(var(--primary)/0.5)]">
                  NO RESULTS FOUND
                </h2>
                <p className="mb-8 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                  We couldn't find any notes matching your search.
                </p>
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="relative z-10 border-primary/50 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.35)]"
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <h2 className="mb-2 font-headline text-2xl text-primary tracking-wide drop-shadow-[0_0_5px_hsl(var(--primary)/0.5)]">
                  NO NOTES FOUND
                </h2>
                <p className="mb-8 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                  Looks empty here. Create your first note and start building your knowledge.
                </p>
                <Button
                  onClick={() => handleOpenModal()}
                  variant="outline"
                  className="relative z-10 border-primary/50 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.35)]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Note
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={() => handleOpenModal()}
        className="fixed bottom-4 right-4 z-30 md:bottom-8 md:right-8 h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary text-primary-foreground shadow-lg animate-neon-glow"
        aria-label="Add new note"
        title="Add new note"
      >
        <Plus className="h-8 w-8" />
      </Button>

      {hasOpenedModal && (
        <NoteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          note={selectedNote}
          isFirstNote={notes.length === 0}
        />
      )}

      {viewingNote && (
        <div className="fixed inset-0 z-50 bg-background p-4 sm:p-6 lg:hidden">
          <div className="h-full">
            <NoteViewer
              note={viewingNote}
              onBack={handleBackViewerNote}
              onEdit={handleEditViewerNote}
              onCopy={handleCopyViewerNote}
              onDelete={handleOpenViewerDeleteDialogOpen}
            />
          </div>
        </div>
      )}

      <AlertDialog open={isViewerDeleteDialogOpen} onOpenChange={setIsViewerDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will permanently remove the selected note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteViewerNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>

      <div className="mt-auto">
        <NotesFooter />
      </div>
    </div>
  );
}
