'use client';

import { useMemo, memo } from 'react';
import type { Note } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, FilePenLine, Trash2, Globe, Share2 } from 'lucide-react';
import { detectCodeBlock } from '@/lib/code-detect';
import dynamic from 'next/dynamic';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const NoteCodeBlock = dynamic(() => import('@/components/notes/NoteCodeBlock').then(mod => mod.NoteCodeBlock), { ssr: false });

interface NoteViewerProps {
  note: Note;
  onBack?: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export const NoteViewer = memo(function NoteViewer({ note, onBack, onEdit, onCopy, onDelete }: NoteViewerProps) {
  const createdAt = note.createdAt ? format(note.createdAt.toDate(), 'PPp') : 'Unknown';
  const updatedAt = note.updatedAt ? format(note.updatedAt.toDate(), 'PPp') : 'Unknown';
  const codeDetection = useMemo(() => detectCodeBlock(note.content), [note.content]);
  const { toast } = useToast();

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

  const togglePublic = async (checked: boolean) => {
    try {
      const { updateDoc, serverTimestamp } = await import('firebase/firestore');
      await updateDoc(doc(db, 'notes', note.id), { isPublic: checked, updatedAt: serverTimestamp() });
      if (checked) {
        toast({ title: 'Note is now public' });
      } else {
        toast({ title: 'Note is now private' });
      }
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: 'Failed to update visibility.' });
    }
  };

  return (
    <Card className="flex h-full flex-col border-primary/40 bg-card/80 shadow-[0_0_20px_hsl(var(--primary)/0.2)] backdrop-blur-sm">
      <CardHeader className="space-y-4 border-b border-border/70">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onBack}
                aria-label="Go back to notes list"
                className="mb-2 h-8 px-2 text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-sans font-bold text-2xl text-primary break-words [overflow-wrap:anywhere]">{note.title}</CardTitle>
              {note.isPublic && (
                <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-500 shadow-sm uppercase tracking-wider mt-1" title="Public Note">
                  <Globe className="h-3 w-3" />
                  Public
                </span>
              )}
            </div>
            <CardDescription className="text-xs leading-relaxed">
              <span className="block">Created: {createdAt}</span>
              <span className="block">Updated: {updatedAt}</span>
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <div className="flex items-center gap-2 sm:mr-2 sm:border-r border-primary/20 sm:pr-4">
              <Label htmlFor="public-toggle" className="text-xs text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground transition-colors">
                Public Share
              </Label>
              <Switch
                id="public-toggle"
                checked={!!note.isPublic}
                onCheckedChange={togglePublic}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            <div className="flex items-center gap-1 rounded-md border border-primary/30 bg-background/40 p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={handleShareClick} aria-label="Share note" title="Share note">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={onEdit} aria-label="Edit note" title="Edit note">
              <FilePenLine className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={onCopy} aria-label="Copy note content" title="Copy note content">
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive/80 hover:text-destructive"
              onClick={onDelete}
              aria-label="Delete note"
              title="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-5">
        {codeDetection.isCode ? (
          <NoteCodeBlock content={note.content} language={codeDetection.language} />
        ) : (
          <pre className="whitespace-pre-wrap break-words font-note text-sm leading-7 text-foreground">
            {note.content}
          </pre>
        )}
      </CardContent>
    </Card>
  );
});
