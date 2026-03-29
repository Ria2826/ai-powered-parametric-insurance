CREATE TABLE claims (
    id UUID PRIMARY KEY,
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE RESTRICT,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE RESTRICT,
    disruption_id UUID NOT NULL REFERENCES disruptions(id) ON DELETE RESTRICT,
    payout_amount NUMERIC NOT NULL,
    claim_type TEXT NOT NULL CHECK (claim_type IN ('automatic','manual')),
    status TEXT NOT NULL CHECK (
        status IN ('pending','approved','rejected','paid')
    ),
    created_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    paid_at TIMESTAMP
);

ALTER TABLE claims
ADD CONSTRAINT check_claim_timestamps
CHECK (
    (status = 'approved' AND approved_at IS NOT NULL)
 OR (status = 'rejected' AND rejected_at IS NOT NULL)
 OR (status = 'paid' AND paid_at IS NOT NULL)
 OR (status = 'pending')
);

ALTER TABLE claims
ADD CONSTRAINT unique_worker_disruption_claim
UNIQUE (worker_id, disruption_id);