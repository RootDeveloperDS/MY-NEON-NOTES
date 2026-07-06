'use client';

import { useState } from 'react';
import type { Note } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FilePenLine, Trash2, Copy, FileCode2, Globe, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { detectCodeBlock } from '@/lib/code-detect';
import { NoteCodeBlock } from '@/components/notes/NoteCodeBlock';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onView: () => void;
}

export function NoteCard({ note, onEdit, onView }: NoteCardProps) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
    toast({
      title: 'Note Copied',
      description: 'The note content has been copied to your clipboard.',
    });
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'notes', note.id));
      toast({
        title: 'Note Deleted',
        description: 'The note has been successfully deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the note.',
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit();
  };

  const handleCopyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleCopy();
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleShareClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      if (!note.isPublic) {
        const { updateDoc, serverTimestamp } = await import('firebase/firestore');
        await updateDoc(doc(db, 'notes', note.id), { isPublic: true, updatedAt: serverTimestamp() });
        toast({
          title: 'Note is now public!',
          description: 'Link copied. You can toggle visibility inside the note.',
        });
      } else {
        toast({
          title: 'Link Copied',
          description: 'Public link copied to clipboard.',
        });
      }
      const shareUrl = `${window.location.origin}/shared/${note.id}`;
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Share Error',
        description: 'Failed to make the note public.',
      });
    }
  };
  
  const codeDetection = detectCodeBlock(note.content);
  
  const languageLabels: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    cpp: 'C++',
    java: 'Java',
    csharp: 'C#',
    go: 'Go',
    rust: 'Rust',
    php: 'PHP',
    ruby: 'Ruby',
    unknown: '',
  };

  const relativeTime = note.updatedAt ? formatDistanceToNow(note.updatedAt.toDate()).replace('about ', '').trim() : 'just now';

  return (
    <>
      <div
        onClick={onView}
        className="group relative flex flex-col w-full border border-primary/20 bg-card/60 hover:bg-card/90 transition-all duration-300 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:-translate-y-1"
      >
        {/* Top Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/30 group-hover:bg-primary transition-colors duration-500 shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />

        <div className="p-5 flex-grow flex flex-col">
          {/* Header row with date & language */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {relativeTime}
            </span>
            <div className="flex items-center gap-2">
              {note.isPublic && (
                <span className="flex items-center gap-1 rounded border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-green-500 uppercase tracking-wider shadow-sm" title="Public Note">
                  <Globe className="h-2.5 w-2.5" />
                  Public
                </span>
              )}
              {codeDetection.isCode && codeDetection.language !== 'unknown' && (
                <span className="flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase tracking-wider shadow-sm">
                  <FileCode2 className="h-2.5 w-2.5" />
                  {languageLabels[codeDetection.language]}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-sans font-semibold text-lg md:text-xl text-primary break-words whitespace-normal leading-tight mb-3 group-hover:drop-shadow-[0_0_5px_hsl(var(--primary)/0.5)] transition-all duration-300">
            {note.title}
          </h3>

          {/* Preview content (Code or Text) */}
          <div className="flex-grow">
            {codeDetection.isCode ? (
              <div className="max-h-48 overflow-hidden rounded-md relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-12 after:bg-gradient-to-t after:from-background after:to-transparent pointer-events-none shadow-inner border border-primary/10">
                <NoteCodeBlock content={note.content} language={codeDetection.language} className="!p-3 !m-0 text-[10px] md:text-[11px]" />
              </div>
            ) : (
              <p className="font-note text-muted-foreground text-sm line-clamp-6 leading-relaxed opacity-90">{note.content}</p>
            )}
          </div>
        </div>

        {/* Footer actions panel (fades in on hover) */}
        <div className="flex items-center justify-end gap-1 px-4 py-2 border-t border-primary/10 bg-primary/5 opacity-80 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" onClick={handleShareClick} aria-label="Share note">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" onClick={handleEditClick} aria-label="Edit note">
            <FilePenLine className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" onClick={handleCopyClick} aria-label="Copy note content">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={handleDeleteClick} aria-label="Delete note">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
