// src/events/event.types.ts
export interface EventEnvelope<T> {
  event_id: string
  event_version: number
  event_type: string
  timestamp: string
  producer: string
  payload: T
}

export interface DisruptionDetectedPayload {
  disruption_id: string
  zone_id: string
  disruption_type: "rainfall" | "temperature" | "aqi" | "traffic"
  severity: "low" | "medium" | "high"
  detected_at: string
  expected_duration_minutes: number
}

export interface ClaimCreatedPayload {
  claim_id: string
  worker_id: string
  policy_id: string
  disruption_id: string
  payout_amount: number
}

export interface FraudScoreComputedPayload {
  claim_id: string
  worker_id: string
  fraud_score: number
  risk_level: "low" | "medium" | "high"
  evaluated_at: string
}

export interface ClaimApprovedPayload {
  claim_id: string
  worker_id: string
  payout_amount: number
  approved_at: string
}

export interface ClaimRejectedPayload {
  claim_id: string
  worker_id: string
  reason: string
  rejected_at: string
}

export interface PaymentProcessedPayload {
  payment_id: string
  claim_id: string
  worker_id: string
  payout_amount: number
  payment_status: "success" | "failed"
  processed_at: string
}