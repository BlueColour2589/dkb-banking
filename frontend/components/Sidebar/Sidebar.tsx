'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { SidebarProps, NavItem } from '@/types/dashboard';

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Accounts', href: '/accounts' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Settings', href: '/settings' },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  
  const handleLinkClick = (): void => {
    setIsOpen(false);
  };

  const handleCloseClick = (): void => {
    setIsOpen(false);
  };

  const handleOverlayClick = (): void => {
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-blue-600 text-white min-h-screen 
        px-6 py-8 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div>
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <h1 className="text-xl font-bold text-white">Bank</h1>
              </div>
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={handleCloseClick}
                className="lg:hidden p-2 text-white hover:bg-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-6" role="navigation">
            {navItems.map((item: NavItem) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 text-lg transition-colors duration-200 ${
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
            onClick={handleLinkClick}
            className="flex items-center space-x-3 text-blue-200 hover:text-white transition-colors duration-200"
          >
            <span>Logout</span>
          </Link>
          {/* Footer */}
          <div className="text-xs text-blue-300 mt-4">
            Version 1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}
