import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function InvoiceList() {
  // This would be replaced with actual data fetching in a real implementation
  const invoices = [
    { id: 1, website: 'Electric Company', number: 'INV-2025-03-123', date: '2025-03-15', amount: '$89.99', filePath: '/invoices/electric-2025-03.pdf' },
    { id: 2, website: 'Internet Provider', number: 'INV-2025-04-456', date: '2025-04-01', amount: '$65.00', filePath: '/invoices/internet-2025-04.pdf' },
    { id: 3, website: 'Phone Service', number: 'INV-2025-03-789', date: '2025-03-28', amount: '$45.50', filePath: '/invoices/phone-2025-03.pdf' },
    { id: 4, website: 'Electric Company', number: 'INV-2025-02-122', date: '2025-02-15', amount: '$92.45', filePath: '/invoices/electric-2025-02.pdf' },
    { id: 5, website: 'Internet Provider', number: 'INV-2025-03-455', date: '2025-03-01', amount: '$65.00', filePath: '/invoices/internet-2025-03.pdf' },
  ];

  const handleViewInvoice = (filePath: string) => {
    console.log(`View invoice at ${filePath}`);
    // This would open the invoice file
  };

  const handleDownloadAll = () => {
    console.log('Download all invoices');
    // This would trigger download of all invoices
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <a href="/" className="text-blue-600 hover:text-blue-800 mr-2">
            &larr; Back to Dashboard
          </a>
          <h1 className="text-2xl font-bold text-gray-900">All Invoices</h1>
        </div>
        <Button onClick={handleDownloadAll} variant="primary">
          Download All
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.website}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewInvoice(invoice.filePath)}
                    >
                      View
                    </button>
                    <span className="mx-2">|</span>
                    <a 
                      href={invoice.filePath} 
                      download
                      className="text-green-600 hover:text-green-800"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
