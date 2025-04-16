-- Initialize database tables for Invoice Downloader Application

-- Drop tables if they exist to ensure clean initialization
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS websites;

-- Websites table to store website configurations
CREATE TABLE websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    login_url TEXT,
    invoice_url TEXT,
    login_selector TEXT,
    password_selector TEXT,
    submit_selector TEXT,
    invoice_selector TEXT,
    download_selector TEXT,
    username_encrypted TEXT,
    password_encrypted TEXT,
    encryption_iv TEXT,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table to track downloaded invoices
CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    website_id INTEGER NOT NULL,
    invoice_number TEXT,
    invoice_date DATE,
    amount REAL,
    currency TEXT,
    file_path TEXT,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_website_name ON websites(name);
CREATE INDEX idx_invoice_website ON invoices(website_id);
CREATE INDEX idx_invoice_date ON invoices(invoice_date);
