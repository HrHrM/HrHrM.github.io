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
  //
  // `host: '127.0.0.1'` y no el `localhost` por defecto: desde Node 17 el
  // orden de resolución de DNS es «verbatim», así que `localhost` se resuelve
  // a `::1` y el servidor queda escuchando **solo en IPv6**. Chrome reintenta
  // en IPv4 y no se nota; Firefox no, y devuelve conexión rechazada en la
  // misma URL que Vite acaba de imprimir en la consola.
  //
  // Fijar la IPv4 en vez de `host: true` es deliberado: `true` expone el
  // servidor a toda la red local, que para un portafolio no hace falta.
  server: { port: 3000, host: '127.0.0.1' },
  preview: { port: 3000, host: '127.0.0.1' },
})
