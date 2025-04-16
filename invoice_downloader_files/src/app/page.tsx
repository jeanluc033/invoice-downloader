import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Invoice Downloader</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Invoice Downloader</h2>
              <p className="text-gray-600 mb-6">
                This application helps you automatically download invoices from your service providers.
                Add your websites, store your login credentials securely, and download invoices with a single click.
              </p>
              
              <div className="flex space-x-4">
                <Link href="/dashboard" passHref>
                  <Button variant="primary">Go to Dashboard</Button>
                </Link>
                <Link href="/add-website" passHref>
                  <Button variant="secondary">Add New Website</Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Add your service provider websites</h3>
                    <p className="text-gray-600">Enter website details, login URLs, and your credentials.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Click the download button</h3>
                    <p className="text-gray-600">The application automatically logs in and finds invoices.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Manage your invoice collection</h3>
                    <p className="text-gray-600">All your invoices are stored in one place for easy access.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            Invoice Downloader Application &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
