"use client";

export default function AppDownload({ imageUrl }: { imageUrl: string }) {
  return (
    <section className="container mx-auto py-12 px-4 grid md:grid-cols-2 gap-8 items-center">
      <img src={imageUrl} alt="DKB Banking App" className="w-full h-64 object-cover rounded-md shadow-md" />
      <div>
        <h2 className="text-3xl font-bold mb-4">Download Our Banking App</h2>
        <p className="text-gray-600 mb-6">Experience banking on the go with our secure and user-friendly mobile app. Access your accounts, transfer money, and manage your finances anytime, anywhere.</p>
        <div className="flex gap-4">
          <a
            href="#"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Google Play
          </a>
          <a
            href="#"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            App Store
          </a>
        </div>
      </div>
    </section>
  );
}