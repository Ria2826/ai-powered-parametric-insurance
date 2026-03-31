CREATE TABLE manual_claim_requests (
    id UUID PRIMARY KEY,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE RESTRICT,
    reason TEXT,
    requested_at TIMESTAMP DEFAULT NOW(),
    status TEXT NOT NULL CHECK (
        status IN ('pending','approved','rejected')
    ),
    reviewed_at TIMESTAMP
);