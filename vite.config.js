import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api_aimastering': {
        target: 'https://api.bakuage.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api_aimastering/, ''),
        secure: false
      }
    }
  }
})

