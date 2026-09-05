'use client';

import { useMemo, useState, useEffect, memo } from 'react';
import type { Note } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, FilePenLine, Trash2, Globe, Share2, Check, FileCode2, BookText } from 'lucide-react';
import { detectContentType, LANGUAGE_DISPLAY_NAMES } from '@/lib/code-detect';
import { ViewModeToggle, type ViewMode } from '@/components/notes/ViewModeToggle';
import dynamic from 'next/dynamic';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

const NoteCodeBlock = dynamic(() => import('@/components/notes/NoteCodeBlock').then(mod => mod.NoteCodeBlock), { ssr: false });
const NoteMarkdown = dynamic(() => import('@/components/notes/NoteMarkdown').then(mod => mod.NoteMarkdown), { ssr: false });

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
  const contentDetection = useMemo(() => detectContentType(note.content), [note.content]);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    contentDetection.isMarkdown || contentDetection.isCode ? 'markdown' : 'raw'
  );
  const { toast } = useToast();
  const { activeUid } = useAuth();
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Sync view mode when switching to a different note
  useEffect(() => {
    setViewMode(contentDetection.isMarkdown || contentDetection.isCode ? 'markdown' : 'raw');
  }, [note.id, contentDetection.isMarkdown, contentDetection.isCode]);

  const handleShareClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (note.userId !== activeUid && !note.isPublic) {
      toast({
        variant: 'destructive',
        title: 'Authorization Error',
        description: 'You are not authorized to share this note.',
      });
      return;
    }
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
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Share Error',
        description: 'Failed to make the note public.',
      });
    }
  };

  const togglePublic = async (checked: boolean) => {
    if (note.userId !== activeUid) {
      toast({
        variant: 'destructive',
        title: 'Authorization Error',
        description: 'You are not authorized to change the visibility of this note.',
      });
      return;
    }
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
              {contentDetection.isMarkdown && (
                <span className="flex items-center gap-1 rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider mt-1 shadow-sm">
                  <BookText className="h-3 w-3" />
                  Markdown
                </span>
              )}
              {contentDetection.isCode && contentDetection.language !== 'unknown' && (
                <span className="flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider mt-1 shadow-sm">
                  <FileCode2 className="h-3 w-3" />
                  {LANGUAGE_DISPLAY_NAMES[contentDetection.language]}
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
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={handleShareClick} aria-label={isShared ? "Link copied" : "Share note"} title={isShared ? "Link copied" : "Share note"}>
                {isShared ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={onEdit} aria-label="Edit note" title="Edit note">
                <FilePenLine className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => { onCopy(); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} aria-label={isCopied ? "Note copied" : "Copy note content"} title={isCopied ? "Note copied" : "Copy note content"}>
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
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

        {/* View Mode Toggle Toolbar */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-muted-foreground font-mono">
            {viewMode === 'markdown' ? 'Markdown Formatted View' : 'Plain Text / Raw Source'}
          </div>
          <ViewModeToggle mode={viewMode} onModeChange={setViewMode} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-5">
        {viewMode === 'raw' ? (
          <pre className="whitespace-pre-wrap break-words font-note text-sm leading-7 text-foreground/90 bg-card/40 p-5 rounded-xl border border-primary/15 shadow-inner select-text">
            {note.content}
          </pre>
        ) : contentDetection.isCode ? (
          <NoteCodeBlock content={note.content} language={contentDetection.language} />
        ) : (
          <NoteMarkdown content={note.content} />
        )}
      </CardContent>
    </Card>
  );
});
