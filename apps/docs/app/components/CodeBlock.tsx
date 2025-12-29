'use client';

import { use, useEffect, useState, type ReactNode } from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { clsx } from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]): string {
  return clsx(inputs);
}

// Language aliases
const LANG_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
};

const SUPPORTED_LANGS = ['typescript', 'tsx', 'javascript', 'jsx', 'bash', 'json', 'text'];

// Global cache for highlighted HTML - persists across navigations
const htmlCache = new Map<string, string>();

// Promise cache for async operations
const promiseCache = new Map<string, Promise<any>>();

function cachePromise<T>(key: string, create: () => Promise<T>): Promise<T> {
  const cached = promiseCache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = create();
  promiseCache.set(key, promise);
  return promise;
}

async function getHighlighter() {
  return cachePromise('shiki-highlighter', async () => {
    const { createHighlighter } = await import(/* @vite-ignore */ 'shiki');
    const engine = await import(/* @vite-ignore */ 'shiki/engine/javascript').then(
      (res) => res.createJavaScriptRegexEngine()
    );

    return createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'tsx', 'javascript', 'jsx', 'bash', 'json', 'text'],
      engine,
    });
  });
}

function highlightToHtml(code: string, lang: string): Promise<string> {
  const resolvedLang = LANG_ALIASES[lang] ?? lang;
  const finalLang = SUPPORTED_LANGS.includes(resolvedLang) ? resolvedLang : 'text';
  const cacheKey = `${finalLang}:${code}`;

  const cached = htmlCache.get(cacheKey);
  if (cached) return Promise.resolve(cached);

  return cachePromise(cacheKey, async () => {
    const highlighter = await getHighlighter();
    const html = highlighter.codeToHtml(code, {
      lang: finalLang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    });

    htmlCache.set(cacheKey, html);
    return html;
  });
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate plain code HTML with same structure as shiki output
function getPlainCodeHtml(code: string): string {
  return `<pre class="shiki" style="background-color:var(--shiki-dark-bg);color:var(--shiki-dark)"><code>${code
    .split('\n')
    .map((line) => `<span class="line"><span>${escapeHtml(line) || ' '}</span></span>`)
    .join('\n')}</code></pre>`;
}

interface CodeBlockContentProps {
  code: string;
  lang: string;
}

function CodeBlockContent({ code, lang }: CodeBlockContentProps) {
  // Use React's use() hook to suspend until highlighting is done
  const html = use(highlightToHtml(code, lang));
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

interface CodeBlockWrapperProps {
  code: string;
  title?: string;
  children: ReactNode;
}

function CodeBlockWrapper({ code, title, children }: CodeBlockWrapperProps) {
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
        role="region"
        tabIndex={0}
        className={cn(
          'text-[0.8125rem] py-3.5 overflow-auto max-h-[600px]',
          'fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring',
          '[&_pre]:min-w-full [&_pre]:w-max [&_code]:flex [&_code]:flex-col [&_.line]:px-4',
          !title && 'pr-8'
        )}
      >
        {children}
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

export function CodeBlock({ code, lang = 'text', title }: CodeBlockProps) {
  // Check if we have cached HTML - if so, use it for the fallback too
  const resolvedLang = LANG_ALIASES[lang] ?? lang;
  const finalLang = SUPPORTED_LANGS.includes(resolvedLang) ? resolvedLang : 'text';
  const cacheKey = `${finalLang}:${code}`;
  const cachedHtml = htmlCache.get(cacheKey);

  const fallbackHtml = cachedHtml ?? getPlainCodeHtml(code);

  return (
    <CodeBlockWrapper code={code} title={title}>
      <ClientOnly
        fallback={<div dangerouslySetInnerHTML={{ __html: fallbackHtml }} />}
      >
        <CodeBlockContent code={code} lang={lang} />
      </ClientOnly>
    </CodeBlockWrapper>
  );
}
