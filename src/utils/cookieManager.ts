export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface CookieConsent {
  preferences: CookiePreferences;
  timestamp: string;
  version: string;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_CONSENT_TIMESTAMP_KEY = 'cookie-consent-timestamp';
const COOKIE_CONSENT_VERSION = '1.0';

export class CookieManager {
  /**
   * Get current cookie consent preferences
   */
  static getConsent(): CookieConsent | null {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      const timestamp = localStorage.getItem(COOKIE_CONSENT_TIMESTAMP_KEY);
      
      if (!consent || !timestamp) return null;
      
      return {
        preferences: JSON.parse(consent),
        timestamp,
        version: COOKIE_CONSENT_VERSION,
      };
    } catch (error) {
      console.error('Error reading cookie consent:', error);
      return null;
    }
  }

  /**
   * Check if user has given consent
   */
  static hasConsent(): boolean {
    return this.getConsent() !== null;
  }

  /**
   * Check if specific cookie type is allowed
   */
  static isAllowed(cookieType: keyof CookiePreferences): boolean {
    const consent = this.getConsent();
    if (!consent) return false;
    
    // Necessary cookies are always allowed
    if (cookieType === 'necessary') return true;
    
    return consent.preferences[cookieType] === true;
  }

  /**
   * Set a cookie with proper consent checking
   */
  static setCookie(
    name: string, 
    value: string, 
    options: {
      expires?: Date;
      maxAge?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      cookieType?: keyof CookiePreferences;
    } = {}
  ): boolean {
    const { cookieType = 'necessary', ...cookieOptions } = options;
    
    // Check if this cookie type is allowed
    if (!this.isAllowed(cookieType)) {
      console.warn(`Cookie "${name}" blocked: ${cookieType} cookies not allowed`);
      return false;
    }

    try {
      let cookieString = `${name}=${value}`;
      
      if (cookieOptions.expires) {
        cookieString += `; expires=${cookieOptions.expires.toUTCString()}`;
      }
      
      if (cookieOptions.maxAge) {
        cookieString += `; max-age=${cookieOptions.maxAge}`;
      }
      
      if (cookieOptions.path) {
        cookieString += `; path=${cookieOptions.path}`;
      }
      
      if (cookieOptions.domain) {
        cookieString += `; domain=${cookieOptions.domain}`;
      }
      
      if (cookieOptions.secure) {
        cookieString += `; secure`;
      }
      
      if (cookieOptions.sameSite) {
        cookieString += `; samesite=${cookieOptions.sameSite}`;
      }
      
      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error('Error setting cookie:', error);
      return false;
    }
  }

  /**
   * Get a cookie value
   */
  static getCookie(name: string): string | null {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
      return null;
    } catch (error) {
      console.error('Error reading cookie:', error);
      return null;
    }
  }

  /**
   * Delete a cookie
   */
  static deleteCookie(name: string, path: string = '/', domain?: string): void {
    try {
      let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
      
      if (domain) {
        cookieString += `; domain=${domain}`;
      }
      
      document.cookie = cookieString;
    } catch (error) {
      console.error('Error deleting cookie:', error);
    }
  }

  /**
   * Clear all non-necessary cookies
   */
  static clearNonNecessaryCookies(): void {
    const consent = this.getConsent();
    if (!consent) return;

    // Get all cookies
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name) {
        // Only delete if it's not a necessary cookie
        // In a real implementation, you'd need to track which cookies belong to which category
        this.deleteCookie(name);
      }
    });
  }

  /**
   * Initialize analytics based on consent
   */
  static initializeAnalytics(): void {
    if (!this.isAllowed('analytics')) {
      console.log('Analytics disabled by user consent');
      return;
    }

    // Initialize Google Analytics or other analytics tools here
    // Example:
    // gtag('consent', 'update', {
    //   'analytics_storage': 'granted'
    // });
  }

  /**
   * Initialize marketing tools based on consent
   */
  static initializeMarketing(): void {
    if (!this.isAllowed('marketing')) {
      console.log('Marketing tools disabled by user consent');
      return;
    }

    // Initialize marketing tools here
    // Example: Facebook Pixel, Google Ads, etc.
  }

  /**
   * Get consent summary for display
   */
  static getConsentSummary(): {
    hasConsent: boolean;
    allowedTypes: string[];
    timestamp: string | null;
  } {
    const consent = this.getConsent();
    
    if (!consent) {
      return {
        hasConsent: false,
        allowedTypes: [],
        timestamp: null,
      };
    }

    const allowedTypes = Object.entries(consent.preferences)
      .filter(([_, allowed]) => allowed)
      .map(([type, _]) => type);

    return {
      hasConsent: true,
      allowedTypes,
      timestamp: consent.timestamp,
    };
  }
}

export default CookieManager;
