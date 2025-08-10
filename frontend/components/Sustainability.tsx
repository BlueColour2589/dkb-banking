"use client";
import Image from "next/image";

export default function Sustainability() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-cyan-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            This is how sustainable a bank can be
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="w-full h-64 rounded-lg shadow-xl overflow-hidden relative">
              <Image
                src="/wind-turbines.jpg"
                alt="Lindenberg wind farm of Windprojekte Jan Teut GmbH"
                fill
                className="object-cover"
              />
              {/* Overlay with sustainability branding */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-transparent to-green-600/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-5xl mb-4">🌱</div>
                  <div className="text-xl font-bold">Sustainable Banking</div>
                  <div className="text-sm opacity-90">Green Energy Investments</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 lg:pl-12">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <strong className="text-gray-800">Most sustainable bank among the top 20 in Germany</strong>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <strong className="text-gray-800">Largest financier of renewable energies in Germany</strong>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <strong className="text-gray-800">Top employer for more than 5,000 people</strong>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <strong className="text-gray-800">Social commitment through the DKB Foundation, founded in 2004</strong>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <strong className="text-gray-800">CO2-neutral office operations</strong>
                </div>
              </li>

              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <strong className="text-gray-800">Promoter of social sustainability in sport</strong>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                → More about sustainable commitment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}