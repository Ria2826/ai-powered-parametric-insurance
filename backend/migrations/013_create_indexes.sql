CREATE INDEX idx_workers_zone
ON workers(primary_zone_id);

CREATE INDEX idx_disruptions_zone
ON disruptions(zone_id);

CREATE INDEX idx_claims_worker
ON claims(worker_id);

CREATE INDEX idx_claims_policy
ON claims(policy_id);

CREATE INDEX idx_payments_claim
ON payments(claim_id);

CREATE INDEX idx_policies_worker_status
ON policies(worker_id, status);

CREATE UNIQUE INDEX unique_active_policy_per_worker
ON policies(worker_id)
WHERE status = 'active';

CREATE INDEX idx_processed_events_time
ON processed_events(processed_at);

CREATE INDEX idx_policies_active_lookup
ON policies(worker_id, status, start_date, end_date);

CREATE INDEX idx_fraud_logs_claim
ON fraud_logs(claim_id);

CREATE INDEX idx_claims_status
ON claims(status);