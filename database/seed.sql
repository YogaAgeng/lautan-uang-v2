-- database/seed.sql

CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    risk_score VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS catch_histories (
    id SERIAL PRIMARY KEY,
    community_id INT REFERENCES communities(id),
    month_year VARCHAR(7) NOT NULL, 
    total_weight_kg INT NOT NULL,
    revenue_idr BIGINT NOT NULL
);

-- Insert data fiktif nelayan
INSERT INTO communities (name, location) VALUES
('KUD Samudera Jaya', 'Maluku Utara'),
('Nelayan Pantai Popoh', 'Jawa Timur');

-- Insert histori tangkapan untuk dianalisis AI nantinya
INSERT INTO catch_histories (community_id, month_year, total_weight_kg, revenue_idr) VALUES
(1, '2025-01', 5000, 150000000),
(1, '2025-02', 6500, 195000000),
(2, '2025-01', 2000, 60000000),
(2, '2025-02', 1500, 45000000);