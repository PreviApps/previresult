import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: '0.0.0.0',
    port: 4015,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '10.10.119.45',
      '10.10.119.97',
      'previresult.previsalud.com.co'
    ]
  }
})
