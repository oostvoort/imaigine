import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    fs: {
      strict: false,
    },
    proxy: {
      '/map': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/map/, ''),
      },
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/map/, ''),
      },
      '/mapdata': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/map/, ''),
      },
    },
  },
  build: {
    target: 'es2022',
    minify: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
