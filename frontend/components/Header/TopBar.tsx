'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Settings, LogOut, Globe, Shield, User } from 'lucide-react';

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
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        {/* Left - DKB Branding */}
        <div className="flex items-center space-x-4">
          <svg className="h-8" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="h-6 w-px bg-gray-200"></div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Digital Banking</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        {/* Right - Actions & User */}
        <div className="flex items-center space-x-4">
          {/* Security Status */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <Shield size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">Secure</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </button>
          
          {/* Settings */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="bg-blue-600 text-white text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full">
                {getInitials()}
              </div>
              
              {/* User Info - Hidden on mobile */}
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {getDisplayName()}
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
                className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden z-20 border border-gray-200"
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 text-white text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full">
                      {getInitials()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {getDisplayName()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Profile</span>
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>Settings</span>
                  </button>

                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>Language</span>
                  </button>

                  <hr className="border-gray-100 my-2" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
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
    </div>
  );
}
