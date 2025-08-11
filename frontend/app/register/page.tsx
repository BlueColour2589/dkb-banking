import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-blue-600 font-bold text-3xl mb-4">DKB</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Open your free DKB account
            </h1>
            <p className="text-gray-600">
              Join over 4.8 million satisfied customers and get your chance to win €5,000!
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+49 xxx xxxx xxxx"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street and house number"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="City name"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Type</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="radio" name="accountType" value="personal" className="mr-3" defaultChecked />
                    <span className="text-gray-700">Personal Account (Free checking account + Competition entry)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="accountType" value="joint" className="mr-3" />
                    <span className="text-gray-700">Joint Account (For couples and families)</span>
                  </label>
                </div>
              </div>

              {/* Additional Services */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Services</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-gray-700">DKB Visa Credit Card (€30 bonus)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <span className="text-gray-700">Investment Depot (ETF savings plans)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <span className="text-gray-700">Newsletter subscription</span>
                  </label>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="border-t pt-6">
                <label className="flex items-start">
                  <input type="checkbox" required className="mr-3 mt-1" />
                  <span className="text-sm text-gray-700">
                    I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
                    <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a> of DKB. *
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Open Account Now
              </button>
            </form>

            {/* Benefits Reminder */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">Your Benefits:</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>✓ Free checking account with no monthly fees</li>
                <li>✓ Free Visa debit card for worldwide payments</li>
                <li>✓ Automatic entry into €5,000 competition</li>
                <li>✓ Mobile banking app for convenient access</li>
                <li>✓ Optional: €30 bonus with credit card</li>
              </ul>
            </div>
          </div>

          {/* Already have account */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have a DKB account? 
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold ml-2">
                Login here
              </a>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <a 
              href="/"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}