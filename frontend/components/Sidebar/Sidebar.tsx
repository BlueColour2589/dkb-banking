'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Accounts', href: '/accounts' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Settings', href: '/settings' },
  { label: 'Logout', href: '/logout' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen px-6 py-8 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-xl font-bold text-blue-800 dark:text-blue-300">DKB Banking</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mark Peters & Celestina White</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Session Info */}
        <div className="mt-8 space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <p>Prodicare 199-9.0.1</p>
          <p>Staral Lansets Indard</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-400 dark:text-gray-600">
        Version 1.0.0
      </div>
    </aside>
  );
}
