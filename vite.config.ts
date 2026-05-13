import { defineConfig } from 'vite';

export default defineConfig({
  base: '/campuscv/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
});
