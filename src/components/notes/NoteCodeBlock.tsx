'use client';

import { useEffect, useMemo, useState } from 'react';
import Prism from 'prismjs';
import type { DetectedLanguage } from '@/lib/code-detect';
import { cn } from '@/lib/utils';

interface NoteCodeBlockProps {
  content: string;
  language: DetectedLanguage;
  className?: string;
}

const resolveLanguage = (language: DetectedLanguage) => (language === 'unknown' ? 'clike' : language);

let prismReadyPromise: Promise<void> | null = null;

const loadPrismLanguages = () => {
  if (!prismReadyPromise) {
    prismReadyPromise = (async () => {
      await import('prismjs/components/prism-clike');
      await import('prismjs/components/prism-javascript');
      await import('prismjs/components/prism-python');
      await import('prismjs/components/prism-cpp');
    })();
  }

  return prismReadyPromise;
};

export function NoteCodeBlock({ content, language, className }: NoteCodeBlockProps) {
  const prismLanguage = resolveLanguage(language);
  const [isReady, setIsReady] = useState(() => Boolean(Prism.languages?.clike));

  useEffect(() => {
    let isActive = true;

    loadPrismLanguages()
      .then(() => {
        if (isActive) {
          setIsReady(true);
        }
      })
      .catch(() => {
        if (isActive) {
          setIsReady(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const highlighted = useMemo(() => {
    if (!isReady) {
      return null;
    }

    const grammar = Prism.languages?.[prismLanguage] ?? Prism.languages?.clike;
    if (!grammar) {
      return null;
    }

    return Prism.highlight(content, grammar, prismLanguage);
  }, [content, prismLanguage, isReady]);

  return (
    <pre className={cn('note-code-block', className)}>
      {highlighted ? (
        <code className={`language-${prismLanguage}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
      ) : (
        <code className={`language-${prismLanguage}`}>{content}</code>
      )}
    </pre>
  );
}
