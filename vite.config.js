import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external access
    allowedHosts: [
      '0c2b-2409-40e4-38-e547-d1e9-778c-e8a2-6463.ngrok-free.app' // your ngrok domain
    ]
  }
})
