// app/layout.tsx - FIXED VERSION
import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'DKB - Banking Made Simple',
  description: 'Your trusted banking partner for accounts, loans, and investments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
