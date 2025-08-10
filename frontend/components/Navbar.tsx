"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || "/";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Exact DKB Style */}
          <Link href={`/${locale}`} className="flex items-center">
            <div className="flex flex-col">
              <div className="text-blue-600 font-bold text-2xl tracking-wide">DKB</div>
              <div className="text-xs text-gray-500 -mt-1">Das kann Bank</div>
            </div>
          </Link>

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Private
              </button>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Business
              </button>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Sustainable
              </button>
            </div>
          </div>

          {/* Search and Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Intelligent search ..." 
                className="bg-transparent border-none outline-none text-sm w-32"
              />
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 text-sm">
              <Link 
                href={switchLocale("en")} 
                className={`px-2 py-1 rounded transition-colors ${
                  locale === "en" ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                English
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                href={switchLocale("de")} 
                className={`px-2 py-1 rounded transition-colors ${
                  locale === "de" ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                German
              </Link>
            </div>

            {/* Register and Login */}
            <Link 
              href={`/${locale}/register`}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Register
            </Link>
            <Link 
              href={`/${locale}/login`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="hidden lg:flex items-center space-x-8 py-3 border-t border-gray-100">
          <Link href={`/${locale}/accounts`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Accounts & Cards
          </Link>
          <Link href={`/${locale}/loans`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Loans
          </Link>
          <Link href={`/${locale}/investing`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Investing & Saving
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Financing & Real Estate
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            service
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Help
          </Link>
        </div>
      </div>
    </nav>
  );
}