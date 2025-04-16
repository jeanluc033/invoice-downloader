import './globals.css';

export const metadata = {
  title: 'Invoice Downloader',
  description: 'Automatically download invoices from your service providers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
