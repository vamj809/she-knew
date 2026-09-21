import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Patrick_Hand } from 'next/font/google'
import './globals.css'

const handwriting = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-handwriting',
})

export const metadata: Metadata = {
  title: 'Ella sabía...',
  description: 'Un regalo digital para el día de la flor amarilla. Toca la flor y deja que florezca.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fef3c7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={handwriting.variable}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
