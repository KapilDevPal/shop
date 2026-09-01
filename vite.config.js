import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // './' keeps asset paths relative — required for GitHub Pages to work correctly
  // when the site is served from a custom domain (no sub-path needed in this case).
  base: './',
});
