CREATE TABLE payments (
    id UUID PRIMARY KEY,
    claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_status TEXT NOT NULL CHECK (
        payment_status IN ('initiated','success','failed')
    ),
    transaction_reference TEXT,
    processed_at TIMESTAMP
);

ALTER TABLE payments
ADD CONSTRAINT check_payment_status_time
CHECK (
    (payment_status = 'success' AND processed_at IS NOT NULL)
 OR (payment_status = 'failed' AND processed_at IS NOT NULL)
 OR (payment_status = 'initiated' AND processed_at IS NULL)
);