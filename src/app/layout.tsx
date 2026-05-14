import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ColoredNoiseTimer',
  description: '色名ノイズを聞きながら集中できるポモドーロタイマー',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        {children}
      </body>
    </html>
  )
}
