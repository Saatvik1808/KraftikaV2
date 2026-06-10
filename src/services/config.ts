// Configuration to switch between Firebase and Spring Boot APIs
export const API_CONFIG = {
  // Set to 'firebase' to use Firebase, 'springboot' to use Spring Boot APIs
  provider:  'springboot',
  
  // Backend now runs in this same Next.js app under /api/backend.
  springBoot: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined'
        ? '/api/backend'
        : process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/backend`
          : process.env.VERCEL_ENV === 'production'
            ? 'https://www.kraftikastudio.com/api/backend'
            : process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}/api/backend`
              : `http://localhost:${process.env.PORT || 9002}/api/backend`),
  },
  
  // Firebase configuration (keeping existing)
  firebase: {
    // Firebase config is already in lib/firebase.ts
  }
};

// Helper function to determine which API to use
export function useSpringBootAPI(): boolean {
  return API_CONFIG.provider === 'springboot';
}

export function useFirebaseAPI(): boolean {
  return API_CONFIG.provider === 'firebase';
}

// API Base URL - use environment variable if available, otherwise default
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_CONFIG.springBoot.baseUrl;

