import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Dev-only proxy so `npm run dev` reaches a local backend via relative /api.
  // In prod the client calls VITE_API_URL directly (see src/App.jsx).
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  // Served behind Railway's proxy under whatever domain you assign, so don't
  // pin a host allowlist.
  preview: {
    allowedHosts: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})