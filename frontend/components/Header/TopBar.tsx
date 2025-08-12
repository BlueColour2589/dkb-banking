'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Accounts', href: '/accounts' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="w-80 bg-blue-600 text-white min-h-screen px-6 py-8 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <h1 className="text-xl font-bold text-white">Bank</h1>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 text-lg transition ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Session Info */}
        <div className="mt-8 space-y-1 text-xs text-blue-200">
          <p>Prodicare 199-9.0.1</p>
          <p>Staral Lansets Indard</p>
        </div>
      </div>
      
      {/* Logout */}
      <div>
        <Link 
          href="/logout"
          className="flex items-center space-x-3 text-blue-200 hover:text-white transition"
        >
          <span>Logout</span>
        </Link>
        {/* Footer */}
        <div className="text-xs text-blue-300 mt-4">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
}
