import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: resolve(__dirname, 'src'),
    base: './',
    build: {
      outDir: resolve(__dirname, 'dist-site'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/index.html'),
          api: resolve(__dirname, 'src/api.html'),
          examples: resolve(__dirname, 'src/examples.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@js': resolve(__dirname, './src/js'),
        '@scss': resolve(__dirname, './src/scss'),
      },
    },
});
