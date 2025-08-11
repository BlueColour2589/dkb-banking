"use client";
import Image from "next/image";

export default function Promotions() {
  return (
    <>
      {/* Main Blue Promotion Section */}
      <section className="bg-blue-600 text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-10 lg:mb-0">
              <div className="text-sm uppercase tracking-wide mb-4 opacity-90 text-cyan-200">
                We are giving away up to 5,000 € all
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Open a free checking account <span className="text-cyan-300">and secure your chance to win €5,000!</span>
              </h2>
              <ul className="space-y-3 mb-8 opacity-95 text-lg">
                <li className="flex items-start">
                  <span className="text-cyan-300 mr-3 mt-1">•</span>
                  Open a free account and register for the competition via banking
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-300 mr-3 mt-1">•</span>
                  Pay with Visa card until 31.08.2025 – every payment of 5 euros or more is a ticket
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-300 mr-3 mt-1">•</span>
                  More payments, more tickets, more chances to win €5,000
                </li>
              </ul>
              <a 
                href="/register"
                className="inline-block bg-cyan-400 hover:bg-cyan-500 text-blue-900 px-8 py-4 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                To the current account
              </a>
            </div>
            
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎁</div>
                    <div className="text-sm">Up to €5,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Card Promotion */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Credit card promotion: €30 for your new credit card
              </h3>
              <div className="space-y-3 text-gray-700 mb-6">
                <p>
                  Apply for a credit card for your next trip by August 11, 2025, and receive a credit of 30 euros—so we'll cover the first year's card price!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    Pay for free anywhere Visa is accepted worldwide – whether in New York, Bali or Rome.
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    Enjoy complete financial flexibility with a personalized credit limit, an emergency card in case of loss, and the perfect holiday reading thanks to a digital kiosk.
                  </li>
                </ul>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                To the credit card →
              </button>
            </div>
            
            <div className="lg:w-1/3 flex justify-center mt-8 lg:mt-0">
              <div className="relative">
                <div className="w-48 h-32 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-xl flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-xl font-bold">DKB</div>
                    <div className="text-sm">VISA Card</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold">
                  30€
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}