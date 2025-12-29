import type { MDXComponents } from 'mdx/types';
import { CodeBlock, Callout, Card, Cards, Tab, Tabs, Step, Steps } from '../components';

// Custom MDX components for rendering
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Code blocks
    pre: ({ children, ...props }) => {
      // Extract code content and language from the code element
      const codeElement = children as React.ReactElement<{
        children?: string;
        className?: string;
      }>;
      const code = codeElement?.props?.children || '';
      const className = codeElement?.props?.className || '';
      const lang = className.replace('language-', '') || 'typescript';

      return <CodeBlock code={code.trim()} lang={lang} {...props} />;
    },
    // Callouts
    Callout,
    // Cards
    Card,
    Cards,
    // Tabs
    Tab,
    Tabs,
    // Steps
    Step,
    Steps,
  };
}

export const mdxComponents = useMDXComponents({});
