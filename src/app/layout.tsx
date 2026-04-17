import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://swissbosnian-network.ch'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    template: '%s | Swiss Bosnian Network',
    default: 'Swiss Bosnian Network',
  },
  description: 'Das Swiss Bosnian Network vernetzt Bosnier:innen in der Schweiz. Professionelles Netzwerk, exklusive Events und Mitgliedervorteile für die bosnische Diaspora.',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.png',
  },
  openGraph: {
    siteName: 'Swiss Bosnian Network',
    type: 'website',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Swiss Bosnian Network' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontSize: 14 } }} />
      </body>
    </html>
  )
}
