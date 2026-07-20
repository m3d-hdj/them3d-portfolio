import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo at /them3d-portfolio/
export default defineConfig({
  plugins: [react()],
  base: '/them3d-portfolio/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
