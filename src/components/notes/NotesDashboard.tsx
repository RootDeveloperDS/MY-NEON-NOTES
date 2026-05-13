'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Note } from '@/lib/types';
import { NotesHeader } from '@/components/notes/NotesHeader';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteModal } from '@/components/notes/NoteModal';
import { NoteViewer } from '@/components/notes/NoteViewer';
import { NotesFooter } from '@/components/notes/NotesFooter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const splitViewHeightClass = 'lg:h-[calc(100vh-12rem)]';
const splitViewGridClass = 'lg:grid-cols-[minmax(260px,32%)_1fr]';
const activeSidebarGlowClass = 'shadow-[0_0_16px_hsl(var(--primary)/0.35)]';
const dashboardBottomSpacingClass = 'pb-28 md:pb-32';

export function NotesDashboard() {
  const { activeUid, loading: authLoading, logout, isUrlAuth } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [isViewerDeleteDialogOpen, setIsViewerDeleteDialogOpen] = useState(false);

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
      // This is often a permissions error if Firestore rules are incorrect.
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeUid, authLoading]);

  const handleOpenModal = (note: Note | null = null) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

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
      hasUpdatedAtChanged;

    if (hasViewerContentChanged) {
      setViewingNote(latestViewingNote);
    }
  }, [latestViewingNote, viewingNote]);

  const handleViewNote = (note: Note) => {
    setViewingNote(note);
  };

  const handleCopyViewerNote = () => {
    if (!viewingNote) return;
    navigator.clipboard.writeText(viewingNote.content);
    toast({
      title: 'Note Copied',
      description: 'The note content has been copied to your clipboard.',
    });
  };

  const handleDeleteViewerNote = async () => {
    if (!viewingNote) return;

    try {
      await deleteDoc(doc(db, 'notes', viewingNote.id));
      toast({
        title: 'Note Deleted',
        description: 'The note has been successfully deleted.',
      });
      setViewingNote(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the note.',
      });
    }

    setIsViewerDeleteDialogOpen(false);
  };

  return (
    <div className={`relative min-h-screen p-4 md:p-8 ${dashboardBottomSpacingClass}`}>
      <NotesHeader
        onSearchChange={setSearchTerm}
        onLogout={logout}
        showSettings={!isUrlAuth}
      />

      {loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {!viewingNote ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onView={() => handleViewNote(note)}
                  onEdit={() => handleOpenModal(note)}
                />
              ))}
            </div>
          ) : (
              <div className={`mt-8 transition-all duration-300 lg:grid ${splitViewHeightClass} ${splitViewGridClass} lg:gap-5`}>
              <aside className="hidden lg:block overflow-y-auto pr-1">
                <div className="space-y-2">
                  {filteredNotes.map((note) => {
                    const isActive = note.id === viewingNote.id;
                    const relativeTime = note.updatedAt
                      ? formatDistanceToNow(note.updatedAt.toDate(), { addSuffix: true })
                      : 'just now';

                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => handleViewNote(note)}
                        className={`w-full rounded-lg border p-3 text-left transition-all duration-200 ${
                          isActive
                            ? `border-primary/80 bg-primary/10 ${activeSidebarGlowClass}`
                            : 'border-primary/20 bg-card/70 hover:border-primary/60 hover:bg-card'
                        }`}
                      >
                        <p className="truncate font-note text-sm text-primary">{note.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{relativeTime}</p>
                      </button>
                    );
                  })}
                </div>
              </aside>
              <div className="hidden min-w-0 lg:block">
                <NoteViewer
                  note={viewingNote}
                  onEdit={() => handleOpenModal(viewingNote)}
                  onCopy={handleCopyViewerNote}
                  onDelete={() => setIsViewerDeleteDialogOpen(true)}
                />
              </div>
            </div>
          )}
        </>
      )}
      
      {activeUid && filteredNotes.length === 0 && !loading && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">No notes found.</h2>
          <p className="text-muted-foreground">Create your first note to get started.</p>
        </div>
      )}

      <Button
        onClick={() => handleOpenModal()}
        className="fixed bottom-4 right-4 z-30 md:bottom-8 md:right-8 h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary text-primary-foreground shadow-lg animate-neon-glow"
        aria-label="Add new note"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        note={selectedNote}
      />

      {viewingNote && (
        <div className="fixed inset-0 z-50 bg-background p-4 sm:p-6 lg:hidden">
          <div className="h-full">
            <NoteViewer
              note={viewingNote}
              onBack={() => setViewingNote(null)}
              onEdit={() => handleOpenModal(viewingNote)}
              onCopy={handleCopyViewerNote}
              onDelete={() => setIsViewerDeleteDialogOpen(true)}
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

      <NotesFooter />
    </div>
  );
}
