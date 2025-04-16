import crypto from 'crypto';

// Encryption key (in a real application, this would be stored securely in environment variables)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'this-is-a-32-byte-encryption-key-123';

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @returns {Object} - Object containing encrypted text and initialization vector
 */
export function encrypt(text) {
  // Create a random initialization vector
  const iv = crypto.randomBytes(16);
  
  // Create cipher using AES-256-CBC algorithm
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return encrypted text and initialization vector
  return {
    encryptedText: encrypted,
    iv: iv.toString('hex')
  };
}

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Encrypted text to decrypt
 * @param {string} ivHex - Initialization vector in hexadecimal format
 * @returns {string} - Decrypted text
 */
export function decrypt(encryptedText, ivHex) {
  // Convert initialization vector from hex to buffer
  const iv = Buffer.from(ivHex, 'hex');
  
  // Create decipher using AES-256-CBC algorithm
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  // Decrypt the text
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
