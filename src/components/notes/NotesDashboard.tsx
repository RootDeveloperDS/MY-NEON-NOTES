'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Note } from '@/lib/types';
import { NotesHeader } from '@/components/notes/NotesHeader';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteModal } from '@/components/notes/NoteModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/hooks/use-auth';

export function NotesDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!user) {
      setLoading(false);
      setNotes([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
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
  }, [user, authLoading]);

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

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <NotesHeader
        onSearchChange={setSearchTerm}
        onLogout={logout}
      />

      {loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={() => handleOpenModal(note)} />
          ))}
        </div>
      )}
      
      {user && filteredNotes.length === 0 && !loading && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">No notes found.</h2>
          <p className="text-muted-foreground">Create your first note to get started.</p>
        </div>
      )}

      <Button
        onClick={() => handleOpenModal()}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary text-primary-foreground shadow-lg animate-neon-glow"
        aria-label="Add new note"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        note={selectedNote}
      />
    </div>
  );
}
