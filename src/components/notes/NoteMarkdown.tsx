'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { NoteCodeBlock } from '@/components/notes/NoteCodeBlock';
import { normalizeLanguage } from '@/lib/code-detect';
import { cn } from '@/lib/utils';

interface NoteMarkdownProps {
  content: string;
  className?: string;
}

export const NoteMarkdown = memo(function NoteMarkdown({ content, className }: NoteMarkdownProps) {
  return (
    <div className={cn('note-markdown-renderer font-note text-foreground/90 leading-relaxed break-words', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Strip wrapping <pre> so NoteCodeBlock handles its own container
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const rawContent = String(children).replace(/\n$/, '');
            const hasMultipleLines = rawContent.includes('\n');

            // If it has no language class and no line breaks, render as inline code
            if (!match && !hasMultipleLines) {
              return (
                <code
                  className="rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[0.875em] text-primary shadow-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const detectedLang = normalizeLanguage(match ? match[1] : undefined);

            return (
              <NoteCodeBlock
                content={rawContent}
                language={detectedLang}
                showCopyButton={true}
                showLanguageHeader={true}
              />
            );
          },
          h1({ children }) {
            return (
              <h1 className="mt-6 mb-3 text-2xl sm:text-3xl font-bold font-headline text-primary border-b border-primary/20 pb-2 drop-shadow-[0_0_10px_hsl(var(--primary)/0.25)]">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="mt-5 mb-2.5 text-xl sm:text-2xl font-semibold font-headline text-primary/95 border-b border-primary/10 pb-1.5">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="mt-4 mb-2 text-lg sm:text-xl font-medium font-headline text-primary/90">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="mt-3 mb-1.5 text-base sm:text-lg font-medium font-headline text-foreground">
                {children}
              </h4>
            );
          },
          p({ children }) {
            return <p className="my-2.5 leading-7 text-foreground/90">{children}</p>;
          },
          ul({ children }) {
            return <ul className="my-2.5 ml-6 list-disc space-y-1.5 text-foreground/90">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-2.5 ml-6 list-decimal space-y-1.5 text-foreground/90">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 border-l-4 border-accent bg-accent/5 px-4 py-2.5 rounded-r-lg italic text-muted-foreground shadow-sm">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 w-full overflow-x-auto rounded-lg border border-primary/20 bg-card/40 shadow-inner">
                <table className="w-full text-left text-sm font-note border-collapse">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="border-b border-primary/20 bg-primary/10 text-primary font-bold">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-primary/10">{children}</tbody>;
          },
          th({ children }) {
            return <th className="p-3 font-semibold uppercase tracking-wider text-xs">{children}</th>;
          },
          td({ children }) {
            return <td className="p-3 text-foreground/90">{children}</td>;
          },
          tr({ children }) {
            return <tr className="hover:bg-primary/5 transition-colors">{children}</tr>;
          },
          a({ href, children }) {
            const isUnsafe = href && /^(?:javascript|vbscript|data):/i.test(href.trim());
            const safeHref = isUnsafe ? '#' : href;
            return (
              <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary hover:text-accent transition-colors font-medium"
              >
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="my-6 border-t border-primary/20" />;
          },
          input({ type, checked, ...props }) {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 h-3.5 w-3.5 rounded border-primary/40 text-primary accent-primary cursor-default inline-block align-middle"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
