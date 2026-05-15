import type { Metadata, Viewport } from 'next'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import './globals.css'

export const metadata: Metadata = {
  title: 'ColoredNoiseTimer',
  description: '色名ノイズを聞きながら集中できるポモドーロタイマー',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ColoredNoiseTimer',
  },
  icons: {
    icon: '/icon.svg',
    // Safari は SVG の apple-touch-icon を使わないため PNG エンドポイントを指定する
    apple: '/icon-192',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
