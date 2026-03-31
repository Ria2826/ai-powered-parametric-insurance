import React from "react";
import { Claim } from "@/lib/types";

const disruptionIcons = {
  rainfall: "🌧️",
  temperature: "🌡️",
  aqi: "💨",
  traffic: "🚦",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
};

interface ClaimRowProps {
  claim: Claim;
}

export default function ClaimRow({ claim }: ClaimRowProps) {
  const date = new Date(claim.date).toLocaleDateString();
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{disruptionIcons[claim.disruption_type]}</span>
        <div>
          <p className="font-medium text-white">
            {claim.disruption_type.charAt(0).toUpperCase() + claim.disruption_type.slice(1)}
          </p>
          <p className="text-sm text-slate-400">{claim.zone_name || claim.zone_id}</p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-400">Date</p>
        <p className="font-medium text-white">{date}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-400">Hours Lost</p>
        <p className="font-medium text-white">{claim.hours_lost}h</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-400">Payout</p>
        <p className="font-medium text-teal-400">₹{claim.payout_amount}</p>
      </div>
      <div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            statusColors[claim.status]
          }`}
        >
          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
        </span>
      </div>
    </div>
  );
}