'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from 'next-themes';

interface SettingsDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ children, open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme-select" className="text-right">
              Theme
            </Label>
            <div className="col-span-3">
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyberpunk">Cyberpunk (Default)</SelectItem>
                  <SelectItem value="legacy">Legacy Theme</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
