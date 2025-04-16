import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@cloudflare/next-on-pages';
import { encrypt } from '../../../lib/encryption';

export async function POST(request: NextRequest) {
  try {
    const { DB } = getCloudflareContext().env;
    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.url || !data.login_url || !data.username || !data.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Encrypt the credentials
    const usernameEncryption = encrypt(data.username);
    const passwordEncryption = encrypt(data.password);
    
    // Insert the website into the database
    const result = await DB.prepare(`
      INSERT INTO websites (
        name, url, login_url, invoice_url, 
        login_selector, password_selector, submit_selector, 
        invoice_selector, download_selector,
        username_encrypted, password_encrypted, encryption_iv
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.url,
      data.login_url,
      data.invoice_url || '',
      data.login_selector || '',
      data.password_selector || '',
      data.submit_selector || '',
      data.invoice_selector || '',
      data.download_selector || '',
      usernameEncryption.encryptedText,
      passwordEncryption.encryptedText,
      usernameEncryption.iv // Using the same IV for both username and password for simplicity
    ).run();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Website added successfully',
      id: result.meta?.last_row_id
    });
  } catch (error) {
    console.error('Error adding website:', error);
    return NextResponse.json(
      { error: 'Failed to add website' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { DB } = getCloudflareContext().env;
    
    // Get all websites from the database
    const websites = await DB.prepare(`
      SELECT id, name, url, login_url, invoice_url, last_login, created_at, updated_at
      FROM websites
      ORDER BY name ASC
    `).all();
    
    return NextResponse.json(websites.results || []);
  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}
