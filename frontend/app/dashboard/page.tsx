// Test 2: Add MobileHeader
'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import MobileHeader from '@/components/Header/MobileHeader';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add MobileHeader */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30">
        <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
      </div>
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-2xl font-bold">Test 2: Sidebar + MobileHeader</h1>
            <p>Do you see ONE or TWO sidebars now?</p>
            <p>Sidebar Open: {sidebarOpen ? 'Yes' : 'No'}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
