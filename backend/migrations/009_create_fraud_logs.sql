CREATE TABLE fraud_logs (
    id UUID PRIMARY KEY,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE RESTRICT,
    claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    fraud_score NUMERIC,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low','medium','high')),
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);