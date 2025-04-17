import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/front-5th-chapter2-1/',
  build: {
    outDir: 'docs',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
});
