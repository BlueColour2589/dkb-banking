// components/Header/TopBar.tsx
'use client';

import { useState } from 'react';

export default function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end items-center relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Celestina & Mak
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-10">
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            Settings
          </button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
