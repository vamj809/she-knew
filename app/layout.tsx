import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Josefin_Sans } from 'next/font/google'
import './globals.css'

const serifDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif-display',
})

const sansInvitation = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans-invitation',
})

export const metadata: Metadata = {
  title: 'Ella sabía...',
  description: 'Algún día pasaría... una pequeña flor hecha para ti.',
  applicationName: 'Ella sabía...',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ella sabía...',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5b820',
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
    <html lang="es" className={`${serifDisplay.variable} ${sansInvitation.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
