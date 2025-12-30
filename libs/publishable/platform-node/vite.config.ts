/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/publishable/platform-node',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
      pathsToAliases: false,
      outDir: './dist',
    }),
  ],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: 'src/index.ts',
      name: 'gello-platform-node',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      // Bundle internal @gello/core-* packages, externalize effect and published @gello/* packages
      external: [/^effect/, /^@effect/, /^@gello\/core$/, /^@gello\/common$/, /^node:/],
    },
  },
}));
