// frontend/components/Sidebar/Sidebar.tsx

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Accounts', href: '/accounts' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen px-6 py-8">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">DKB Banking</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
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

      <div className="mt-12 text-xs text-gray-400 dark:text-gray-600">
        Version 1.0.0
      </div>
    </aside>
  );
}
