import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { remarkHeading } from 'fumadocs-core/mdx-plugins';
import { remarkTocExport } from './app/lib/remark-toc-export';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    mdx({
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkHeading,    // Extract headings and generate TOC
        remarkTocExport,  // Export TOC as tableOfContents
      ],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      providerImportSource: '@mdx-js/react',
    }),
    tanstackStart({
      srcDirectory: 'app',
    }),
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
});
