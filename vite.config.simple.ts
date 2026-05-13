import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Fallback simple Vite React config - use this if TanStack Start fails
// To use: npm run build:simple
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: '.',
  publicDir: 'public',
  server: {
    host: '::',
    port: 8080,
  },
  build: {
    outDir: 'dist/client',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',
    rollupOptions: {
      input: path.resolve(__dirname, 'public/index.html'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
