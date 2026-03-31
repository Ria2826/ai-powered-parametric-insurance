"use client";

import { useEffect, useState } from "react";
import { analyticsAPI } from "@/lib/api";
import { AnalyticsOverview, AnalyticsPayouts, ClaimsStatus } from "@/lib/types";
import StatCard from "@/components/StatCard";
import DisruptionForm from "@/components/DisruptionForm";

type Tab = "overview" | "payouts" | "claims" | "trigger";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [payouts, setPayouts] = useState<AnalyticsPayouts | null>(null);
  const [claimsStatus, setClaimsStatus] = useState<ClaimsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overviewRes, payoutsRes, claimsRes] = await Promise.all([
          analyticsAPI.getOverview(),
          analyticsAPI.getPayouts(),
          analyticsAPI.getClaimsStatus(),
        ]);
        setOverview(overviewRes.data);
        setPayouts(payoutsRes.data);
        setClaimsStatus(claimsRes.data);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {(["overview", "payouts", "claims", "trigger"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-teal-500 text-teal-400"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && overview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Active Policies" value={overview.active_policies} />
            <StatCard title="Total Workers" value={overview.total_workers} />
            <StatCard title="Total Payouts" value={`₹${overview.total_payouts.toLocaleString()}`} />
            <StatCard title="Avg Hourly Income" value={`₹${overview.avg_hourly_income}`} />
          </div>
        )}

        {activeTab === "payouts" && payouts && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Paid" value={`₹${payouts.total_paid.toLocaleString()}`} />
            <StatCard title="Pending Payouts" value={`₹${payouts.pending_payouts.toLocaleString()}`} />
            <StatCard title="Average Payout" value={`₹${payouts.average_payout.toLocaleString()}`} />
          </div>
        )}

        {activeTab === "claims" && claimsStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Pending Claims" value={claimsStatus.pending} />
            <StatCard title="Approved Claims" value={claimsStatus.approved} />
            <StatCard title="Paid Claims" value={claimsStatus.paid} />
          </div>
        )}

        {activeTab === "trigger" && (
          <div className="max-w-lg">
            <DisruptionForm />
          </div>
        )}
      </div>
    </div>
  );
}