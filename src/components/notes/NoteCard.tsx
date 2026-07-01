'use client';

import { useState } from 'react';
import type { Note } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePenLine, Trash2, Copy, FileCode2 } from 'lucide-react';
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
  
  const codeDetection = detectCodeBlock(note.content);
  
  const languageLabels: Record<string, string> = {
    javascript: 'JavaScript',
    python: 'Python',
    cpp: 'C++',
    java: 'Java',
    unknown: '',
  };

  const relativeTime = note.updatedAt ? formatDistanceToNow(note.updatedAt.toDate(), { addSuffix: true }) : 'just now';

  return (
    <>
      <Card
        onClick={onView}
        className="flex flex-col h-full border-primary/20 bg-card/80 transition-all duration-300 ease-in-out hover:border-primary/60 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.5)] cursor-pointer"
      >
        <CardHeader className="p-6 pb-4">
        <div className="flex flex-wrap justify-between items-start gap-2">
          {/* Title + Description */}
          <div className="flex-1 min-w-[0]">
            <CardTitle className="font-note text-xl text-primary truncate">{note.title}</CardTitle>
            <CardDescription className="opacity-70">{relativeTime}</CardDescription>
          </div>
          {/* Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {codeDetection.isCode && codeDetection.language !== 'unknown' && (
              <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary shadow-[0_0_8px_hsl(var(--primary)/0.2)] mr-2">
                <FileCode2 className="h-3 w-3" />
                {languageLabels[codeDetection.language]}
              </span>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditClick} aria-label="Edit note">
              <FilePenLine className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyClick} aria-label="Copy note content">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={handleDeleteClick} aria-label="Delete note">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 pt-0">
          {codeDetection.isCode ? (
            <div className="max-h-32 overflow-hidden rounded-md relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:bg-gradient-to-t after:from-background after:to-transparent">
              <NoteCodeBlock content={note.content} language={codeDetection.language} className="!p-3 !m-0 text-[11px]" />
            </div>
          ) : (
            <p className="font-note text-muted-foreground line-clamp-4">{note.content}</p>
          )}
        </CardContent>
        <CardFooter className="px-6 pb-4 pt-0">
          {/* Future tags can go here */}
        </CardFooter>
      </Card>

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
