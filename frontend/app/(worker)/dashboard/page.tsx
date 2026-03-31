"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { policyAPI, claimAPI } from "@/lib/api";
import { Policy, Claim } from "@/lib/types";
import StatCard from "@/components/StatCard";
import PolicyCard from "@/components/PolicyCard";
import ClaimRow from "@/components/ClaimRow";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
    try {
        const [policiesRes, claimsRes] = await Promise.all([
        policyAPI.getMyPolicies(),
        claimAPI.getMyClaims(),
        ]);
        setPolicies(policiesRes.data);
        setClaims(claimsRes.data);
    } catch (err: any) {
        if (err.response?.status === 404) {
        // Claims endpoint not ready – treat as empty
        setClaims([]);
        } else {
        setError("Failed to load dashboard data");
        console.error(err);
        }
    } finally {
        setLoading(false);
    }
    };
    fetchData();
  }, []);

  const activePolicy = policies.find((p) => p.status === "active");
  const totalIncomeProtected = activePolicy
    ? activePolicy.coverage_amount
    : 0;
  const totalPayouts = claims
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.payout_amount, 0);
  const claimsReceived = claims.length;

  const recentClaims = claims.slice(0, 5);

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.platform_name || user?.email?.split("@")[0]}
          </h1>
          <p className="text-slate-400">
            {user?.platform_name && `Rider for ${user.platform_name}`}
          </p>
        </div>
        <Link
          href="/policies"
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white font-medium transition"
        >
          Buy Coverage
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Policy"
          value={activePolicy ? "Yes" : "No"}
          icon={activePolicy ? "✅" : "❌"}
        />
        <StatCard
          title="Income Protected"
          value={`₹${totalIncomeProtected.toLocaleString()}`}
        />
        <StatCard title="Claims Received" value={claimsReceived} />
        <StatCard title="Total Payouts" value={`₹${totalPayouts.toLocaleString()}`} />
      </div>

      {/* Active Policy Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Active Policy</h2>
        {activePolicy ? (
          <PolicyCard policy={activePolicy} />
        ) : (
          <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
            <p className="text-slate-400 mb-4">
              You don't have an active policy. Get covered today!
            </p>
            <Link
              href="/policies"
              className="inline-block bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white font-medium transition"
            >
              Buy Now
            </Link>
          </div>
        )}
      </div>

      {/* Recent Claims */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Claims</h2>
        {recentClaims.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
            <p className="text-slate-400">
              No claims yet. You're covered if a disruption hits your zone.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentClaims.map((claim) => (
              <ClaimRow key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}