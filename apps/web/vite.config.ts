import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: [
      { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, 'src/$1') },
      { find: /^@shared\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/shared/src/$1') },
      { find: /^@shared$/, replacement: path.resolve(__dirname, '../../packages/shared/src/index.ts') },
      { find: /^@agents\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/agents/src/$1') },
      { find: /^@agents$/, replacement: path.resolve(__dirname, '../../packages/agents/src/index.ts') },
      { find: /^@graph\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/graph/src/$1') },
      { find: /^@graph$/, replacement: path.resolve(__dirname, '../../packages/graph/src/index.ts') }
    ]
  }
});
