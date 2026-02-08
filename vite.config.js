import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');
const entryPath = resolve(__dirname, 'src/js/CustomCursor.js');

export default defineConfig({
    root,
    publicDir: 'public',
    plugins: [],
    build: {
      lib: {
        entry: entryPath,
        name: 'CustomCursor',
        formats: ['es', 'umd'],
        fileName: (format) => `CustomCursor.${format}.js`,
      },
      outDir,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@js': resolve(__dirname, './src/js'),
        '@scss': resolve(__dirname, './src/scss'),
        '@assets': resolve(__dirname, './src/assets'),
      },
    },
});
