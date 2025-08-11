"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardActions() {
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/dashboard/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dashboardId: "your-id" }),
      });
      if (!response.ok) throw new Error("Failed to delete dashboard");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <button
        onClick={() => setShowShareModal(true)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
      >
        Share Dashboard
      </button>
      <button
        onClick={() => setShowConfirmDelete(true)}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
      >
        Delete Dashboard
      </button>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this dashboard?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Share Dashboard</h3>
            <input
              type="text"
              value="https://yourbank.com/dashboard/your-id"
              readOnly
              className="w-full px-3 py-2 border rounded mb-4 text-sm"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
