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

const ensurePrismGlobal = () => {
  if (typeof globalThis !== 'undefined') {
    (globalThis as typeof globalThis & { Prism?: typeof Prism }).Prism = Prism;
  }
};

const loadPrismLanguages = () => {
  if (!prismReadyPromise) {
    prismReadyPromise = (async () => {
      ensurePrismGlobal();
      // Sequential imports are required because Prism languages have strict inter-dependencies
      // (e.g. javascript depends on clike, cpp depends on c)
      await import('prismjs/components/prism-markup');
      await import('prismjs/components/prism-markup-templating');
      await import('prismjs/components/prism-clike');
      await import('prismjs/components/prism-javascript');
      await import('prismjs/components/prism-typescript');
      await import('prismjs/components/prism-python');
      await import('prismjs/components/prism-c');
      await import('prismjs/components/prism-cpp');
      await import('prismjs/components/prism-java');
      await import('prismjs/components/prism-csharp');
      await import('prismjs/components/prism-go');
      await import('prismjs/components/prism-rust');
      await import('prismjs/components/prism-php');
      await import('prismjs/components/prism-ruby');
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
        if (!isActive) return;
        setIsReady(Boolean(Prism.languages?.clike));
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
