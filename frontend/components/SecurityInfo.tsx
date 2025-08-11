import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function SecurityInfo() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ShieldCheckIcon className="h-5 w-5" /> Security
      </h2>
      <p className="text-sm text-gray-600">Last Login: 10 Aug 2025, 14:23</p>
      <p className="text-sm text-gray-600">Location: Munich, Germany</p>
      <p className="text-sm text-gray-600">TAN Method: pushTAN</p>
    </div>
  );
}
