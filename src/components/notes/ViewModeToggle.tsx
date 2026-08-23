'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { BookText, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'markdown' | 'raw';

interface ViewModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

export const ViewModeToggle = memo(function ViewModeToggle({
  mode,
  onModeChange,
  className,
}: ViewModeToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-primary/20 bg-background/60 p-0.5 shadow-sm backdrop-blur-sm',
        className
      )}
      role="group"
      aria-label="Note view mode"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onModeChange('markdown')}
        aria-pressed={mode === 'markdown'}
        title="View with Markdown formatting"
        className={cn(
          'h-7 px-2.5 text-xs font-mono transition-all duration-200 gap-1.5 rounded-md',
          mode === 'markdown'
            ? 'bg-primary/20 text-primary font-semibold shadow-[0_0_12px_hsl(var(--primary)/0.3)] hover:bg-primary/25 hover:text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
        )}
      >
        <BookText className="h-3.5 w-3.5" />
        <span>Markdown</span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onModeChange('raw')}
        aria-pressed={mode === 'raw'}
        title="View as plain text without Markdown formatting"
        className={cn(
          'h-7 px-2.5 text-xs font-mono transition-all duration-200 gap-1.5 rounded-md',
          mode === 'raw'
            ? 'bg-primary/20 text-primary font-semibold shadow-[0_0_12px_hsl(var(--primary)/0.3)] hover:bg-primary/25 hover:text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
        )}
      >
        <FileText className="h-3.5 w-3.5" />
        <span>Plain Text</span>
      </Button>
    </div>
  );
});

