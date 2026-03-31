"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { workerAPI } from "@/lib/api";
import { UpdateWorkerProfilePayload } from "@/lib/types";

const onboardingSchema = z.object({
  platform_name: z.string().min(1, "Platform is required"),
  primary_zone_id: z.string().min(1, "Zone ID is required"),
  avg_hourly_income: z.number().positive("Must be a positive number"),
});

const zones = [
  { id: "123e4567-e89b-12d3-a456-426614174000", name: "Indiranagar, Bengaluru" },
  { id: "123e4567-e89b-12d3-a456-426614174001", name: "Koramangala, Bengaluru" },
  { id: "123e4567-e89b-12d3-a456-426614174002", name: "Bandra, Mumbai" },
];

type OnboardingForm = z.infer<typeof onboardingSchema>;

const platforms = ["Swiggy", "Zomato", "Zepto", "Blinkit", "Amazon"];

export default function OnboardingPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (data: OnboardingForm) => {
    setGlobalError(null);
    try {
      await workerAPI.updateProfile(data);
      // After updating profile, we should refetch user, but the backend likely returns updated profile.
      // We'll simply redirect to dashboard and let AuthContext fetch again on next page.
      router.push("/dashboard");
    } catch (error: any) {
      setGlobalError(error.response?.data?.message || "Failed to save profile");
    }
  };

  // If user already has profile, redirect to dashboard
  if (user?.platform_name) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-400">Welcome to ShieldGig</h1>
          <p className="text-slate-400 mt-2">Tell us a bit about yourself</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Delivery Platform
            </label>
            <select
              {...register("platform_name")}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value="">Select platform</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.platform_name && (
              <p className="text-red-400 text-xs mt-1">{errors.platform_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
                Primary Delivery Zone
            </label>
            <select
                {...register("primary_zone_id")}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
                <option value="">Select a zone</option>
                {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                    {zone.name}
                </option>
                ))}
            </select>
            {errors.primary_zone_id && (
                <p className="text-red-400 text-xs mt-1">{errors.primary_zone_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Average Hourly Income (₹)
            </label>
            <input
              type="number"
              step="any"
              {...register("avg_hourly_income", { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              placeholder="e.g., 150"
            />
            {errors.avg_hourly_income && (
              <p className="text-red-400 text-xs mt-1">{errors.avg_hourly_income.message}</p>
            )}
          </div>

          {globalError && (
            <div className="p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm text-center">
              {globalError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-md text-white font-medium transition"
          >
            {isSubmitting ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}