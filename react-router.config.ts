import type { Config } from '@react-router/dev/config'

export default {
  // Conserva el árbol de src/ que describe el CLAUDE.md en vez del app/ por defecto.
  appDirectory: 'src',
  buildDirectory: 'dist',

  // Sin servidor en runtime: el build emite un .html por ruta y el cliente hidrata.
  ssr: false,

  // Con ssr:false las rutas dinámicas hay que enumerarlas una a una.
  // Al entrar ProjectDetail esto pasa a una función async que lee los slugs
  // de src/content/{es,en}/projects.ts.
  prerender: ['/', '/en'],
} satisfies Config
