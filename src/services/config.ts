// Configuration to switch between Firebase and Spring Boot APIs
export const API_CONFIG = {
  // Set to 'firebase' to use Firebase, 'springboot' to use Spring Boot APIs
  provider:  'springboot',
  
  // Spring Boot API configuration
  springBoot: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://kraftika-env.eba-vyn62iv2.ap-south-1.elasticbeanstalk.com/api',
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

