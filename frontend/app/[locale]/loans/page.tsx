import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoansPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <Navbar locale={locale} />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Find your suitable financing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Whether you need a quick, instant loan or flexible home financing – we have the solution.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Calculate your loan now
            </button>
          </div>
        </section>

        {/* Loan Types */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Our loan products
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Personal Loan */}
              <div className="bg-white rounded-lg shadow-lg border p-8">
                <div className="text-blue-600 text-5xl mb-6">💰</div>
                <h3 className="text-2xl font-bold mb-4">Personal Loan</h3>
                <p className="text-gray-600 mb-6">
                  Quick and flexible financing for your personal projects. From €1,000 to €80,000.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Interest rates from 2.98% p.a.
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Terms from 12 to 84 months
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Quick online application
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    No early repayment fees
                  </li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Apply now
                </button>
              </div>

              {/* Home Financing */}
              <div className="bg-white rounded-lg shadow-lg border p-8">
                <div className="text-blue-600 text-5xl mb-6">🏠</div>
                <h3 className="text-2xl font-bold mb-4">Home Financing</h3>
                <p className="text-gray-600 mb-6">
                  Make your dream of homeownership a reality with our competitive mortgage rates.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Interest rates from 3.15% p.a.
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Up to 100% financing
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Personal consultation
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Flexible repayment options
                  </li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Get consultation
                </button>
              </div>

              {/* Car Financing */}
              <div className="bg-white rounded-lg shadow-lg border p-8">
                <div className="text-blue-600 text-5xl mb-6">🚗</div>
                <h3 className="text-2xl font-bold mb-4">Auto Loan</h3>
                <p className="text-gray-600 mb-6">
                  Finance your new or used car with attractive conditions and fast processing.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Interest rates from 3.49% p.a.
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Up to €100,000 financing
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    Quick approval process
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    New and used cars
                  </li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Calculate loan
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Calculator */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Loan Calculator
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="80000"
                    defaultValue="10000"
                    className="w-full mb-2"
                  />
                  <div className="text-center text-lg font-bold text-blue-600">€10,000</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term (months)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="84"
                    defaultValue="36"
                    className="w-full mb-2"
                  />
                  <div className="text-center text-lg font-bold text-blue-600">36 months</div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Monthly Payment</div>
                    <div className="text-2xl font-bold text-blue-600">€312.45</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Interest Rate</div>
                    <div className="text-2xl font-bold text-blue-600">2.98% p.a.</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-2xl font-bold text-blue-600">€11,248.20</div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Apply for this loan
                </button>
              </div>
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