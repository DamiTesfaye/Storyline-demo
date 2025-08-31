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
alias: [
      { find: /^three$/, replacement: path.resolve(__dirname, 'three-legacy.js') },
      { find: 'components', replacement: path.resolve(__dirname, 'static/js/components') },
      { find: 'containers', replacement: path.resolve(__dirname, 'static/js/containers') },
      { find: 'hooks', replacement: path.resolve(__dirname, 'static/js/hooks') },
      { find: 'math', replacement: path.resolve(__dirname, 'static/js/math') },
      { find: 'services', replacement: path.resolve(__dirname, 'static/js/services') },
      { find: 'store', replacement: path.resolve(__dirname, 'static/js/store') },
      { find: 'utils', replacement: path.resolve(__dirname, 'static/js/utils') },
      { find: 'context', replacement: path.resolve(__dirname, 'static/js/context') },
      { find: 'pools', replacement: path.resolve(__dirname, 'static/js/pools') },
      { find: 'assets', replacement: path.resolve(__dirname, 'static/js/assets') },
    ],
  },
});
