// app/layout.tsx
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
      <body className="flex h-screen bg-gray-100">
        <AuthProvider>
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
