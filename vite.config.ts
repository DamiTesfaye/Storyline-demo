import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.REACT_APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  test: {
    environment: 'jsdom',
  },
});
