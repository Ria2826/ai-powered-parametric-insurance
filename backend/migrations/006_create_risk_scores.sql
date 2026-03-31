CREATE TABLE risk_scores (
id UUID PRIMARY KEY,
worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
zone_risk_score NUMERIC,
worker_risk_score NUMERIC,
premium_score NUMERIC,
calculated_at TIMESTAMP NOT NULL
);