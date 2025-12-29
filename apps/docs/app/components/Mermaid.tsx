'use client';

import { use, useId, useState, useEffect } from 'react';
import { ClientOnly } from '@tanstack/react-router';

// Promise cache for mermaid module
const moduleCache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, create: () => Promise<T>): Promise<T> {
  const cached = moduleCache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = create();
  moduleCache.set(key, promise);
  return promise;
}

// SVG render cache
const svgCache = new Map<string, string>();

interface MermaidContentProps {
  chart: string;
}

function MermaidContent({ chart }: MermaidContentProps) {
  const id = useId();
  const [svg, setSvg] = useState<string>(() => svgCache.get(chart) ?? '');

  // Dynamically import mermaid only on client
  // @vite-ignore prevents bundling in SSR
  const { default: mermaid } = use(
    cachePromise('mermaid', () => import(/* @vite-ignore */ 'mermaid'))
  );

  useEffect(() => {
    // Initialize mermaid with theme
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
    });

    // If we have cached SVG, use it
    if (svgCache.has(chart)) {
      setSvg(svgCache.get(chart)!);
      return;
    }

    // Render the chart
    const render = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-${id.replace(/:/g, '-')}`,
          chart
        );
        svgCache.set(chart, renderedSvg);
        setSvg(renderedSvg);
      } catch (error) {
        console.error('Mermaid render error:', error);
      }
    };

    render();
  }, [chart, id, mermaid]);

  if (!svg) {
    return (
      <div className="flex items-center justify-center p-8 bg-fd-card rounded-lg border border-fd-border">
        <div className="animate-pulse text-fd-muted-foreground">
          Loading diagram...
        </div>
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram overflow-x-auto p-4 bg-fd-card rounded-lg border border-fd-border [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  return (
    <ClientOnly
      fallback={
        <div className="flex items-center justify-center p-8 bg-fd-card rounded-lg border border-fd-border">
          <div className="text-fd-muted-foreground">Loading diagram...</div>
        </div>
      }
    >
      <MermaidContent chart={chart} />
    </ClientOnly>
  );
}
