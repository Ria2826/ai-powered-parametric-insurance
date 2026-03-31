export interface User {
  id: string;
  email: string;
  role: "worker" | "admin";
  // Worker specific fields
  platform_name?: string;
  primary_zone_id?: string;
  avg_hourly_income?: number;
  name?: string; // we can use email as name until profile is filled
}

export interface Policy {
  id: string;
  coverage_amount: number;
  weekly_premium: number;      // matches DB
  start_date: string;
  end_date: string;
  status: "active" | "pending_activation" | "suspended" | "terminated" | "expired";
  worker_id: string;
}

export interface Claim {
  id: string;
  disruption_type: "rainfall" | "temperature" | "aqi" | "traffic";
  zone_id: string;
  zone_name?: string; // for display
  date: string;
  hours_lost: number;
  payout_amount: number;
  status: "pending" | "approved" | "paid";
  policy_id: string;
}

export interface AnalyticsOverview {
  active_policies: number;
  total_workers: number;
  total_payouts: number;
  avg_hourly_income: number;
}

export interface AnalyticsPayouts {
  total_paid: number;
  pending_payouts: number;
  average_payout: number;
  payouts_by_zone: Record<string, number>;
}

export interface ClaimsStatus {
  pending: number;
  approved: number;
  paid: number;
}

export interface TriggerDisruptionPayload {
  zone_id: string;
  type: Claim["disruption_type"];
  metric_value: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  confirmPassword: string;
}

export interface UpdateWorkerProfilePayload {
  platform_name: string;
  primary_zone_id: string;
  avg_hourly_income: number;
}

export interface CreatePolicyPayload {
  coverage_amount: number;
  duration_weeks: number;
}