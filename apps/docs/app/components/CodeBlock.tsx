import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang = 'typescript' }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    codeToHtml(code.trim(), {
      lang,
      theme: 'github-dark',
    }).then(setHtml);
  }, [code, lang]);

  if (!html) {
    return (
      <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-zinc-300">{code.trim()}</code>
      </pre>
    );
  }

  return (
    <div
      className="[&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
