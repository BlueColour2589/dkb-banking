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
    <div className="flex justify-end items-center relative space-x-4">
      {/* Initials Avatar */}
      <div className="bg-blue-600 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full">
        {initials}
      </div>

      {/* User Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        Celestina & Mak
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
            <span className="text-lg">🇩🇪</span>
          </button>
        </div>
      )}
    </div>
  );
}
