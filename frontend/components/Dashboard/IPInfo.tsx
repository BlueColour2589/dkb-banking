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

  // Log session to backend
  useEffect(() => {
    if (ip && location) {
      fetch("/api/log-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip,
          location,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error("Failed to log session:", err));
    }
  }, [ip, location]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="text-xl font-bold text-blue-600 mb-4">Session Info</h3>
      <div className="text-blue-700 space-y-1 text-sm">
        <p>(Prodicare</p>
        <p>{ip || "199.9.0.1"}</p>
        <p>Staral) Lansets Indard</p>
        <p>24/84/8520.16-4978</p>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-blue-600">
            <span className="font-medium">Location:</span> {location || "Loading..."}
          </p>
          <p className="text-blue-600">
            <span className="font-medium">Last Login:</span> {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
