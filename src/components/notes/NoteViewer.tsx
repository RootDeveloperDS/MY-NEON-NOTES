'use client';

import type { Note } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, FilePenLine, Trash2 } from 'lucide-react';

interface NoteViewerProps {
  note: Note;
  onBack?: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export function NoteViewer({ note, onBack, onEdit, onCopy, onDelete }: NoteViewerProps) {
  const createdAt = note.createdAt ? format(note.createdAt.toDate(), 'PPp') : 'Unknown';
  const updatedAt = note.updatedAt ? format(note.updatedAt.toDate(), 'PPp') : 'Unknown';

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
                className="mb-2 h-8 px-2 text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            )}
            <CardTitle className="font-note text-2xl text-primary break-all">{note.title}</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              <span className="block">Created: {createdAt}</span>
              <span className="block">Updated: {updatedAt}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-primary/30 bg-background/40 p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={onEdit} aria-label="Edit note">
              <FilePenLine className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={onCopy} aria-label="Copy note content">
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive/80 hover:text-destructive"
              onClick={onDelete}
              aria-label="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-5">
        <pre className="whitespace-pre-wrap break-words font-note text-sm leading-7 text-foreground">
          {note.content}
        </pre>
      </CardContent>
    </Card>
  );
}
