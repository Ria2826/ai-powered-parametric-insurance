"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { disruptionsAPI } from "@/lib/api";
import { TriggerDisruptionPayload } from "@/lib/types";

const zones = [
  { id: "zone_bengaluru_1", name: "Indiranagar, Bengaluru" },
  { id: "zone_bengaluru_2", name: "Koramangala, Bengaluru" },
  { id: "zone_mumbai_1", name: "Bandra, Mumbai" },
];

const disruptionSchema = z.object({
  zone_id: z.string().min(1, "Zone is required"),
  type: z.enum(["rainfall", "temperature", "aqi", "traffic"]),
  metric_value: z.number().positive("Must be a positive number"),
});

type FormData = z.infer<typeof disruptionSchema>;

export default function DisruptionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(disruptionSchema),
    defaultValues: {
      zone_id: zones[0].id,
      type: "rainfall",
      metric_value: 50,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await disruptionsAPI.trigger(data);
      setSuccess(
        "Disruption event triggered! Claims are being processed automatically."
      );
      reset();
    } catch (err) {
      setError("Failed to trigger disruption. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-medium text-white mb-4">Trigger Disruption Event</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Zone
          </label>
          <select
            {...register("zone_id")}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
          {errors.zone_id && (
            <p className="text-red-400 text-xs mt-1">{errors.zone_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Disruption Type
          </label>
          <select
            {...register("type")}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          >
            <option value="rainfall">Rainfall</option>
            <option value="temperature">Temperature</option>
            <option value="aqi">AQI (Air Quality)</option>
            <option value="traffic">Traffic</option>
          </select>
          {errors.type && (
            <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Metric Value
          </label>
          <input
            type="number"
            step="any"
            {...register("metric_value", { valueAsNumber: true })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            placeholder="e.g., 85 for rainfall (mm)"
          />
          <p className="text-xs text-slate-400 mt-1">
            Rainfall: mm | Temperature: °C | AQI: index | Traffic: arbitrary scale
          </p>
          {errors.metric_value && (
            <p className="text-red-400 text-xs mt-1">{errors.metric_value.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-md text-white font-medium transition"
        >
          {isLoading ? "Triggering..." : "Trigger Disruption"}
        </button>

        {success && (
          <div className="mt-3 p-3 bg-green-900/50 border border-green-700 rounded-md text-green-200 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-3 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}