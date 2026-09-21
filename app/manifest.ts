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
    // El mismo SVG del favicon, referenciado directamente: al ser vectorial,
    // el navegador lo escala a cualquier tamaño que necesite (192, 512, etc.)
    // sin generar PNGs aparte. A cambio no declaramos purpose "maskable": el
    // arte no fue diseñado con el margen de seguridad que ese modo recorta.
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  }
}
