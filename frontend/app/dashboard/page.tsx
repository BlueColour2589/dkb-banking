'use client';
import { useState } from 'react';

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Debug Test - NO SIDEBAR</h1>
        <p>This page has NO sidebar imported at all.</p>
        <p>Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Click me
        </button>
        <p className="text-sm text-red-600 mt-4">
          If you STILL see a sidebar on this page, then there's a layout file somewhere rendering it!
        </p>
      </div>
    </div>
  );
}
