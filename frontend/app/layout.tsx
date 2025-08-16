// app/layout.tsx - SEO OPTIMIZED + MOBILE STABILITY VERSION
import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'DaskanBank - Digital Banking Made Simple | Secure Online Banking',
  description: 'Experience modern digital banking with DaskanBank. Secure transfers, portfolio management, real-time account monitoring, and 24/7 access to your finances. Join thousands of satisfied customers.',
  keywords: 'digital banking, online banking, secure transfers, portfolio management, DaskanBank, mobile banking, financial services, bank account, money transfer, investment portfolio, deutsche bank, european banking',
  authors: [{ name: 'DaskanBank' }],
  creator: 'DaskanBank Digital Solutions',
  publisher: 'DaskanBank',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  
  // Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
  openGraph: {
    title: 'DaskanBank - Digital Banking Made Simple',
    description: 'Secure digital banking with advanced features. Join DaskanBank for seamless money transfers, portfolio management, and 24/7 account access.',
    url: 'https://www.daskanbank.com',
    siteName: 'DaskanBank',
    images: [
      {
        url: 'https://www.daskanbank.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DaskanBank Digital Banking Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'DaskanBank - Digital Banking Made Simple',
    description: 'Secure digital banking with advanced features. Experience modern banking with DaskanBank.',
    images: ['https://www.daskanbank.com/twitter-image.jpg'],
    creator: '@daskanbank',
  },
  
  // Additional SEO
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
  
  // Verification for search engines
  verification: {
    google: 'your-google-verification-code', // You'll get this from Search Console
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      me: ['https://www.daskanbank.com', 'mailto:contact@daskanbank.com'],
    },
  },
  
  // App specific
  applicationName: 'DaskanBank',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  themeColor: '#0066CC',
  
  // Additional meta
  category: 'finance',
  classification: 'banking',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        {/* Mobile viewport meta tag for stability */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        
        {/* Prevent iOS bounce scrolling */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* PWA meta tags for better mobile experience */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DaskanBank" />
        
        {/* Prevent text size adjustment on orientation change */}
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="web" />
        <meta name="rating" content="general" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="DE" />
        <meta name="geo.country" content="Germany" />
        <meta name="geo.placename" content="Berlin" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.daskanbank.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data for Banking Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "DaskanBank",
              "alternateName": "DaskanBank Digital Banking",
              "url": "https://www.daskanbank.com",
              "logo": "https://www.daskanbank.com/logo.png",
              "description": "Digital banking platform offering secure transfers, portfolio management, and comprehensive financial services.",
              "telephone": "+49-30-123456789",
              "email": "contact@daskanbank.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Unter den Linden 1",
                "addressLocality": "Berlin",
                "postalCode": "10117",
                "addressCountry": "DE"
              },
              "serviceType": "Digital Banking",
              "areaServed": "Germany",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Banking Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Money Transfer"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Portfolio Management"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Account Management"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className="overflow-x-hidden antialiased bg-gray-50 text-gray-900 no-select">
        {/* Add a stable container wrapper */}
        <div id="app-root" className="min-h-screen overflow-x-hidden">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
