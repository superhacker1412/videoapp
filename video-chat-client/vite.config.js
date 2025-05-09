import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
   plugins: [react(),  tailwindcss()],

    server: {
      host: "0.0.0.0", // чтобы другие устройства могли подключиться
      port: 5173,
      proxy: {
        "/socket.io": "http://192.168.1.8:3000", // твой бэкенд
      },
    },

  
})
