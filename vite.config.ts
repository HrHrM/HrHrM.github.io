import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// No se añade @vitejs/plugin-react: en framework mode lo aporta reactRouter(),
// y tenerlo dos veces rompe el HMR.
export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
