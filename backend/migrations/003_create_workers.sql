CREATE TABLE workers (
id UUID PRIMARY KEY,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
platform_name TEXT NOT NULL,
primary_zone_id UUID NOT NULL REFERENCES zones(id),
avg_hourly_income NUMERIC NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE workers
ALTER COLUMN primary_zone_id DROP NOT NULL;