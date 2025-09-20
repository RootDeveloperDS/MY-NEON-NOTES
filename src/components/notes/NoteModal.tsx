'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Note } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const noteFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

export function NoteModal({ isOpen, onClose, note }: NoteModalProps) {
  const { toast } = useToast();
  const { activeUid } = useAuth();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
      });
    } else {
      form.reset({
        title: '',
        content: '',
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
      } else {
        // Create new note with the current user's ID
        await addDoc(collection(db, 'notes'), { 
          ...data, 
          userId: activeUid, // Explicitly add activeUid as userId
          createdAt: serverTimestamp(), 
          updatedAt: serverTimestamp() 
        });
        toast({ title: 'Note Created', description: 'Your new note has been saved.' });
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
      <DialogContent className="sm:max-w-[600px] border-accent/50 shadow-[0_0_20px_hsl(var(--accent)/0.4)]">
        <DialogHeader>
          <DialogTitle className="font-headline text-accent text-2xl">{note ? 'Edit Note' : 'Create Note'}</DialogTitle>
          <DialogDescription>{note ? 'Modify your note details below.' : 'Fill out the details for your new note.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter note title..." {...field} className="font-note" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type your note here..." className="min-h-[200px] font-note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !activeUid} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isSubmitting ? 'Saving...' : 'Save Note'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
