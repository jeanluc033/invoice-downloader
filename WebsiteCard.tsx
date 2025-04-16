import React from 'react';

interface WebsiteCardProps {
  id: number;
  name: string;
  url: string;
  lastInvoiceDate?: string;
  onDownload: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function WebsiteCard({
  id,
  name,
  url,
  lastInvoiceDate,
  onDownload,
  onEdit,
  onDelete
}: WebsiteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500 truncate">{url}</p>
            {lastInvoiceDate && (
              <p className="text-xs text-gray-400 mt-1">
                Last invoice: {lastInvoiceDate}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDownload(id)}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
              title="Download latest invoice"
            >
              Download
            </button>
            <button
              onClick={() => onEdit(id)}
              className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
              title="Edit website"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              className="bg-red-100 text-red-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-red-200 transition-colors"
              title="Delete website"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
