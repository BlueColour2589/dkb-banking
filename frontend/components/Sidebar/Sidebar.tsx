'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, CreditCard, ArrowUpDown, Settings, LogOut } from 'lucide-react';
import { SidebarProps, NavItem } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Accounts', href: '/accounts', icon: CreditCard },
  { label: 'Transfer', href: '/transactions', icon: ArrowUpDown },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  
  const handleLinkClick = (): void => {
    setIsOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-100 min-h-screen 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="h-8" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text 
                    x="2" 
                    y="28" 
                    fontSize="24" 
                    fontWeight="700" 
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fill="#0066CC"
                    letterSpacing="-0.5px"
                  >
                    DKB
                  </text>
                </svg>
              </div>
              
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* User Info - Minimal */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item: NavItem) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-3 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  {IconComponent && (
                    <IconComponent 
                      size={18} 
                      className={isActive ? 'text-blue-600' : 'text-gray-400'} 
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg"
            >
              <LogOut size={18} className="text-gray-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
