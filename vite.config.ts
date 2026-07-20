import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Netlify serves the site at the domain root and builds from source.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
