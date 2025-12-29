// Re-export Fumadocs UI components directly
// See: https://fumadocs.dev/docs/ui/components

// Code display - custom lightweight version for Cloudflare Workers size limits
export { CodeBlock } from './CodeBlock';

// Callouts & alerts
export { Callout } from 'fumadocs-ui/components/callout';

// Cards
export { Card, Cards } from 'fumadocs-ui/components/card';

// Tabs
export { Tab, Tabs } from 'fumadocs-ui/components/tabs';

// Steps (for tutorials/guides)
export { Step, Steps } from 'fumadocs-ui/components/steps';

// File trees
export { File, Files, Folder } from 'fumadocs-ui/components/files';

// Accordion (for FAQs)
export { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

// Type documentation tables
export { TypeTable } from 'fumadocs-ui/components/type-table';

// Image zoom
export { ImageZoom } from 'fumadocs-ui/components/image-zoom';

// Inline table of contents
export { InlineTOC } from 'fumadocs-ui/components/inline-toc';

// Banner for announcements
export { Banner } from 'fumadocs-ui/components/banner';

// Page components
export {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';

// Custom wrapper for consistent page structure
export { DocsContent, type TOCItem } from './DocsContent';

// Mermaid diagrams (client-only)
export { Mermaid } from './Mermaid';
