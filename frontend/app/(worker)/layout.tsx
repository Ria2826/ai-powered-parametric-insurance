"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
    if (!isLoading && token && user?.role !== "worker") {
      router.push("/admin/dashboard");
    }
  }, [token, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (!token || user?.role !== "worker") return null;

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-teal-400 font-bold text-xl">
                ShieldGig
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/policies"
                  className="text-slate-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Policies
                </Link>
                <Link
                  href="/claims"
                  className="text-slate-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Claims
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-slate-300 mr-4">
                {user?.platform_name || user?.email}
              </span>
              <button
                onClick={logout}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}