import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsContent, type TOCItem } from '../../components';
import { getPageNavigation, getPageTitle } from '../../lib/source';
import { useMDXComponents } from '../../lib/mdx-components';
import { MDXProvider } from '@mdx-js/react';
import { useMemo } from 'react';

// Import all MDX files from content/docs
const mdxModules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter?: { title?: string; description?: string };
  tableOfContents?: TOCItem[];
}>('/content/docs/*.mdx', { eager: true });

// Build a map of slug -> module
const mdxMap: Record<
  string,
  {
    Component: React.ComponentType;
    frontmatter?: { title?: string; description?: string };
    tableOfContents?: TOCItem[];
  }
> = {};

for (const [path, module] of Object.entries(mdxModules)) {
  // Extract slug from path: ../../content/docs/installation.mdx -> installation
  const match = path.match(/\/([^/]+)\.mdx$/);
  if (match) {
    const slug = match[1];
    // Skip index - handled by /docs/ route
    if (slug !== 'index') {
      mdxMap[slug] = {
        Component: module.default,
        frontmatter: module.frontmatter,
        tableOfContents: module.tableOfContents,
      };
    }
  }
}

export const Route = createFileRoute('/docs/$slug')({
  component: DocPage,
  loader: ({ params }) => {
    const { slug } = params;
    if (!mdxMap[slug]) {
      throw notFound();
    }
    return { slug };
  },
});

function DocPage() {
  const { slug } = Route.useParams();
  const mdxEntry = mdxMap[slug];

  if (!mdxEntry) {
    return <div>Page not found</div>;
  }

  const { Component, frontmatter, tableOfContents } = mdxEntry;
  const components = useMDXComponents({});
  const footer = getPageNavigation(`/docs/${slug}`);
  const title = frontmatter?.title || getPageTitle(`/docs/${slug}`);
  const description = frontmatter?.description;

  // Extract TOC from headings if not provided
  const toc = useMemo(() => {
    if (tableOfContents && tableOfContents.length > 0) {
      return tableOfContents;
    }
    // Default empty TOC - could be enhanced with rehype-toc plugin
    return [];
  }, [tableOfContents]);

  return (
    <DocsContent title={title} description={description} toc={toc} footer={footer}>
      <MDXProvider components={components}>
        <Component />
      </MDXProvider>
    </DocsContent>
  );
}
