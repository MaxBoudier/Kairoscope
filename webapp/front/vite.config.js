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
      clientPort: 80,
    },
    proxy: {
      '/api/predict': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/predict/, '/ws/predict'),
        ws: true
      },
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Symfony via Apache usually expects /api prefix? No, usually public/index.php handlers.
        // If API container serves /var/www/html/public, then /api request -> /public/index.php/api...
        // Let's assume Symfony listens on root. If /api prefix is used in routes, we keep it. 
        // If routes are /public/login, then /api/public/login -> /public/login.
        // In Nginx config we did: location /api { proxy_pass http://api:80; }
        // If we request /api/foo, nginx sends /api/foo to backend? Or /foo?
        // Default proxy_pass without URI passes full URI.
        // So Symfony receives /api/foo.
        // I will NOT rewrite path for API unless confirmed.
      }
    },
  },
})