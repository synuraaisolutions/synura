import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { RetellWidget } from '@/components/retell-widget'
import { ContactPopup } from '@/components/common/contact-popup'
import { CalendlyIntegration } from '@/components/calendly-integration'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Synura AI Solutions - Smarter systems. Stronger businesses.',
    template: '%s | Synura AI Solutions',
  },
  description: 'AI automation agency that helps businesses save time, reduce costs, and eliminate inefficiency through intelligent systems and custom-built AI agents.',
  keywords: ['AI automation', 'business automation', 'AI agents', 'workflow automation', 'digital transformation'],
  authors: [{ name: 'Synura AI Solutions' }],
  creator: 'Synura AI Solutions',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://synura.ai',
    title: 'Synura AI Solutions - Smarter systems. Stronger businesses.',
    description: 'AI automation agency that helps businesses save time, reduce costs, and eliminate inefficiency through intelligent systems and custom-built AI agents.',
    siteName: 'Synura AI Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synura AI Solutions - Smarter systems. Stronger businesses.',
    description: 'AI automation agency that helps businesses save time, reduce costs, and eliminate inefficiency through intelligent systems and custom-built AI agents.',
    creator: '@synuraai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}

        {/* Retell SDK is now imported via npm package */}


        {/* Contact Popup */}
        <ContactPopup />

        {/* Calendly Integration */}
        <CalendlyIntegration />

        {/* Analytics and Monitoring Scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Plausible Analytics */}
            <Script
              defer
              data-domain="synura.ai"
              src="https://plausible.io/js/script.js"
              strategy="afterInteractive"
            />

            {/* Sentry Error Tracking */}
            <Script
              src="https://js.sentry-cdn.com/YOUR_SENTRY_DSN.min.js"
              strategy="afterInteractive"
            />
          </>
        )}
      </body>
    </html>
  )
}