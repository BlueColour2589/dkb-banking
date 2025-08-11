"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-teal-100 to-cyan-200 pt-20 pb-40 px-6 overflow-hidden">
      {/* Curved bottom with exact DKB curve */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-32">
          <path d="M0,60 C200,100 400,20 600,40 C800,60 1000,100 1200,60 L1200,120 L0,120 Z" fill="white"/>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[600px]">
          {/* Left content - Exact DKB positioning */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 lg:pr-16">     
            <div className="text-sm text-blue-600 font-semibold mb-3 uppercase tracking-wide">
              The 35th anniversary of DKB competition
            </div>
            <div className="text-lg text-gray-700 mb-4 font-medium">
              We are giving away 35 x 5,000 €
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Open a free checking account and secure your chance to win €5,000!       
            </h1>
            <ul className="text-gray-700 mb-8 space-y-3 text-left text-lg">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                Open a free account and register for the competition via banking
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                Pay with Visa card until 31.08.2025 – every payment of 5 euros or more is a ticket
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                More payments, more tickets, more chances to win €5,000
              </li>
            </ul>
            <a
              href="/register"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl" 
            >
              To the current account
            </a>
          </div>

          {/* Right illustration - Real DKB cupcake */}
          <div className="lg:w-1/2 flex justify-center relative">
            <div className="relative">
              {/* White circle background */}
              <div className="w-80 h-80 bg-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                {/* Real cupcake image */}
                <div className="relative w-64 h-64">
                  <Image
                    src="/cupcake-sparkle.png"
                    alt="DKB Anniversary Cupcake"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Promotional badge - exact DKB style */}
              <div className="absolute -top-6 -right-8 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl transform rotate-12 z-10">
                <div className="text-center">
                  <div className="text-xs font-medium opacity-90 text-cyan-200">Wir verlosen</div>
                  <div className="text-lg font-bold">35 × 5.000 €</div>
                </div>
              </div>

              {/* Scattered confetti effect around the circle */}
              <div className="absolute top-12 right-16 w-3 h-3 bg-yellow-400 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute top-20 left-8 w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-16 right-12 w-2 h-2 bg-blue-400 rounded-full opacity-80"></div>
              <div className="absolute bottom-24 left-16 w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
              <div className="absolute top-32 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-70"></div>
              <div className="absolute bottom-32 right-24 w-2 h-2 bg-red-400 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}