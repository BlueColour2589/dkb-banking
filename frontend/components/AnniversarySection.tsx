"use client";
import Image from "next/image";

export default function AnniversarySection() {
  return (
    <section className="bg-gray-50 py-20 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left side - Real Cupcake Image */}
          <div className="lg:w-1/3 mb-10 lg:mb-0 flex justify-center">
            <div className="relative">
              {/* White circle background */}
              <div className="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                {/* Real cupcake image */}
                <div className="relative w-52 h-52">
                  <Image
                    src="/cupcake-sparkle.png"
                    alt="The 35th anniversary of DKB competition"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Anniversary badge */}
              <div className="absolute -top-4 -right-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl transform rotate-12 z-10">
                <div className="text-center">
                  <div className="text-xs font-medium opacity-90 text-cyan-200">Wir verlosen</div>
                  <div className="text-base font-bold">35 × 5.000 €</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="lg:w-2/3 lg:pl-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              35 years of DKB – Big anniversary competition
            </h2>
            
            <p className="text-lg text-gray-700 mb-8">
              We're celebrating our 35th birthday, and as a DKB current account customer, you'll receive these gifts for your loyalty:
            </p>
            
            <div className="space-y-4 text-gray-700 mb-8">
              <p className="flex items-start text-lg">
                <span className="text-blue-600 mr-4 mt-1 font-bold text-xl">•</span>
                We are giving away <strong className="text-blue-600">35 x 5,000 euros</strong>
              </p>
              
              <p className="flex items-start text-lg">
                <span className="text-blue-600 mr-4 mt-1 font-bold text-xl">•</span>
                Every payment of 5 euros or more with the Visa debit card or the Visa credit card is a ticket
              </p>
              
              <p className="flex items-start text-lg">
                <span className="text-blue-600 mr-4 mt-1 font-bold text-xl">•</span>
                Register by <strong className="text-blue-600">August 31, 2025</strong>
              </p>
            </div>
            
            <a 
              href="/en/register"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-lg text-lg inline-block"
            >
              To the competition →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}