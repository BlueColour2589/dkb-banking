'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, CreditCard, ArrowUpDown, Settings, LogOut } from 'lucide-react';
import { SidebarProps, NavItem } from '@/types/dashboard';

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Accounts', href: '/accounts', icon: CreditCard },
  { label: 'Transactions', href: '/transactions', icon: ArrowUpDown },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  
  const handleLinkClick = (): void => {
    setIsOpen(false);
  };
  
  const handleCloseClick = (): void => {
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white min-h-screen 
        px-6 py-6 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h1 className="text-xl font-bold text-white">Bank</h1>
              </div>
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={handleCloseClick}
                className="lg:hidden p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2" role="navigation">
            {navItems.map((item: NavItem) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-white bg-opacity-20 text-white font-semibold shadow-md' 
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                    }
                  `}
                >
                  {IconComponent && (
                    <IconComponent 
                      size={20} 
                      className={`
                        transition-transform duration-200 group-hover:scale-110
                        ${isActive ? 'text-white' : 'text-blue-200'}
                      `} 
                    />
                  )}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Session Info */}
          <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
            <div className="space-y-1 text-xs text-blue-100">
              <p className="font-medium">Prodicare 199-9.0.1</p>
              <p>Staral Lansets Indard</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white border-opacity-20 pt-4 mt-6">
          {/* Logout */}
          <Link 
            href="/logout"
            onClick={handleLinkClick}
            className="flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all duration-200 rounded-lg group"
          >
            <LogOut 
              size={20} 
              className="text-blue-200 transition-transform duration-200 group-hover:scale-110" 
            />
            <span className="font-medium">Logout</span>
          </Link>
          
          {/* Footer */}
          <div className="text-xs text-blue-300 mt-4 px-4 opacity-75">
            Version 1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}
