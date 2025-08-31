import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: [/static\/js\/.*\.js$/, /modules\/.*\.js$/],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'static/js/components'),
      containers: path.resolve(__dirname, 'static/js/containers'),
      hooks: path.resolve(__dirname, 'static/js/hooks'),
      math: path.resolve(__dirname, 'static/js/math'),
      services: path.resolve(__dirname, 'static/js/services'),
      store: path.resolve(__dirname, 'static/js/store'),
      utils: path.resolve(__dirname, 'static/js/utils'),
      context: path.resolve(__dirname, 'static/js/context'),
      pools: path.resolve(__dirname, 'static/js/pools'),
      assets: path.resolve(__dirname, 'static/js/assets'),
      'react-router-dom': path.resolve(__dirname, 'modules'),
    },
  },
});
