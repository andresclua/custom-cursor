import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: resolve(__dirname, 'src'),
    publicDir: 'public',
    build: {
      outDir: resolve(__dirname, 'demo'),
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
