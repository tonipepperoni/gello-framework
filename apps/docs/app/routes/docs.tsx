import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '../lib/layout.shared';
import { pageTree } from '../lib/source';

export const Route = createFileRoute('/docs')({
  component: DocsLayoutWrapper,
});

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
      <Outlet />
    </DocsLayout>
  );
}
