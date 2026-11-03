import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/expense-tracker/', // must match your GitHub repo name exactly
  plugins: [react(), tailwindcss()],
})