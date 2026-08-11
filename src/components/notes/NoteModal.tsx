'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Note } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { trackEvent } from '@/lib/analytics';

const noteFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long (max 100 characters)'),
  content: z.string().min(1, 'Content is required').max(100000, 'Content is too long (max 100,000 characters)'),
  isPublic: z.boolean().default(false),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  isFirstNote?: boolean;
}



export function NoteModal({ isOpen, onClose, note, isFirstNote }: NoteModalProps) {
  const { toast } = useToast();
  const { activeUid, user } = useAuth();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: '',
      content: '',
      isPublic: false,
    },
  });

  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
        isPublic: note.isPublic ?? false,
      });
    } else {
      form.reset({
        title: '',
        content: '',
        isPublic: false,
      });
    }
  }, [note, form, isOpen]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: NoteFormValues) => {
    if (!activeUid) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to save notes.',
      });
      return;
    }

    try {
      if (note) {
        // Update existing note, ensuring userId is preserved
        const noteRef = doc(db, 'notes', note.id);
        await setDoc(noteRef, { 
          ...data, 
          userId: note.userId, // Preserve original userId
          updatedAt: serverTimestamp() 
        }, { merge: true });
        toast({ title: 'Note Updated', description: 'Your note has been successfully updated.' });
        trackEvent('Update Note', `Updated note titled: "${data.title}"`, user?.displayName || 'Anonymous', user?.email || null);
      } else {
        // Create new note with the current user's ID
        await addDoc(collection(db, 'notes'), { 
          ...data, 
          userId: activeUid, // Explicitly add activeUid as userId
          createdAt: serverTimestamp(), 
          updatedAt: serverTimestamp() 
        });
        toast({ title: 'Note Created', description: 'Your new note has been saved.' });
        const userDisplay = user?.displayName || 'Anonymous';
        const userEmail = user?.email || null;
        if (isFirstNote) {
          trackEvent('First Note Created', 'User created their very first note', userDisplay, userEmail);
        } else {
          trackEvent('Create Note', `Created note titled: "${data.title}"`, userDisplay, userEmail);
        }
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please check console for details.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] border-accent/50 shadow-[0_0_20px_hsl(var(--accent)/0.4)] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-sans font-bold text-accent text-2xl">{note ? 'Edit Note' : 'Create Note'}</DialogTitle>
          <DialogDescription>{note ? 'Modify your note details below.' : 'Fill out the details for your new note.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 max-h-[calc(90vh-180px)]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter note title..." {...field} className="font-note" autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3 flex-grow">
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your note here... (Code will be highlighted on the dashboard)" className="min-h-[250px] font-note resize-none flex-grow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-accent/20 bg-accent/5 p-4 shadow-sm">
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-medium cursor-pointer">Make Publicly Shareable</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Anyone with the link can view this note (read-only).
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-accent"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex-shrink-0 pt-4 border-t border-accent/10">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !activeUid} aria-busy={isSubmitting} className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Note'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
