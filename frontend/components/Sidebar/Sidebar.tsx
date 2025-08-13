'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, CreditCard, ArrowUpDown, Settings, LogOut, Banknote } from 'lucide-react';
import { SidebarProps, NavItem } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Accounts', href: '/accounts', icon: CreditCard },
  { label: 'Transactions', href: '/transactions', icon: ArrowUpDown },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  
  const handleLinkClick = (): void => {
    setIsOpen(false);
  };
  
  const handleCloseClick = (): void => {
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
        w-64 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white min-h-screen 
        px-6 py-6 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        shadow-2xl lg:shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-blue-50 rounded-xl flex items-center justify-center shadow-lg">
                  <Banknote className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">DKB Bank</h1>
                  <p className="text-xs text-blue-200 opacity-90">Digital Banking</p>
                </div>
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
          
          {/* User Welcome */}
          {user && (
            <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Welcome back!</p>
                  <p className="text-blue-200 text-xs truncate max-w-32">
                    {user.name || user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
                    flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-white bg-opacity-20 text-white font-semibold shadow-lg border border-white border-opacity-30' 
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-15 hover:text-white hover:shadow-md'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                  )}
                  
                  {IconComponent && (
                    <IconComponent 
                      size={20} 
                      className={`
                        transition-all duration-200 group-hover:scale-110
                        ${isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'}
                      `} 
                    />
                  )}
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-5 transition-opacity duration-200 rounded-xl"></div>
                </Link>
              );
            })}
          </nav>
          
          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-r from-white from-opacity-10 to-blue-500 to-opacity-20 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
            <div className="space-y-2 text-xs text-blue-100">
              <div className="flex justify-between items-center">
                <span>Account Status</span>
                <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-200 rounded-full text-xs font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Security Level</span>
                <span className="text-white font-medium">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Login</span>
                <span className="text-white font-medium">Today</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white border-opacity-20 pt-6 mt-6">
          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-red-500 hover:bg-opacity-20 hover:text-white transition-all duration-200 rounded-xl group"
          >
            <LogOut 
              size={20} 
              className="text-blue-200 group-hover:text-red-300 transition-all duration-200 group-hover:scale-110" 
            />
            <span className="font-medium">Logout</span>
          </button>
          
          {/* Footer */}
          <div className="text-xs text-blue-300 mt-4 px-4 opacity-75 text-center">
            <p>DKB Banking v2.0.1</p>
            <p className="mt-1">Secure • Reliable • Fast</p>
          </div>
        </div>
      </aside>
    </>
  );
}
