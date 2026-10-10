import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React runs on port 3000 and talks to Express on port 5000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
});