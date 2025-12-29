/**
 * Remark plugin to export table of contents from MDX
 *
 * This plugin runs after remarkHeading and exports the TOC
 * that was extracted to file.data.toc as a named export.
 */

import type { Root } from 'mdast';
import type { Transformer } from 'unified';
import type { VFile } from 'vfile';

interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

/**
 * Export table of contents as `tableOfContents` from MDX
 */
export function remarkTocExport(): Transformer<Root, Root> {
  return (tree: Root, file: VFile) => {
    // Get TOC from file.data (populated by remarkHeading)
    const toc = (file.data as { toc?: TOCItem[] }).toc || [];

    // Add export statement for tableOfContents
    tree.children.unshift({
      type: 'mdxjsEsm',
      value: `export const tableOfContents = ${JSON.stringify(toc)};`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'tableOfContents' },
                    init: {
                      type: 'ArrayExpression',
                      elements: toc.map((item) => ({
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: { type: 'Identifier', name: 'title' },
                            value: { type: 'Literal', value: item.title },
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            computed: false,
                          },
                          {
                            type: 'Property',
                            key: { type: 'Identifier', name: 'url' },
                            value: { type: 'Literal', value: item.url },
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            computed: false,
                          },
                          {
                            type: 'Property',
                            key: { type: 'Identifier', name: 'depth' },
                            value: { type: 'Literal', value: item.depth },
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            computed: false,
                          },
                        ],
                      })),
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    } as any);
  };
}
