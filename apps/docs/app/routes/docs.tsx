import { Suspense } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { baseOptions } from '../lib/layout.shared';
import { pageTree } from '../lib/source';

export const Route = createFileRoute('/docs')({
  component: DocsLayoutWrapper,
});

// Skeleton that matches DocsPage structure to prevent CLS
function PageSkeleton() {
  // Provide empty TOC array to reserve TOC space
  const emptyToc = [
    { title: '', url: '#', depth: 2 },
    { title: '', url: '#', depth: 2 },
    { title: '', url: '#', depth: 2 },
  ];

  return (
    <DocsPage
      toc={emptyToc}
      tableOfContent={{ style: 'clerk', single: false }}
      breadcrumb={{ enabled: true, includePage: true }}
    >
      <DocsBody>
        <div className="min-h-[calc(100vh-300px)]" />
      </DocsBody>
    </DocsPage>
  );
}

function DocsLayoutWrapper() {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={pageTree}
      sidebar={{
        defaultOpenLevel: 1,
        collapsible: true,
      }}
    >
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </DocsLayout>
  );
}
