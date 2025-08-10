"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ProductHighlights() {
  const t = useTranslations("ProductHighlights");

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* ETF Section */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Better to have ETFs in your portfolio than low interest rates
              </h2>
              <p className="text-gray-700 mb-6">
                Do as our more than 800,000 satisfied customers do and let your money work for you!
              </p>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  Open a portfolio by August 22nd and trade more favorably until the end of the year
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  Savings plans without execution fees (plus product costs and benefits)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  Buy securities through Baader Trading for only 1.90 euros
                </li>
              </ul>
              <a 
                href="/en/investing"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                To the depot →
              </a>
            </div>
            
            <div className="lg:w-1/2 flex justify-center">
              <div className="w-80 h-60 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-xl flex items-center justify-center relative overflow-hidden">
                <Image
                  src="/couple-confetti.jpg"
                  alt="Man and woman with smartphone in confetti rain"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="relative z-10 text-white text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <div className="text-xl font-bold">Investment Portfolio</div>
                  <div className="text-sm opacity-90">ETFs & Securities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Products Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Popular Products</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 - Find your suitable financing */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
              <div className="h-48 relative">
                <Image
                  src="/pool-friends.jpg"
                  alt="Two men and two women sitting by a pool"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-1">Find your suitable financing</h4>
                <h5 className="text-blue-600 font-semibold mb-2">Cheap loans</h5>
                <p className="text-gray-600 text-sm mb-4">
                  Whether you need a quick, instant loan or flexible home financing – we have the solution.
                </p>
                <a 
                  href="/en/loans"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  To all loans →
                </a>
              </div>
            </div>

            {/* Product 2 - LBS building savings */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
              <div className="h-48 relative">
                <Image
                  src="/moving-couples.jpg"
                  alt="A man and a woman moving"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-1">LBS building savings</h4>
                <h5 className="text-blue-600 font-semibold mb-2">50 Euro promotion</h5>
                <p className="text-gray-600 text-sm mb-4">
                  Now you can get a building savings plan with LBS and a voucher of your choice during the promotional period until September 30, 2025.
                </p>
                <a 
                  href="/en/accounts"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  To building savings →
                </a>
              </div>
            </div>

            {/* Product 3 - The account for two */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
              <div className="h-48 relative">
                <Image
                  src="/graffiti-wall.jpg"
                  alt="Two hands holding DKB debit card"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-1">The account for two</h4>
                <h5 className="text-blue-600 font-semibold mb-2">Free joint account</h5>
                <p className="text-gray-600 text-sm mb-4">
                  The perfect partner account, household account for the shared apartment including 2 Visa cards.
                </p>
                <a 
                  href="/en/accounts"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  To joint account →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Knowledge Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Financial knowledge</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Knowledge 1 - Card Types */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
              <div className="h-48 relative">
                <Image
                  src="/food-truck.jpg"
                  alt="Man with Visa debit card pays at a saleswoman's card reader"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-1">Find your perfect card</h4>
                <h5 className="text-blue-600 font-semibold mb-2">Card types</h5>
                <p className="text-gray-600 text-sm mb-4">
                  We'll show you the difference between debit, credit, and checking cards.
                </p>
                <a 
                  href="/en/accounts"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  To all articles →
                </a>
              </div>
            </div>

            {/* Knowledge 2 - Card payment abroad */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
              <div className="h-48 relative">
                <Image
                  src="/travel-couple.jpg"
                  alt="A woman and a child before leaving for vacation"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-1">Avoid fees</h4>
                <h5 className="text-blue-600 font-semibold mb-2">Card payment abroad</h5>
                <p className="text-gray-600 text-sm mb-4">
                  Learn what to consider when making card payments while traveling and how to avoid costs.
                </p>
                <a 
                  href="/en/accounts"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  To all articles →
                </a>
              </div>
            </div>

            {/* Knowledge 3 - One account, two cards */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
              <div className="h-48 relative">
                <Image
                  src="/roller-coaster.jpg"
                  alt="A cheerful-looking woman sits on a man's shoulders and spreads her arms"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-1">Better together</h4>
                <h5 className="text-blue-600 font-semibold mb-2">One account, two cards</h5>
                <p className="text-gray-600 text-sm mb-4">
                  Learn more about the account for two: ideal as a household account and for shared expenses.
                </p>
                <a 
                  href="/en/accounts"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  To all articles →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}