import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // تسمح بالوصول من أي جهاز على نفس الشبكة
    port: 5173,
  },
})