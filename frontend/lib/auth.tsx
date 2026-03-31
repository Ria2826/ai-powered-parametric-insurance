"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI, workerAPI } from "./api";
import { User } from "./types";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("shieldgig_token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (jwt: string) => {
    try {
        const decoded: any = jwtDecode(jwt);
        const role = decoded.role || "worker";
        if (role === "worker") {
            const { data } = await workerAPI.getProfile();
            setUser({ ...data, role: "worker" });
        } else {
            // Admin – no worker profile needed. Use userId as id, email optional.
            setUser({ id: decoded.userId, email: "", role: "admin" });
        }
    } catch (error) {
        logout();
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      const jwt = data.token;
      localStorage.setItem("shieldgig_token", jwt);
      setToken(jwt);
      await fetchUser(jwt);
      // Redirect after login in the component
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("shieldgig_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}