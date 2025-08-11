"use client";

import { ReactNode, useEffect, useState } from "react";
import { apiClient } from "../../../../lib/api";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon,
  BanknotesIcon,
  ChartBarIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

// Define User type locally since it's not exported from API
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // For now, just set a mock user since we don't have authentication implemented
    setUser({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com"
    });
  }, [router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: HomeIcon },
    { name: "Transactions", href: "/dashboard/transactions", icon: BanknotesIcon },
    { name: "Loans", href: "/dashboard/loans", icon: CreditCardIcon },
    { name: "Investments", href: "/dashboard/investments", icon: ChartBarIcon },
  ];

  const handleLogout = () => {
    // Simple logout - redirect to login
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col transform transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 text-xl font-bold border-b border-gray-200 dark:border-gray-700">
          Bank Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 p-2 rounded transition-colors",
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </a>
            );
          })}
        </nav>
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:underline w-full"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              )}
            </button>
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user.firstName[0]}
                </div>
                <span className="hidden sm:inline text-gray-700 dark:text-gray-200">
                  {user.firstName}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
