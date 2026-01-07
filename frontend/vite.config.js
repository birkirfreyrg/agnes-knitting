import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/', // Use '/' for custom domain, or '/repository-name/' for GitHub Pages subpath
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
