import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', '172.19.0.1', 'kairoscope.maxboudier.fr'],
    hmr: {
      // Le port doit correspondre au port exposé par Docker (80)
      clientPort: 80,
    },
  },
})