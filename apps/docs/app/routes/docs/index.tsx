import { createFileRoute } from '@tanstack/react-router';
import { DocsContent, type TOCItem } from '../../components';
import { getPageNavigation } from '../../lib/source';
import { useMDXComponents } from '../../lib/mdx-components';
import { MDXProvider } from '@mdx-js/react';

// Import MDX using glob to get the index file
const mdxModules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter?: { title?: string; description?: string };
}>('/content/docs/index.mdx', { eager: true });

const indexModule = Object.values(mdxModules)[0];
const IndexContent = indexModule?.default;
const frontmatter = indexModule?.frontmatter;

export const Route = createFileRoute('/docs/')({
  component: DocsIntroduction,
});

const toc: TOCItem[] = [
  { title: 'Architecture Overview', url: '#architecture-overview', depth: 2 },
  { title: 'Core Philosophy', url: '#core-philosophy', depth: 2 },
  { title: 'Quick Example', url: '#quick-example', depth: 2 },
  { title: 'What This Gives You', url: '#what-this-gives-you', depth: 2 },
  { title: 'Quick Start', url: '#quick-start', depth: 2 },
  { title: 'Packages', url: '#packages', depth: 2 },
  { title: 'Requirements', url: '#requirements', depth: 2 },
];

function DocsIntroduction() {
  const footer = getPageNavigation('/docs');
  const components = useMDXComponents({});
  const title = frontmatter?.title || 'Introduction';
  const description =
    frontmatter?.description || 'Gello — A TypeScript backend framework built on Effect';

  if (!IndexContent) {
    return <div>Loading...</div>;
  }

  return (
    <DocsContent title={title} description={description} toc={toc} footer={footer}>
      <MDXProvider components={components}>
        <IndexContent />
      </MDXProvider>
    </DocsContent>
  );
}
