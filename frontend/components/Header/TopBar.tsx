'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Settings, User, LogOut, Globe } from 'lucide-react';

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Generate initials from user data
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'DU'; // Default User
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Demo User';
  };

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

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl text-gray-800 font-bold">
          Welcome back, {getDisplayName()}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Quick Action Buttons */}
        <button className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-md group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-200" />
        </button>
        
        <button className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-md relative group">
          <Bell className="w-5 h-5 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            2
          </span>
        </button>
        
        <button className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-md group">
          <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* User Dropdown */}
        <div className="relative ml-4">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl px-4 py-2 transition-all duration-200 hover:shadow-md"
          >
            {/* Avatar */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-md">
              {getInitials()}
            </div>
            
            {/* User Info */}
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-800">
                {getDisplayName()}
              </div>
              <div className="text-xs text-gray-500">
                Premium Account
              </div>
            </div>
            
            {/* Dropdown Arrow */}
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {open && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl rounded-xl overflow-hidden z-20 border border-gray-200 animate-in slide-in-from-top-2 duration-200"
            >
              {/* User Info Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full">
                    {getInitials()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {getDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || 'demo@dkbbank.com'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Account Settings</span>
                </button>
                
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Profile</span>
                </button>

                <hr className="border-gray-200 my-2" />
                
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span>Language: English</span>
                  <span className="ml-auto">🇺🇸</span>
                </button>

                <hr className="border-gray-200 my-2" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
