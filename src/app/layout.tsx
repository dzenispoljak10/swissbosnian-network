import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Swiss Bosnian Network',
  description: 'Vernetze dich mit der bosnischen Community in der Schweiz.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
    shortcut: '/icon.png',
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
