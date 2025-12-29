import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/todo',
  plugins: [nxViteTsPaths()],
  build: {
    outDir: '../../dist/apps/todo',
    emptyOutDir: true,
    target: 'node20',
    ssr: true,
    rollupOptions: {
      input: path.join(__dirname, 'src/main.ts'),
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
      },
      external: [/^node:/, /^effect/, /^@effect/, /^@gello/],
    },
  },
}));
