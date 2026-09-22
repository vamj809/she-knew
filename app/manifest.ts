import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ella sabía...',
    short_name: 'Ella sabía',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fffdf5',
    theme_color: '#f5b820',
    // El SVG del favicon no era suficiente para que Chrome/Android generen el
    // ícono de pantalla de inicio de forma confiable, así que usamos PNG en los
    // tamaños estándar de densidad de Android (mdpi–xxxhdpi, más 512 para Play).
    icons: [
      { src: '/metadata/launchericon-48x48.png', sizes: '48x48', type: 'image/png', purpose: 'any' },
      { src: '/metadata/launchericon-72x72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
      { src: '/metadata/launchericon-96x96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
      { src: '/metadata/launchericon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
      { src: '/metadata/launchericon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/metadata/launchericon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
