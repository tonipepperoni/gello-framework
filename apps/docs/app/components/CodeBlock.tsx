'use client';

import { use, type ReactNode } from 'react';
import { ClientOnly } from '@tanstack/react-router';

// Cache for the highlighter
const highlighterCache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, create: () => Promise<T>): Promise<T> {
  const cached = highlighterCache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = create();
  highlighterCache.set(key, promise);
  return promise;
}

// Only import the languages we actually use
async function createLightweightHighlighter() {
  const { createHighlighter } = await import(/* @vite-ignore */ 'shiki');
  return createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript', 'javascript', 'bash', 'json', 'tsx', 'text'],
  });
}

interface CodeBlockContentProps {
  code: string;
  lang?: string;
}

function CodeBlockContent({ code, lang = 'text' }: CodeBlockContentProps) {
  const highlighter = use(
    cachePromise('shiki-highlighter', createLightweightHighlighter)
  );

  // Map common language aliases
  const langMap: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    sh: 'bash',
    shell: 'bash',
  };
  const resolvedLang = langMap[lang] ?? lang;

  // Check if language is supported, fallback to text
  const supportedLangs = ['typescript', 'javascript', 'bash', 'json', 'tsx', 'text'];
  const finalLang = supportedLangs.includes(resolvedLang) ? resolvedLang : 'text';

  const html = highlighter.codeToHtml(code, {
    lang: finalLang,
    theme: 'github-dark',
  });

  return (
    <div
      className="code-block overflow-x-auto rounded-lg text-sm [&_pre]:p-4 [&_pre]:m-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function CodeBlockFallback({ code }: { code: string }) {
  return (
    <div className="code-block overflow-x-auto rounded-lg bg-[#24292e] text-sm">
      <pre className="p-4 m-0">
        <code className="text-gray-300">{code}</code>
      </pre>
    </div>
  );
}

export interface CodeBlockProps {
  code: string;
  lang?: string;
  children?: ReactNode;
}

export function CodeBlock({ code, lang }: CodeBlockProps) {
  return (
    <ClientOnly fallback={<CodeBlockFallback code={code} />}>
      <CodeBlockContent code={code} lang={lang} />
    </ClientOnly>
  );
}
