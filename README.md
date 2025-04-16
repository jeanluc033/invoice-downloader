# Invoice Downloader Application - README

## Overview
The Invoice Downloader is a web application that automates the process of logging into websites, downloading invoices, and organizing them in one place. It securely stores login credentials, automatically navigates to invoice pages, and downloads the latest invoices with a single click.

## Features
- Add and manage multiple websites with login credentials
- Securely store encrypted login information
- Automatically log in and navigate to invoice pages
- Download invoices with a single click
- View and manage all downloaded invoices in one place
- Test system components to ensure everything is working correctly

## Technology Stack
- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Next.js API routes with Cloudflare Workers
- **Database**: D1 (SQLite-compatible database)
- **Automation**: Puppeteer for headless browser automation
- **Security**: AES-256-CBC encryption for credential storage

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/invoice-downloader.git
   cd invoice-downloader
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Initialize the database:
   ```
   wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage Guide

### Adding a Website
1. Click "Add Website" on the dashboard
2. Enter the website details:
   - Website name (for your reference)
   - Website URL (main website URL)
   - Login URL (page where you enter credentials)
   - Invoice page URL (page where invoices are listed)
3. Enter your login credentials:
   - Username/email
   - Password
4. (Optional) Enter advanced selectors if the automatic detection doesn't work:
   - Username field selector
   - Password field selector
   - Submit button selector
   - Invoice list selector
   - Download button selector
5. Click "Save Website"

### Downloading Invoices
1. Go to the dashboard
2. Find the website you want to download invoices from
3. Click the "Download" button
4. The system will:
   - Launch a headless browser
   - Navigate to the login page
   - Enter your credentials
   - Go to the invoice page
   - Download the latest invoice
   - Store invoice details in the database

### Viewing Invoices
1. Go to the "Invoices" page
2. View all downloaded invoices in a table
3. Click "View" to open an invoice
4. Click "Download" to download a copy

### Running System Tests
1. Go to the "Test" page
2. Click "Run Tests"
3. The system will test:
   - Database connection
   - Encryption utilities
   - Browser automation

## Security
- All credentials are encrypted using AES-256-CBC encryption
- Encryption keys should be stored in environment variables in production
- The application never stores plaintext credentials

## Deployment

### Local Deployment
Follow the installation instructions above to deploy locally.

### Production Deployment
To deploy to production:

1. Configure environment variables:
   - Create a `.env` file with:
     ```
     ENCRYPTION_KEY=your-secure-32-byte-key
     ```

2. Build the application:
   ```
   npm run build
   ```

3. Deploy to your hosting provider:
   ```
   npm run deploy
   ```

## Troubleshooting
- If automatic login fails, try adding specific selectors in the advanced settings
- Make sure Puppeteer can run in your environment (some hosting providers restrict headless browsers)
- Check the system tests to verify all components are working correctly

## License
This project is licensed under the MIT License - see the LICENSE file for details.
