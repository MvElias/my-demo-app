import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,            // escucha en todas las interfaces (0.0.0.0)
    allowedHosts: [
      '24918f1a0dd8.ngrok-free.app', // 👈 agrega tu dominio ngrok
    ],
    hmr: {
      host: '24918f1a0dd8.ngrok-free.app', // WebSocket apunta al mismo host
      protocol: 'wss',                      // ngrok va con TLS
      clientPort: 443
    }
  }
})
