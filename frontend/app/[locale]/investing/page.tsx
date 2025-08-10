import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function InvestingPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <Navbar locale={locale} />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Better to have ETFs in your portfolio than low interest rates
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Do as our more than 800,000 satisfied customers do and let your money work for you!
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Open depot now
            </button>
          </div>
        </section>

        {/* Investment Products */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Investment Products
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* ETF Depot */}
              <div className="bg-white rounded-lg shadow-lg border p-8">
                <div className="text-green-600 text-5xl mb-6">📈</div>
                <h3 className="text-2xl font-bold mb-4">ETF Depot</h3>
                <p className="text-gray-600 mb-6">
                  Invest in more than 1,500 ETFs with attractive conditions and transparent costs.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Open portfolio by August 22nd
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Trade more favorably until year-end
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Savings plans without execution fees
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Buy securities for only €1.90
                  </li>
                </ul>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Open ETF Depot
                </button>
              </div>

              {/* Savings Plans */}
              <div className="bg-white rounded-lg shadow-lg border p-8">
                <div className="text-blue-600 text-5xl mb-6">💰</div>
                <h3 className="text-2xl font-bold mb-4">Savings Plans</h3>
                <p className="text-gray-600 mb-6">
                  Build wealth systematically with our flexible savings plans starting from €25 monthly.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Starting from €25 per month
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Over 1,500 ETFs available
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    No execution fees
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Flexible adjustments anytime
                  </li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Start Savings Plan
                </button>
              </div>

              {/* Fixed-Term Deposits */}
              <div className="bg-white rounded-lg shadow-lg border p-8">
                <div className="text-purple-600 text-5xl mb-6">🏦</div>
                <h3 className="text-2xl font-bold mb-4">Fixed-Term Deposits</h3>
                <p className="text-gray-600 mb-6">
                  Secure investment with guaranteed returns and flexible terms from 1 to 10 years.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Guaranteed interest rates
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Terms from 1 to 10 years
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    From €500 minimum investment
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    German deposit protection
                  </li>
                </ul>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Compare Rates
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Calculator */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Investment Calculator
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Investment
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="2000"
                    defaultValue="100"
                    className="w-full mb-2"
                  />
                  <div className="text-center text-lg font-bold text-green-600">€100</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Period (years)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    defaultValue="20"
                    className="w-full mb-2"
                  />
                  <div className="text-center text-lg font-bold text-green-600">20 years</div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-green-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Total Invested</div>
                    <div className="text-2xl font-bold text-green-600">€24,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Expected Return (7% p.a.)</div>
                    <div className="text-2xl font-bold text-green-600">€52,397</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Value</div>
                    <div className="text-2xl font-bold text-green-600">€76,397</div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Start investing now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Notice */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">Important Risk Notice</h3>
              <p className="text-yellow-700 text-sm">
                Capital investments are subject to market fluctuations. The value of your investment may fall as well as rise. 
                Past performance is not a reliable indicator of future results. Please read the key investor information 
                and prospectus before making any investment decision.
              </p>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center py-8">
          <a 
            href={`/${locale}`}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Homepage
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}