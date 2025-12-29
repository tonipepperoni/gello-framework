'use client';

import { use, useRef, useState, type ReactNode } from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { clsx } from 'clsx';

// Simple cn utility
function cn(...inputs: (string | undefined | null | false)[]): string {
  return clsx(inputs);
}

// Promise cache for highlighter
const highlighterCache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, create: () => Promise<T>): Promise<T> {
  const cached = highlighterCache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = create();
  highlighterCache.set(key, promise);
  return promise;
}

// Supported languages for our docs
const SUPPORTED_LANGS = ['typescript', 'tsx', 'javascript', 'jsx', 'bash', 'json', 'text', 'sh', 'shell'] as const;
type SupportedLang = typeof SUPPORTED_LANGS[number];

// Language aliases
const LANG_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
};

async function getHighlighter() {
  const { createHighlighter } = await import(/* @vite-ignore */ 'shiki');
  const engine = await import(/* @vite-ignore */ 'shiki/engine/javascript').then(
    (res) => res.createJavaScriptRegexEngine()
  );

  return createHighlighter({
    themes: ['github-dark', 'github-light'],
    langs: ['typescript', 'tsx', 'javascript', 'jsx', 'bash', 'json', 'text'],
    engine,
  });
}

// Highlight cache
const highlightCache = new Map<string, Promise<ReactNode>>();

async function highlightCode(code: string, lang: string): Promise<ReactNode> {
  const cacheKey = `${lang}:${code}`;
  const cached = highlightCache.get(cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    const highlighter = await cachePromise('shiki', getHighlighter);
    const resolvedLang = LANG_ALIASES[lang] ?? lang;
    const finalLang = SUPPORTED_LANGS.includes(resolvedLang as SupportedLang) ? resolvedLang : 'text';

    const hast = (highlighter as any).codeToHast(code, {
      lang: finalLang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    });

    return toJsxRuntime(hast, {
      jsx,
      jsxs,
      development: false,
      Fragment,
    });
  })();

  highlightCache.set(cacheKey, promise);
  return promise;
}

// Copy button component
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-1.5',
        'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
        'transition-colors'
      )}
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// Pre component matching fumadocs
function Pre({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre {...props} className={cn('min-w-full w-max *:flex *:flex-col', className)}>
      {children}
    </pre>
  );
}

interface CodeBlockContentProps {
  code: string;
  lang?: string;
  title?: string;
}

function CodeBlockContent({ code, lang = 'text', title }: CodeBlockContentProps) {
  const highlighted = use(highlightCode(code, lang));
  const areaRef = useRef<HTMLDivElement>(null);

  return (
    <figure
      dir="ltr"
      tabIndex={-1}
      className={cn(
        'my-4 bg-fd-card rounded-xl',
        'shiki relative border shadow-sm not-prose overflow-hidden text-sm'
      )}
    >
      {title ? (
        <div className="flex text-fd-muted-foreground items-center gap-2 h-9.5 border-b px-4">
          <figcaption className="flex-1 truncate">{title}</figcaption>
          <div className="-me-2">
            <CopyButton code={code} />
          </div>
        </div>
      ) : (
        <div className="absolute top-3 right-2 z-[2] backdrop-blur-lg rounded-lg text-fd-muted-foreground">
          <CopyButton code={code} />
        </div>
      )}
      <div
        ref={areaRef}
        role="region"
        tabIndex={0}
        className={cn(
          'text-[0.8125rem] py-3.5 overflow-auto max-h-[600px]',
          'fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring',
          !title && 'pr-8'
        )}
      >
        {highlighted}
      </div>
    </figure>
  );
}

function CodeBlockFallback({ code, title }: { code: string; title?: string }) {
  return (
    <figure
      dir="ltr"
      tabIndex={-1}
      className={cn(
        'my-4 bg-fd-card rounded-xl',
        'relative border shadow-sm not-prose overflow-hidden text-sm'
      )}
    >
      {title && (
        <div className="flex text-fd-muted-foreground items-center gap-2 h-9.5 border-b px-4">
          <figcaption className="flex-1 truncate">{title}</figcaption>
        </div>
      )}
      <div className="text-[0.8125rem] py-3.5 px-4 overflow-auto max-h-[600px]">
        <pre className="min-w-full w-max">
          <code className="text-fd-foreground">{code}</code>
        </pre>
      </div>
    </figure>
  );
}

export interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
  children?: ReactNode;
}

export function CodeBlock({ code, lang, title }: CodeBlockProps) {
  return (
    <ClientOnly fallback={<CodeBlockFallback code={code} title={title} />}>
      <CodeBlockContent code={code} lang={lang} title={title} />
    </ClientOnly>
  );
}
