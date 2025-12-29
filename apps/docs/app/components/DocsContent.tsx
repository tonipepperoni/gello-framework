import type { ReactNode } from 'react';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';
import type { TOCItemType } from 'fumadocs-core/toc';

export interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

interface DocsContentProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** Table of contents items */
  toc?: TOCItem[];
  /** Current page URL for footer navigation */
  pageUrl?: string;
  /** Footer navigation items */
  footer?: {
    previous?: { name: string; url: string };
    next?: { name: string; url: string };
  };
}

export function DocsContent({
  title,
  description,
  children,
  toc,
  footer,
}: DocsContentProps) {
  // Convert our TOC format to fumadocs format
  const tocItems: TOCItemType[] | undefined = toc?.map((item) => ({
    title: item.title,
    url: item.url,
    depth: item.depth,
  }));

  return (
    <DocsPage
      toc={tocItems}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
      breadcrumb={{
        enabled: true,
        includePage: true,
      }}
      footer={
        footer
          ? {
              enabled: true,
              items: {
                previous: footer.previous
                  ? { name: footer.previous.name, url: footer.previous.url }
                  : undefined,
                next: footer.next
                  ? { name: footer.next.name, url: footer.next.url }
                  : undefined,
              },
            }
          : undefined
      }
    >
      <DocsTitle>{title}</DocsTitle>
      {description && <DocsDescription>{description}</DocsDescription>}
      <DocsBody>{children}</DocsBody>
    </DocsPage>
  );
}
