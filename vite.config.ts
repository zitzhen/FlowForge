import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Relative base keeps the built assets portable on Cloudflare Pages,
// including when the site is served from a nested path.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
  },
});
