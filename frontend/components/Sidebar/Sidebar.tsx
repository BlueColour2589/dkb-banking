'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, Home, CreditCard, ArrowUpDown, Settings, LogOut, 
  History, Repeat, Zap, TrendingUp, PiggyBank, BarChart3,
  FileText, Mail, HelpCircle, Phone, Shield, ChevronRight,
  Menu, Search
} from 'lucide-react';
import { SidebarProps, NavItem } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

// Enhanced navigation with better grouping and quick access
const quickAccessItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Transfer Money', href: '/transfer', icon: ArrowUpDown },
  { label: 'View Accounts', href: '/accounts', icon: CreditCard },
  { label: 'Transactions', href: '/transactions', icon: History },
];

const bankingItems: NavItem[] = [
  { label: 'Standing Orders', href: '/standing-orders', icon: Repeat },
  { label: 'Direct Debits', href: '/direct-debits', icon: Zap },
  { label: 'Cards', href: '/cards', icon: CreditCard },
];

const investmentItems: NavItem[] = [
  { label: 'Portfolio', href: '/portfolio', icon: TrendingUp },
  { label: 'Savings Plans', href: '/savings', icon: PiggyBank },
  { label: 'Market', href: '/market', icon: BarChart3 },
];

const serviceItems: NavItem[] = [
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Messages', href: '/messages', icon: Mail },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help Center', href: '/help', icon: HelpCircle },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    banking: true,
    investment: true,
    services: false
  });
  
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter all items based on search
  const allItems = [...quickAccessItems, ...bankingItems, ...investmentItems, ...serviceItems];
  const filteredItems = searchTerm 
    ? allItems.filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const renderNavItem = (item: NavItem, isQuickAccess = false) => {
    const isActive = pathname === item.href;
    const IconComponent = item.icon;
    
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={handleLinkClick}
        className={`
          flex items-center space-x-3 px-3 py-2.5 mx-2 rounded-lg text-sm font-medium
          transition-all duration-200 group relative
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : isQuickAccess
            ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        {IconComponent && (
          <IconComponent 
            size={18} 
            className={`
              transition-all duration-200
              ${isActive ? 'text-white' : isQuickAccess ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'} 
            `}
          />
        )}
        <span className="flex-1">{item.label}</span>
        
        {/* Active indicator */}
        {isActive && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
        
        {/* Quick access indicator */}
        {isQuickAccess && !isActive && (
          <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500" />
        )}
      </Link>
    );
  };

  const renderCollapsibleSection = (
    title: string,
    items: NavItem[],
    sectionKey: keyof typeof expandedSections,
    color: string
  ) => (
    <div className="space-y-1">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-3 py-2 mx-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
      >
        <span>{title}</span>
        <ChevronRight 
          size={14} 
          className={`transform transition-transform duration-200 ${
            expandedSections[sectionKey] ? 'rotate-90' : ''
          }`}
        />
      </button>
      
      <div className={`space-y-1 transition-all duration-200 ${
        expandedSections[sectionKey] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        {items.map((item) => renderNavItem(item))}
      </div>
    </div>
  );
  
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
        w-72 bg-white border-r border-gray-100 min-h-screen shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
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
                <div className="h-6 w-px bg-gray-200"></div>
                <span className="text-sm font-semibold text-gray-700">Digital Banking</span>
              </div>
              
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">Premium Banking</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* Search Results */}
            {searchTerm && (
              <div className="space-y-1">
                <div className="px-3 py-2 mx-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Search Results ({filteredItems.length})
                  </h3>
                </div>
                {filteredItems.length === 0 ? (
                  <div className="px-3 py-4 mx-2 text-sm text-gray-500 text-center">
                    No features found
                  </div>
                ) : (
                  filteredItems.map((item) => renderNavItem(item))
                )}
              </div>
            )}

            {/* Normal Navigation */}
            {!searchTerm && (
              <>
                {/* Quick Access */}
                <div className="space-y-1">
                  <div className="px-3 py-2 mx-2">
                    <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      Quick Access
                    </h3>
                  </div>
                  {quickAccessItems.map((item) => renderNavItem(item, true))}
                </div>

                {/* Banking Services */}
                {renderCollapsibleSection('Banking', bankingItems, 'banking', 'blue')}
                
                {/* Investment & Savings */}
                {renderCollapsibleSection('Investments', investmentItems, 'investment', 'green')}
                
                {/* Services & Support */}
                {renderCollapsibleSection('Services', serviceItems, 'services', 'purple')}
              </>
            )}
          </nav>
          
          {/* Security Status */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Shield size={16} className="text-green-600" />
              <div className="flex-1">
                <p className="text-xs font-medium text-green-800">Secure Session</p>
                <p className="text-xs text-green-600">SSL Encrypted</p>
              </div>
            </div>
          </div>
          
          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg group"
            >
              <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
