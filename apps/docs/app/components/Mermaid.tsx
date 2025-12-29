'use client';

import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  className?: string;
}

// Cache for rendered diagrams
const cache = new Map<string, string>();

export function Mermaid({ chart, className }: MermaidProps) {
  const id = useId().replace(/:/g, '-');
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mermaid with theme settings
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const render = async () => {
      const cacheKey = chart;

      // Check cache first
      if (cache.has(cacheKey)) {
        setSvg(cache.get(cacheKey)!);
        return;
      }

      try {
        const { svg: renderedSvg } = await mermaid.render(`mermaid-${id}`, chart);
        cache.set(cacheKey, renderedSvg);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        console.error('Mermaid render error:', err);
      }
    };

    render();
  }, [chart, id]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm">Failed to render diagram: {error}</p>
        <pre className="mt-2 text-xs overflow-auto">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
    );
  }

  return (
    <div
      className={`my-6 flex justify-center overflow-x-auto ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
