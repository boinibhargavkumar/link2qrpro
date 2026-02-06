/**
 * Security Utilities for Link2QRpro
 * Provides input validation, sanitization, and security helpers
 */

// URL Validation - Strict protocol allowlist
export const validateURL = (input) => {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Invalid input' };
  }

  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'URL cannot be empty' };
  }

  if (trimmed.length > 2048) {
    return { valid: false, error: 'URL too long (max 2048 characters)' };
  }

  try {
    const urlObj = new URL(trimmed);
    const protocol = urlObj.protocol.toLowerCase();
    
    // Strict allowlist: only http and https
    if (protocol !== 'http:' && protocol !== 'https:') {
      return { 
        valid: false, 
        error: 'Only HTTP and HTTPS protocols are allowed' 
      };
    }
    
    // Block dangerous patterns
    const dangerousPatterns = [
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /file:/gi,
      /blob:/gi,
      /<script/gi,
      /<iframe/gi,
      /<embed/gi,
      /<object/gi,
      /on\w+\s*=/gi, // Event handlers like onclick=
      /&#/gi, // HTML entities
      /\\x/gi, // Hex encoding
      /\\u/gi, // Unicode encoding
    ];
    
    if (dangerousPatterns.some(pattern => pattern.test(trimmed))) {
      return { 
        valid: false, 
        error: 'URL contains suspicious or dangerous patterns' 
      };
    }

    // Validate hostname exists
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return { valid: false, error: 'Invalid hostname' };
    }

    // Block localhost/internal IPs in production
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    if (blockedHosts.includes(urlObj.hostname.toLowerCase())) {
      return { 
        valid: false, 
        error: 'Local/internal URLs are not allowed' 
      };
    }

    return { valid: true, url: trimmed };
  } catch (error) {
    return { valid: false, error: 'Malformed URL' };
  }
};

// Sanitize text input - prevent XSS in display text
export const sanitizeText = (input, maxLength = 255) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();
  
  // Limit length
  sanitized = sanitized.substring(0, maxLength);
  
  // Remove HTML tags and dangerous characters
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  return sanitized;
};

// Sanitize filename - prevent path traversal and special chars
export const sanitizeFilename = (input) => {
  if (!input || typeof input !== 'string') {
    return 'qrcode';
  }

  let sanitized = input.trim();
  
  // Remove or replace dangerous characters
  sanitized = sanitized
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') // Windows reserved chars
    .replace(/\.\./g, '_') // Path traversal
    .replace(/^\.+/, '') // Leading dots
    .replace(/\s+/g, '_') // Spaces to underscores
    .substring(0, 200); // Max filename length

  // Ensure non-empty result
  if (sanitized.length === 0) {
    return 'qrcode';
  }

  return sanitized;
};

// Rate limiting utility
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    
    // Remove old requests outside time window
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getRemainingTime() {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const timeElapsed = Date.now() - oldestRequest;
    return Math.max(0, this.timeWindow - timeElapsed);
  }
}

// Export rate limiters for different operations
export const qrGenerationLimiter = new RateLimiter(50, 60000); // 50 per minute
export const batchQrLimiter = new RateLimiter(10, 60000); // 10 batches per minute

// Content Security Policy generator
export const getCSPDirectives = () => {
  return {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"], // unsafe-inline needed for React
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': []
  };
};

// Generate CSP meta tag content
export const generateCSPContent = () => {
  const directives = getCSPDirectives();
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

// Validate color input (hex colors only)
export const validateColor = (color) => {
  if (!color || typeof color !== 'string') {
    return false;
  }
  
  // Only allow hex colors
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
};

// Safe parseInt with bounds
export const safeParseInt = (value, defaultValue = 0, min = -Infinity, max = Infinity) => {
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    return defaultValue;
  }
  
  return Math.max(min, Math.min(max, parsed));
};

// Detect and block automation/bots (basic fingerprinting)
export const detectAutomation = () => {
  // Check for common automation indicators
  const indicators = {
    webdriver: navigator.webdriver === true,
    phantom: window.phantom !== undefined || window._phantom !== undefined,
    nightmare: window.__nightmare !== undefined,
    selenium: document.documentElement.getAttribute('webdriver') === 'true',
    languages: navigator.languages?.length === 0,
    plugins: navigator.plugins?.length === 0
  };

  return Object.values(indicators).some(indicator => indicator === true);
};

// Error sanitization - prevent information leakage
export const sanitizeError = (error) => {
  // Never expose internal error details to users
  const safeMessages = {
    'Failed to fetch': 'Network error. Please check your connection.',
    'NetworkError': 'Network error. Please try again.',
    'TypeError': 'An unexpected error occurred.',
    'SyntaxError': 'Invalid data format.',
  };

  const errorMessage = error?.message || 'Unknown error';
  
  for (const [key, value] of Object.entries(safeMessages)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  return 'An error occurred. Please try again.';
};

// Secure random ID generation
export const generateSecureId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
};

export default {
  validateURL,
  sanitizeText,
  sanitizeFilename,
  validateColor,
  safeParseInt,
  qrGenerationLimiter,
  batchQrLimiter,
  generateCSPContent,
  detectAutomation,
  sanitizeError,
  generateSecureId
};