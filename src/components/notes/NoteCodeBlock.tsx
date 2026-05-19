'use client';

import { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-cpp';
import type { DetectedLanguage } from '@/lib/code-detect';
import { cn } from '@/lib/utils';

interface NoteCodeBlockProps {
  content: string;
  language: DetectedLanguage;
  className?: string;
}

const resolveLanguage = (language: DetectedLanguage) => (language === 'unknown' ? 'clike' : language);

export function NoteCodeBlock({ content, language, className }: NoteCodeBlockProps) {
  const prismLanguage = resolveLanguage(language);
  const highlighted = useMemo(() => {
    const grammar = Prism.languages[prismLanguage] ?? Prism.languages.clike;
    return Prism.highlight(content, grammar, prismLanguage);
  }, [content, prismLanguage]);

  return (
    <pre className={cn('note-code-block', className)}>
      <code className={`language-${prismLanguage}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}
