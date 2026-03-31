"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { policyAPI } from "@/lib/api";
import { Policy, CreatePolicyPayload } from "@/lib/types";
import PolicyCard from "@/components/PolicyCard";

const createPolicySchema = z.object({
  coverage_amount: z.number().min(300, "Minimum ₹300").max(1000, "Maximum ₹1000"),
  duration_weeks: z.number().min(1, "Minimum 1 week").max(4, "Maximum 4 weeks"),
});

type CreatePolicyForm = z.infer<typeof createPolicySchema>;

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePolicyForm>({
    resolver: zodResolver(createPolicySchema),
    defaultValues: {
      coverage_amount: 500,
      duration_weeks: 1,
    },
  });

  const coverageAmount = watch("coverage_amount");
  const durationWeeks = watch("duration_weeks");
  // TODO: replace with GET /ml/premium call
  const premium = coverageAmount * 0.03 * durationWeeks;

  const fetchPolicies = async () => {
    try {
      const { data } = await policyAPI.getMyPolicies();
      setPolicies(data);
    } catch (err) {
      setError("Failed to load policies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const onCreatePolicy = async (data: CreatePolicyForm) => {
    setCreateSuccess(null);
    try {
      await policyAPI.createPolicy(data);
      setCreateSuccess("Policy purchased successfully!");
      reset();
      fetchPolicies(); // refresh list
    } catch (err) {
      setError("Failed to purchase policy");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Buy New Policy Section */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Buy New Coverage</h2>
        <form onSubmit={handleSubmit(onCreatePolicy)} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Coverage Amount (₹)
            </label>
            <input
              type="range"
              min="300"
              max="1000"
              step="50"
              {...register("coverage_amount", { valueAsNumber: true })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-400">
              <span>₹300</span>
              <span>₹{coverageAmount}</span>
              <span>₹1000</span>
            </div>
            {errors.coverage_amount && (
              <p className="text-red-400 text-xs mt-1">{errors.coverage_amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Duration (weeks)
            </label>
            <select
              {...register("duration_weeks", { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value={1}>1 week</option>
              <option value={2}>2 weeks</option>
              <option value={3}>3 weeks</option>
              <option value={4}>4 weeks</option>
            </select>
            {errors.duration_weeks && (
              <p className="text-red-400 text-xs mt-1">{errors.duration_weeks.message}</p>
            )}
          </div>

          <div className="bg-slate-700 p-3 rounded-md">
            <p className="text-slate-300 text-sm">Premium (estimated):</p>
            <p className="text-2xl font-bold text-teal-400">₹{premium.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">
              * AI-calculated dynamic premium. Final price may vary.
            </p>
          </div>

          {createSuccess && (
            <div className="p-2 bg-green-900/50 border border-green-700 rounded text-green-200 text-sm text-center">
              {createSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-md text-white font-medium transition"
          >
            {isSubmitting ? "Purchasing..." : "Buy Policy"}
          </button>
        </form>
      </div>

      {/* Existing Policies */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Policies</h2>
        {policies.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
            <p className="text-slate-400">You haven't purchased any policies yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}