import type { ReactNode } from 'react';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';

interface DocsContentProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocsContent({ title, description, children }: DocsContentProps) {
  return (
    <DocsPage>
      <DocsTitle>{title}</DocsTitle>
      {description && <DocsDescription>{description}</DocsDescription>}
      <DocsBody>{children}</DocsBody>
    </DocsPage>
  );
}
