"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setGlobalError(null);
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (error) {
      setGlobalError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg p-8 shadow-lg border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-400">ShieldGig</h1>
          <p className="text-slate-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
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
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-teal-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}