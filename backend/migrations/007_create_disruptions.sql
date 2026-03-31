CREATE TABLE disruptions (
    id UUID PRIMARY KEY,
    zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE RESTRICT,
    type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low','medium','high')),
    metric_value NUMERIC,
    threshold_value NUMERIC,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE disruptions
ADD CONSTRAINT unique_disruption_event
UNIQUE (zone_id, type, start_time);