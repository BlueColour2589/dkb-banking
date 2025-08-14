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
    <>
      {/* Main Header */}
      <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
        {/* Top Row */}
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-3">
            <svg className="h-7" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="h-4 w-px bg-gray-200"></div>
            <span className="text-sm font-medium text-gray-600">Banking</span>
          </div>
          
          {/* Empty div to maintain spacing balance */}
          <div className="w-10"></div>
        </div>

        {/* Quick Actions Row */}
        <div className="px-4 pb-3">
          <div className="flex items-center space-x-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              const isActive = pathname === action.href;
              
              return (
                <button
                  key={action.href}
                  onClick={() => router.push(action.href)}
                  className={`flex-1 flex flex-col items-center space-y-1 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              );
            })}
            
            {/* More Actions Button */}
            <button
              onClick={toggleSidebar}
              className="flex-1 flex flex-col items-center space-y-1 p-3 rounded-lg bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <Menu size={18} />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
