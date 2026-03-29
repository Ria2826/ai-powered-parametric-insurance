CREATE TABLE zones (
id UUID PRIMARY KEY,
city TEXT NOT NULL,
zone_name TEXT NOT NULL,
latitude NUMERIC,
longitude NUMERIC,
created_at TIMESTAMP DEFAULT NOW()
);