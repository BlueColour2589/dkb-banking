"use client";

export default function FeedbackSection() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left side - Text content */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="flex items-center mb-6">
              <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <span className="text-xl">50</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">50 euros for your</h3>
                <p className="text-blue-600 font-semibold">recommendation</p>
              </div>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Secure your bonus
            </button>
          </div>
          
          {/* Right side - Feedback box */}
          <div className="lg:w-1/2 lg:pl-12">
            <div className="bg-gray-50 rounded-lg p-6 border">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Your feedback is important to us!</h4>
              <p className="text-gray-600 mb-4">Your feedback is important to us!</p>
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                → To the homepage survey
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}