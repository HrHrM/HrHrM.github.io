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
  // Un solo puerto para todo el proyecto, en vez del 5173 por defecto de Vite.
  // `dev` y `preview` comparten el 3000 a propósito: nunca hacen falta a la vez,
  // y así la URL con la que se prueba es siempre la misma.
  server: { port: 3000 },
  preview: { port: 3000 },
})
