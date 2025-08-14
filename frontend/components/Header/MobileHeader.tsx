'use client';
import { Menu, ArrowUpDown, TrendingUp } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

export default function MobileHeader({ toggleSidebar }: MobileHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const quickActions = [
    { icon: ArrowUpDown, href: '/transfer', label: 'Transfer' },
    { icon: TrendingUp, href: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 w-full">
      {/* Fixed height container to prevent layout shifts */}
      <div className="h-16 sm:h-20 flex flex-col">
        {/* Top Row - Main Header */}
        <div className="flex-1 px-3 sm:px-4 flex items-center justify-between min-h-[48px]">
          {/* Menu Button */}
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            aria-label="Open menu"
          >
            <Menu size={20} className="sm:w-6 sm:h-6" />
          </button>
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <svg 
              className="h-6 sm:h-7 w-auto" 
              viewBox="0 0 100 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
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
            <div className="h-3 sm:h-4 w-px bg-gray-200"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-600">Banking</span>
          </div>
          
          {/* Balance spacer */}
          <div className="w-10"></div>
        </div>

        {/* Quick Actions Row - Only show if there's enough space */}
        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
          <div className="flex items-center gap-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              const isActive = pathname === action.href;
              
              return (
                <button
                  key={action.href}
                  onClick={() => router.push(action.href)}
                  className={`
                    flex-1 flex flex-col items-center justify-center
                    min-h-[44px] px-2 py-2 rounded-lg 
                    transition-all duration-200 touch-manipulation
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100'
                    }
                  `}
                  aria-label={action.label}
                >
                  <IconComponent size={16} className="mb-1" />
                  <span className="text-[10px] sm:text-xs font-medium leading-tight">
                    {action.label}
                  </span>
                </button>
              );
            })}
            
            {/* More Actions Button */}
            <button
              onClick={toggleSidebar}
              className="
                flex-1 flex flex-col items-center justify-center
                min-h-[44px] px-2 py-2 rounded-lg 
                bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100
                transition-all duration-200 touch-manipulation
              "
              aria-label="Open more options"
            >
              <Menu size={16} className="mb-1" />
              <span className="text-[10px] sm:text-xs font-medium leading-tight">More</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
