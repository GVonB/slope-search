import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

const isDocker = process.env.DOCKER === 'true';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': isDocker ? 'http://server:3000' : 'http://localhost:3000'
    }
  },
  preview: {
    allowedHosts: ['localhost', 'slope-search.gvonb.dev', 'slope-api.gvonb.dev', 'server']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})