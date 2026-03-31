import React from "react";
import { Policy } from "@/lib/types";

interface PolicyCardProps {
  policy: Policy;
}

export default function PolicyCard({ policy }: PolicyCardProps) {
  const start = new Date(policy.start_date).toLocaleDateString();
  const end = new Date(policy.end_date).toLocaleDateString();

  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending_activation: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
    terminated: "bg-gray-100 text-gray-800",
    expired: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-white">
            ₹{policy.coverage_amount.toLocaleString()} Coverage
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            {start} – {end}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            statusColors[policy.status]
          }`}
        >
          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
        </span>
      </div>
    </div>
  );
}