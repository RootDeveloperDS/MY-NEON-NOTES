'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Prism from 'prismjs';
import { type DetectedLanguage, LANGUAGE_DISPLAY_NAMES } from '@/lib/code-detect';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Copy, FileCode2 } from 'lucide-react';

interface NoteCodeBlockProps {
  content: string;
  language: DetectedLanguage;
  className?: string;
  showCopyButton?: boolean;
  showLanguageHeader?: boolean;
}

const resolveLanguage = (language: DetectedLanguage) => (language === 'unknown' || !language ? 'clike' : language);

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
      try {
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
        await import('prismjs/components/prism-bash');
        await import('prismjs/components/prism-json');
        await import('prismjs/components/prism-sql');
        await import('prismjs/components/prism-css');
        await import('prismjs/components/prism-yaml');
        await import('prismjs/components/prism-markdown');
      } catch (err) {
        console.warn('Could not load some Prism syntax modules:', err);
      }
    })();
  }

  return prismReadyPromise;
};

export function NoteCodeBlock({
  content,
  language,
  className,
  showCopyButton = true,
  showLanguageHeader = true,
}: NoteCodeBlockProps) {
  const prismLanguage = resolveLanguage(language);
  const [isReady, setIsReady] = useState(() => Boolean(Prism.languages?.clike));
  const [isCopied, setIsCopied] = useState(false);

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

    try {
      return Prism.highlight(content, grammar, prismLanguage);
    } catch {
      return null;
    }
  }, [content, prismLanguage, isReady]);

  const handleCopyCode = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code snippet:', err);
      }
    },
    [content]
  );

  const displayLangName =
    language && language !== 'unknown'
      ? LANGUAGE_DISPLAY_NAMES[language] || language.toUpperCase()
      : 'Code';

  return (
    <div
      className={cn(
        'group relative my-3 overflow-hidden rounded-xl border border-primary/25 bg-card/60 shadow-[0_0_25px_hsl(var(--primary)/0.08)] transition-all duration-200 hover:border-primary/45',
        className
      )}
    >
      {(showLanguageHeader || showCopyButton) && (
        <div className="flex items-center justify-between border-b border-primary/15 bg-primary/5 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm select-none">
          <div className="flex items-center gap-1.5">
            <FileCode2 className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-primary/80">
              {displayLangName}
            </span>
          </div>

          {showCopyButton && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              aria-label="Copy code snippet"
              title="Copy code snippet"
              className="h-7 px-2 text-[11px] font-mono text-muted-foreground hover:bg-primary/15 hover:text-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary"
            >
              {isCopied ? (
                <>
                  <Check className="mr-1 h-3.5 w-3.5 text-green-400" />
                  <span className="text-green-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          )}
        </div>
      )}

      <pre className="note-code-block !m-0 !rounded-none !border-none !bg-transparent !p-4 !shadow-none">
        {highlighted ? (
          <code
            className={`language-${prismLanguage}`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        ) : (
          <code className={`language-${prismLanguage}`}>{content}</code>
        )}
      </pre>
    </div>
  );
}
