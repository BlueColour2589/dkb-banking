// Test 1: Dashboard with ONLY Sidebar
'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-2xl font-bold">Test 1: Only Sidebar</h1>
            <p>Do you see ONE or TWO sidebars?</p>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Toggle Sidebar
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
