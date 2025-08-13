'use client';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

export default function MobileHeader({ toggleSidebar }: MobileHeaderProps) {
  return (
    <header className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <button
        onClick={toggleSidebar}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={24} />
      </button>
      
      <div className="flex items-center">
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
      </div>
      
      <div className="w-10"></div> {/* Spacer for centering */}
    </header>
  );
}
