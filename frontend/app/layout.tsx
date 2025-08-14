// app/layout.tsx - MOBILE STABILITY FIXED VERSION
import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'DKB - Banking Made Simple',
  description: 'Your trusted banking partner for accounts, loans, and investments.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
        {/* Prevent text size adjustment on orientation change */}
        <meta name="msapplication-tap-highlight" content="no" />
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
