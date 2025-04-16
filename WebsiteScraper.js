import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { decrypt } from './encryption';

/**
 * Class to handle website login and invoice scraping
 */
export class WebsiteScraper {
  constructor(websiteData, downloadDir) {
    this.websiteData = websiteData;
    this.downloadDir = downloadDir;
    this.browser = null;
    this.page = null;
  }

  /**
   * Initialize the browser
   */
  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      
      // Set download behavior
      const client = await this.page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: this.downloadDir
      });
      
      return true;
    } catch (error) {
      console.error('Error initializing browser:', error);
      return false;
    }
  }

  /**
   * Login to the website
   */
  async login() {
    try {
      // Navigate to login page
      await this.page.goto(this.websiteData.login_url, { waitUntil: 'networkidle2' });
      
      // Decrypt credentials
      const username = decrypt(this.websiteData.username_encrypted, this.websiteData.encryption_iv);
      const password = decrypt(this.websiteData.password_encrypted, this.websiteData.encryption_iv);
      
      // Determine selectors (use provided or try to auto-detect)
      const usernameSelector = this.websiteData.login_selector || await this.detectUsernameField();
      const passwordSelector = this.websiteData.password_selector || await this.detectPasswordField();
      const submitSelector = this.websiteData.submit_selector || await this.detectSubmitButton();
      
      if (!usernameSelector || !passwordSelector || !submitSelector) {
        throw new Error('Could not detect login form elements');
      }
      
      // Fill in the login form
      await this.page.waitForSelector(usernameSelector);
      await this.page.type(usernameSelector, username);
      
      await this.page.waitForSelector(passwordSelector);
      await this.page.type(passwordSelector, password);
      
      // Submit the form
      await this.page.waitForSelector(submitSelector);
      await this.page.click(submitSelector);
      
      // Wait for navigation to complete
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Check if login was successful
      const loginSuccess = await this.checkLoginSuccess();
      
      return loginSuccess;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  /**
   * Navigate to invoice page and download the latest invoice
   */
  async downloadLatestInvoice() {
    try {
      // Navigate to invoice page if specified
      if (this.websiteData.invoice_url) {
        await this.page.goto(this.websiteData.invoice_url, { waitUntil: 'networkidle2' });
      }
      
      // Find invoice elements
      const invoiceSelector = this.websiteData.invoice_selector || await this.detectInvoiceElements();
      if (!invoiceSelector) {
        throw new Error('Could not detect invoice elements');
      }
      
      // Wait for invoice elements to load
      await this.page.waitForSelector(invoiceSelector);
      
      // Find download button
      const downloadSelector = this.websiteData.download_selector || await this.detectDownloadButton();
      if (!downloadSelector) {
        throw new Error('Could not detect download button');
      }
      
      // Click the first (latest) download button
      await this.page.waitForSelector(downloadSelector);
      
      // Set up download listener
      const downloadPromise = new Promise(resolve => {
        this.page.once('download', download => {
          resolve(download.path());
        });
      });
      
      // Click download button
      await this.page.click(downloadSelector);
      
      // Wait for download to complete
      const downloadPath = await downloadPromise;
      
      // Extract invoice details
      const invoiceDetails = await this.extractInvoiceDetails();
      
      return {
        success: true,
        downloadPath,
        invoiceDetails
      };
    } catch (error) {
      console.error('Error downloading invoice:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Close the browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * Auto-detect username field
   */
  async detectUsernameField() {
    const usernameSelectors = [
      'input[type="email"]',
      'input[type="text"]',
      'input[name="username"]',
      'input[name="email"]',
      'input[id="username"]',
      'input[id="email"]'
    ];
    
    for (const selector of usernameSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        return selector;
      }
    }
    
    return null;
  }

  /**
   * Auto-detect password field
   */
  async detectPasswordField() {
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[id="password"]'
    ];
    
    for (const selector of passwordSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        return selector;
      }
    }
    
    return null;
  }

  /**
   * Auto-detect submit button
   */
  async detectSubmitButton() {
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Login")',
      'button:contains("Sign In")',
      'input[value="Login"]',
      'input[value="Sign In"]'
    ];
    
    for (const selector of submitSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        return selector;
      }
    }
    
    return null;
  }

  /**
   * Auto-detect invoice elements
   */
  async detectInvoiceElements() {
    const invoiceSelectors = [
      'table.invoices',
      '.invoice-list',
      '.invoice-table',
      'table:contains("Invoice")',
      'div:contains("Invoice")'
    ];
    
    for (const selector of invoiceSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        return selector;
      }
    }
    
    return null;
  }

  /**
   * Auto-detect download button
   */
  async detectDownloadButton() {
    const downloadSelectors = [
      'a[download]',
      'a:contains("Download")',
      'button:contains("Download")',
      '.download-btn',
      'a[href*="download"]',
      'a[href*="pdf"]'
    ];
    
    for (const selector of downloadSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        return selector;
      }
    }
    
    return null;
  }

  /**
   * Check if login was successful
   */
  async checkLoginSuccess() {
    // Check for common login failure indicators
    const failureSelectors = [
      '.login-error',
      '.error-message',
      'div:contains("Invalid username or password")',
      'div:contains("Login failed")'
    ];
    
    for (const selector of failureSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        return false;
      }
    }
    
    // If we're still on the login page, login probably failed
    const currentUrl = this.page.url();
    if (currentUrl === this.websiteData.login_url) {
      return false;
    }
    
    return true;
  }

  /**
   * Extract invoice details from the page
   */
  async extractInvoiceDetails() {
    // This is a simplified implementation
    // In a real-world scenario, this would be more sophisticated
    // and tailored to each website's structure
    try {
      const invoiceNumber = await this.page.evaluate(() => {
        const element = document.querySelector('[data-invoice-number], .invoice-number, td:contains("Invoice #")');
        return element ? element.textContent.trim() : null;
      });
      
      const invoiceDate = await this.page.evaluate(() => {
        const element = document.querySelector('[data-invoice-date], .invoice-date, td:contains("Date")');
        return element ? element.textContent.trim() : null;
      });
      
      const invoiceAmount = await this.page.evaluate(() => {
        const element = document.querySelector('[data-invoice-amount], .invoice-amount, td:contains("Amount")');
        return element ? element.textContent.trim() : null;
      });
      
      return {
        invoiceNumber,
        invoiceDate,
        invoiceAmount
      };
    } catch (error) {
      console.error('Error extracting invoice details:', error);
      return {};
    }
  }
}
