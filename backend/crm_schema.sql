-- SQL Schema for Tax Management Module
-- Target: PostgreSQL / Render Database

CREATE TABLE IF NOT EXISTS crm_tax (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    tax_value DECIMAL(5, 2) NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indices for high performance scanning and sorting
CREATE INDEX IF NOT EXISTS idx_tax_name ON crm_tax (name);
CREATE INDEX IF NOT EXISTS idx_tax_value ON crm_tax (tax_value);

-- Dummy Data for Initial Seeding
INSERT INTO crm_tax (name, tax_value, description, status) 
VALUES 
('GST 5%', 5.00, 'Standard Goods and Services Tax', true),
('VAT 10%', 10.00, 'Value Added Tax', true),
('Service Tax 18%', 18.00, 'High-end service tax', true),
('Surcharge 2%', 2.00, 'Additional surcharge on premium services', false),
('Cess 1%', 1.00, 'Environmental cess', true),
('Import Duty 15%', 15.00, 'Customs import duty', true),
('Excise 8%', 8.00, 'Manufacturing excise duty', true),
('Luxury Tax 28%', 28.00, 'Tax on luxury pest control equipment', false)
ON CONFLICT (name) DO NOTHING;
