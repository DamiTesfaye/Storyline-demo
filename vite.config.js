import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { transform } from 'esbuild';

function jsxPlugin() {
  return {
    name: 'jsx-transform',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.js')) {
        return transform(code, { loader: 'jsx', sourcemap: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [jsxPlugin(), react({ include: ['**/*.{jsx,tsx,js,ts}'] })],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'ts',
        '.tsx': 'tsx',
      },
    },
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
    },
  },
});
