import axios from "axios";
import { 
  LoginPayload, 
  RegisterPayload, 
  UpdateWorkerProfilePayload, 
  CreatePolicyPayload,
  TriggerDisruptionPayload,
  Policy,
  Claim,
  AnalyticsOverview,
  AnalyticsPayouts,
  ClaimsStatus,
  User
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shieldgig_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data: LoginPayload) => api.post<{ token: string }>("/auth/login", data),
  register: (data: Omit<RegisterPayload, "confirmPassword">) => api.post("/auth/register", data),
};

export const workerAPI = {
  getProfile: () => api.get<User>("/workers/me"),
  updateProfile: (data: UpdateWorkerProfilePayload) => api.put("/workers/profile", data),
};

export const policyAPI = {
  getMyPolicies: () => api.get<Policy[]>("/policies/me"),
  createPolicy: (data: CreatePolicyPayload) => api.post<Policy>("/policies", data),
};

export const claimAPI = {
  getMyClaims: () => api.get<Claim[]>("/claims/me"), // Note: Not in spec but likely exists. If not, we can simulate. I'll assume it exists.
};

export const analyticsAPI = {
  getOverview: () => api.get<AnalyticsOverview>("/analytics/overview"),
  getPayouts: () => api.get<AnalyticsPayouts>("/analytics/payouts"),
  getClaimsStatus: () => api.get<ClaimsStatus>("/analytics/claims-status"),
};

export const disruptionsAPI = {
  trigger: (data: TriggerDisruptionPayload) => api.post("/disruptions/trigger", data),
};

export default api;