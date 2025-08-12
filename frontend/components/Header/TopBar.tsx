'use client';
import { useState, useRef, useEffect } from 'react';

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initials = 'CW & MP';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl text-blue-600 font-semibold">Welcome back David</h1>
      
      <div className="flex items-center space-x-3">
        {/* Action Buttons */}
        <button className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
        </button>
        
        <button className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition relative">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
        </button>
        
        <button className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
          </svg>
        </button>

        {/* User Dropdown */}
        <div className="relative ml-4">
          <div className="bg-blue-600 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full">
            {initials}
          </div>
          
          <button
            onClick={() => setOpen(!open)}
            className="ml-2 bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Celestina & Mark
          </button>
          
          {/* Dropdown */}
          {open && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200 dark:border-gray-700"
            >
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Logout
              </button>
              <hr className="border-gray-200 dark:border-gray-700" />
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                <span>Sprache: Deutsch</span>
                <span>🇩🇪</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
