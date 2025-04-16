import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@cloudflare/next-on-pages';
import { WebsiteScraper } from '../../../../../lib/WebsiteScraper';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { DB } = getCloudflareContext().env;
    const websiteId = params.id;
    
    // Get website data from database
    const websiteResult = await DB.prepare(`
      SELECT * FROM websites WHERE id = ?
    `).bind(websiteId).first();
    
    if (!websiteResult) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }
    
    // Create download directory if it doesn't exist
    const downloadDir = path.join(process.cwd(), 'downloads', websiteId);
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    
    // Initialize scraper
    const scraper = new WebsiteScraper(websiteResult, downloadDir);
    let result = {
      success: false,
      message: '',
      invoiceDetails: null,
      filePath: null
    };
    
    try {
      // Initialize browser
      const initialized = await scraper.initialize();
      if (!initialized) {
        throw new Error('Failed to initialize browser');
      }
      
      // Login to website
      const loggedIn = await scraper.login();
      if (!loggedIn) {
        throw new Error('Failed to login to website');
      }
      
      // Download latest invoice
      const downloadResult = await scraper.downloadLatestInvoice();
      if (!downloadResult.success) {
        throw new Error(downloadResult.error || 'Failed to download invoice');
      }
      
      // Update last_login timestamp in database
      await DB.prepare(`
        UPDATE websites SET last_login = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(websiteId).run();
      
      // Save invoice details to database if available
      if (downloadResult.invoiceDetails) {
        const { invoiceNumber, invoiceDate, invoiceAmount } = downloadResult.invoiceDetails;
        
        // Extract currency and amount
        let amount = null;
        let currency = null;
        
        if (invoiceAmount) {
          const match = invoiceAmount.match(/([^\d,.]*)([0-9,.]+)/);
          if (match) {
            currency = match[1].trim();
            amount = parseFloat(match[2].replace(/,/g, ''));
          }
        }
        
        // Insert invoice record
        await DB.prepare(`
          INSERT INTO invoices (
            website_id, invoice_number, invoice_date, amount, currency, file_path
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          websiteId,
          invoiceNumber || null,
          invoiceDate || null,
          amount || null,
          currency || null,
          downloadResult.downloadPath || null
        ).run();
      }
      
      result = {
        success: true,
        message: 'Invoice downloaded successfully',
        invoiceDetails: downloadResult.invoiceDetails,
        filePath: downloadResult.downloadPath
      };
    } finally {
      // Always close the browser
      await scraper.close();
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download invoice' },
      { status: 500 }
    );
  }
}
