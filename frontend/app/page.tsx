"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token && user) {
      router.push(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    }   
    else {
      router.push("/login");
    }
  }, [token, user, isLoading, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-teal-400">Loading...</div>
    </div>
  );
}