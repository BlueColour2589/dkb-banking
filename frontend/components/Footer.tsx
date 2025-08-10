"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      {/* App Download Section */}
      <section className="bg-blue-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="flex items-center mb-6">
                <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                  <div className="text-2xl">📱</div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">50 euros for your</h3>
                  <p className="text-cyan-200">recommendation</p>
                </div>
              </div>
              
              <p className="text-lg mb-6 opacity-90">
                Whether you want to quickly check your account balance or make a transfer: With our DKB app, you can handle your banking transactions securely, easily, and conveniently from anywhere.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                {/* App Store Button */}
                <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center space-x-3 transition-colors">
                  <div className="text-2xl">🍎</div>
                  <div className="text-left">
                    <div className="text-xs opacity-75">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </button>
                
                {/* Google Play Button - using real image */}
                <div className="relative h-12 w-40">
                  <Image
                    src="/google-play.png"
                    alt="Get it on Google Play"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <button className="text-blue-600 hover:text-blue-700 font-semibold bg-white px-4 py-2 rounded-lg transition-colors">
                Discover the DKB app →
              </button>
            </div>
            
            {/* Phone Mockup - Real DKB App Screenshot */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-80 h-96">
                <Image
                  src="/phone-app.png"
                  alt="Illustration of a smartphone with current account transactions in the DKB app"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-blue-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Bank */}
            <div>
              <h4 className="font-bold text-lg mb-4">Pursue</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:text-cyan-300 transition-colors">press</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">career</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Investor Relations</a></li>
              </ul>
            </div>

            {/* Service */}
            <div>
              <h4 className="font-bold text-lg mb-4">service</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Help & Contact</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Forms</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">TAN procedure</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Block card?</a></li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-bold text-lg mb-4">Products</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Current account</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Visa credit card</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Personal loan</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">depot</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Constructio</a></li>
              </ul>
            </div>

            {/* More */}
            <div>
              <h4 className="font-bold text-lg mb-4">More</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Sports Sponsoring</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">DKB Foundation</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Financial Knowledge</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Business Banking</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="bg-blue-700 text-white px-3 py-1 rounded font-bold text-lg">
                DKB
              </div>
              <p className="text-sm opacity-75">
                © 2025 Deutsche Kreditbank AG
              </p>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <a href="#" className="hover:text-cyan-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-300 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-cyan-300 transition-colors">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}