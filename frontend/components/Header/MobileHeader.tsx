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
      
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <h1 className="text-lg font-bold text-gray-900">Bank</h1>
      </div>
      
      <div className="w-10"></div> {/* Spacer for centering */}
    </header>
  );
}
