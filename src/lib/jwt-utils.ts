/**
 * Utility functions for JWT token handling
 */

/**
 * Decode JWT token without verification (client-side only)
 * This is safe because we're only checking expiration, not validating the signature
 */
function decodeJWT(token: string): { exp?: number; iat?: number; sub?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) {
    return true;
  }
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true; // Consider expired if we can't decode it
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  // Add a 5 minute buffer to avoid edge cases
  return currentTime >= (expirationTime - 5 * 60 * 1000);
}

/**
 * Get valid token or null if expired/missing
 */
export function getValidToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = localStorage.getItem('kraftikaToken');
  if (!token) {
    return null;
  }
  
  if (isTokenExpired(token)) {
    // Remove expired token
    localStorage.removeItem('kraftikaToken');
    localStorage.removeItem('kraftikaUser');
    return null;
  }
  
  return token;
}

/**
 * Clear authentication data
 */
export function clearAuthData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kraftikaToken');
    localStorage.removeItem('kraftikaUser');
  }
}

