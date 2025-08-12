import { useEffect, useState } from "react";

export default function IPInfo() {
  const [ip, setIp] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setIp(data.ip);
        setLocation(`${data.city}, ${data.region}, ${data.country_name}`);
      } catch (error) {
        console.error("Failed to fetch IP info:", error);
      }
    }

    fetchIP();
  }, []);

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
      <h3 className="mb-2 font-semibold text-gray-900">Session Info</h3>
      <div>
        <span className="font-medium">IP Address:</span>{" "}
        {ip || "Loading..."}
      </div>
      <div>
        <span className="font-medium">Location:</span>{" "}
        {location || "Loading..."}
      </div>
      <div>
        <span className="font-medium">Last Login:</span>{" "}
        {new Date().toLocaleString()}
      </div>
    </div>
  );
}
