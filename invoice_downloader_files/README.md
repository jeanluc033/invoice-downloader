# Invoice Downloader Application

This application helps you automatically download invoices from your service providers. Add your websites, store your login credentials securely, and download invoices with a single click.

## Features

- Add and manage website configurations
- Securely store login credentials with encryption
- Automatically log in and download invoices
- Track invoice history and details
- User-friendly interface

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/invoice-downloader.git
cd invoice-downloader
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following content:
```
ENCRYPTION_KEY=your-32-character-encryption-key
```

4. Initialize the database:
```bash
npx wrangler d1 execute DB --local --file=migrations/0001_initial.sql
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to GitHub.

2. Connect your GitHub repository to Vercel.

3. Configure environment variables in Vercel:
   - ENCRYPTION_KEY: Your secure encryption key

4. Deploy the application.

## Technical Details

- Built with Next.js and React
- Uses Tailwind CSS for styling
- Implements Puppeteer for browser automation
- Secures credentials with AES-256-CBC encryption
- Uses Cloudflare D1 for database storage

## Serverless Considerations

This application is designed to work in a serverless environment (Vercel). The browser automation is configured to use chrome-aws-lambda for compatibility with serverless functions.

## License

MIT
