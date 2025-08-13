'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, Home, CreditCard, ArrowUpDown, Settings, LogOut, 
  History, Repeat, Zap, TrendingUp, PiggyBank, BarChart3,
  FileText, Mail, HelpCircle, Phone, Shield
} from 'lucide-react';
import { SidebarProps, NavItem } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

// Core Banking Functions
const coreNavItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Accounts', href: '/accounts', icon: CreditCard },
  { label: 'Transfer', href: '/transfer', icon: ArrowUpDown },
  { label: 'Transactions', href: '/transactions', icon: History },
  { label: 'Standing Orders', href: '/standing-orders', icon: Repeat },
  { label: 'Direct Debits', href: '/direct-debits', icon: Zap },
];

// Investment & Savings
const investmentNavItems: NavItem[] = [
  { label: 'Portfolio', href: '/portfolio', icon: TrendingUp },
  { label: 'Savings Plans', href: '/savings', icon: PiggyBank },
  { label: 'Market', href: '/market', icon: BarChart3 },
];

// Services
const serviceNavItems: NavItem[] = [
  { label: 'Cards', href: '/cards', icon: CreditCard },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Messages', href: '/messages', icon: Mail },
  { label: 'Settings', href: '/settings', icon: Settings },
];

// Support
const supportNavItems: NavItem[] = [
  { label: 'Help Center', href: '/help', icon: HelpCircle },
  { label: 'Contact', href: '/contact', icon: Phone },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  
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

  const renderNavSection = (items: NavItem[], title?: string) => (
    <div className="space-y-1">
      {title && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      {items.map((item: NavItem) => {
        const isActive = pathname === item.href;
        const IconComponent = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            className={`
              flex items-center space-x-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium
              transition-all duration-200 group
              ${isActive 
                ? 'bg-blue-50 text-blue-700 border-l-3 border-blue-600 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {IconComponent && (
              <IconComponent 
                size={18} 
                className={`
                  transition-colors duration-200
                  ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} 
                `}
              />
            )}
            <span>{item.label}</span>
            
            {/* Active indicator */}
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            )}
          </Link>
        );
      })}
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
                <div className="h-6 w-px bg-gray-200"></div>
                <span className="text-sm font-medium text-gray-600">Banking</span>
              </div>
              
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* Core Banking */}
            {renderNavSection(coreNavItems, 'Banking')}
            
            {/* Investment & Savings */}
            {renderNavSection(investmentNavItems, 'Investments')}
            
            {/* Services */}
            {renderNavSection(serviceNavItems, 'Services')}
            
            {/* Support */}
            {renderNavSection(supportNavItems, 'Support')}
          </nav>
          
          {/* Security Status */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Shield size={16} className="text-green-600" />
              <div>
                <p className="text-xs font-medium text-green-800">Secure Connection</p>
                <p className="text-xs text-green-600">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
          
          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg group"
            >
              <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
