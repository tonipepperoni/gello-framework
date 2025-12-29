'use client';

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
}

export function CodeBlock({ code, lang = 'typescript', title }: CodeBlockProps) {
  return (
    <DynamicCodeBlock
      lang={lang}
      code={code.trim()}
      options={{
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
      }}
    />
  );
}
