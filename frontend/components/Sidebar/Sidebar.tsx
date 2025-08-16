'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, Home, ArrowUpDown, Settings, LogOut, 
  History, TrendingUp, PiggyBank, BarChart3,
  HelpCircle, Shield, ChevronRight,
  Search, ChevronLeft, Users, CreditCard
} from 'lucide-react';
import { SidebarProps, NavItem } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

// Simplified navigation for mobile
const quickAccessItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Transfer', href: '/transfer', icon: ArrowUpDown },
];

const moreItems: NavItem[] = [
  { label: 'Portfolio', href: '/portfolio', icon: TrendingUp },
  { label: 'Savings', href: '/savings', icon: PiggyBank },
  { label: 'Market', href: '/market', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help', href: '/help', icon: HelpCircle },
];

// Account holder info (no switching)
const accountHolder = {
  name: 'Celestina W.',
  fullName: 'Celestina White & Mark Peters',
  email: 'celestina.white@dkb.de',
  initial: 'C'
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLinkClick = (): void => {
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const switchUser = () => {
    // User switching disabled
    return;
  };

  // Filter items based on search
  const allItems = [...quickAccessItems, ...moreItems];
  const filteredItems = searchTerm 
    ? allItems.filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const renderNavItem = (item: NavItem, isPrimary = false) => {
    const isActive = pathname === item.href;
    const IconComponent = item.icon;
    
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={handleLinkClick}
        className={`
          flex items-center space-x-3 px-3 sm:px-4 py-3 mx-2 sm:mx-3 rounded-xl text-sm font-medium
          transition-all duration-200 group relative min-h-[48px] touch-manipulation
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : isPrimary
            ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
          }
        `}
      >
        {IconComponent && (
          <IconComponent 
            size={20} 
            className={`
              transition-all duration-200 flex-shrink-0
              ${isActive ? 'text-white' : isPrimary ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'} 
            `}
          />
        )}
        <span className="flex-1 truncate">{item.label}</span>
        
        {/* Active indicator */}
        {isActive && (
          <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
        )}
        
        {/* Arrow for primary items */}
        {isPrimary && !isActive && (
          <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isMobile ? 'w-80 max-w-[85vw]' : 'w-72'} 
        bg-white border-r border-gray-100 min-h-screen shadow-xl lg:shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 overflow-hidden
      `}>
        <div className="flex flex-col h-full">
          {/* Header - Compact for mobile */}
          <div className="p-3 sm:p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                {/* Back button for mobile when on non-dashboard pages */}
                {pathname !== '/dashboard' && isMobile && (
                  <Link 
                    href="/dashboard"
                    onClick={handleLinkClick}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <ChevronLeft size={18} />
                  </Link>
                )}
                
                <div className="flex items-center space-x-2 min-w-0">
                  <svg className="h-6 sm:h-8 flex-shrink-0" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <div className="h-4 sm:h-6 w-px bg-gray-200 flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">Banking</span>
                </div>
              </div>
              
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Simplified Search for Mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all"
              />
            </div>
          </div>
          
          {/* Joint Account Info - No Switching */}
          <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                {accountHolder.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {isMobile ? accountHolder.name : accountHolder.fullName}
                </p>
                <div className="flex items-center space-x-2">
                  <Users size={12} className="text-blue-600 flex-shrink-0" />
                  <span className="text-xs text-blue-600 font-medium">Joint Account</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation - Optimized for Mobile */}
          <nav className="flex-1 overflow-y-auto py-2 sm:py-4 space-y-4 sm:space-y-6">
            {/* Search Results */}
            {searchTerm && (
              <div className="space-y-1">
                <div className="px-3 sm:px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Results ({filteredItems.length})
                  </h3>
                </div>
                {filteredItems.length === 0 ? (
                  <div className="px-3 sm:px-4 py-4 text-sm text-gray-500 text-center">
                    No features found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredItems.map((item) => renderNavItem(item))}
                  </div>
                )}
              </div>
            )}

            {/* Normal Navigation - Simplified for Mobile */}
            {!searchTerm && (
              <>
                {/* Main Actions */}
                <div className="space-y-1">
                  <div className="px-3 sm:px-4 py-2">
                    <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {isMobile ? 'Main' : 'Quick Access'}
                    </h3>
                  </div>
                  {quickAccessItems.map((item) => renderNavItem(item, true))}
                </div>
                
                {/* More Options */}
                <div className="space-y-1">
                  <div className="px-3 sm:px-4 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      More
                    </h3>
                  </div>
                  {moreItems.map((item) => renderNavItem(item))}
                </div>
              </>
            )}
          </nav>
          
          {/* Security Status - Compact for Mobile */}
          <div className="p-3 sm:p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-green-50 rounded-xl border border-green-200">
              <Shield size={14} className="text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-800">Secure Session</p>
                {!isMobile && <p className="text-xs text-green-600">SSL Encrypted</p>}
              </div>
            </div>
          </div>
          
          {/* Logout */}
          <div className="p-3 sm:p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-xl group min-h-[48px] touch-manipulation"
            >
              <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors duration-200 flex-shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
