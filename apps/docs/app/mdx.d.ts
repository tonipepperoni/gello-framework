declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const frontmatter: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };

  export const tableOfContents: Array<{
    title: string;
    url: string;
    depth: number;
  }>;

  const Component: ComponentType;
  export default Component;
}
