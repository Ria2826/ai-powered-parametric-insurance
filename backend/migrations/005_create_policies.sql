CREATE TABLE policies (
id UUID PRIMARY KEY,
worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
coverage_amount NUMERIC NOT NULL,
weekly_premium NUMERIC NOT NULL,
status TEXT NOT NULL CHECK (
	status IN ('pending_activation','active','expired','cancelled','suspended','terminated')
),
start_date TIMESTAMP NOT NULL,
end_date TIMESTAMP NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);