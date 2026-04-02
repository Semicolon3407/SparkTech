import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: `${APP_NAME} - Electronics Store Nepal`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['electronics', 'mobile', 'laptop', 'earphones', 'headphones', 'Nepal', 'online shopping'],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: APP_NAME,
    title: `${APP_NAME} - Electronics Store Nepal`,
    description: APP_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4361EE' },
    { media: '(prefers-color-scheme: dark)', color: '#4361EE' },
  ],
  width: 'device-width',
  initialScale: 1,
}

import { AuthProvider } from '@/contexts/auth-context'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans antialiased text-gray-950`}>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
