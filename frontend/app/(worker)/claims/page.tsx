"use client";

import { useEffect, useState } from "react";
import { claimAPI } from "@/lib/api";
import { Claim } from "@/lib/types";
import ClaimRow from "@/components/ClaimRow";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
    try {
        const { data } = await claimAPI.getMyClaims();
        setClaims(data);
    } catch (err: any) {
        if (err.response?.status === 404) {
        setClaims([]); // treat as empty
        } else {
        setError("Failed to load claims");
        console.error(err);
        }
    } finally {
        setLoading(false);
    }
    };
    fetchClaims();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/50 border border-red-700 rounded text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Claim History</h1>
      {claims.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
          <p className="text-slate-400 text-lg">
            No claims yet — you're covered if a disruption hits your zone.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <ClaimRow key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
}