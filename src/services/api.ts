// API base. The backend now lives in this same Next.js app under /api/backend.
// - Browser: same-origin relative path.
// - Server (RSC/SSR): needs an absolute URL to hit our own route handlers.
//   On Vercel, VERCEL_URL is the deployment host; locally, the dev port.
function resolveServerBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  // Public site domain first: $VERCEL_URL is the internal *.vercel.app host,
  // which Deployment Protection intercepts with an auth page.
  if (process.env.NEXT_PUBLIC_SITE_URL) return `${process.env.NEXT_PUBLIC_SITE_URL}/api/backend`;
  if (process.env.VERCEL_ENV === 'production') return 'https://www.kraftikastudio.com/api/backend';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/backend`;
  return `http://localhost:${process.env.PORT || 9002}/api/backend`;
}
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api/backend' : resolveServerBase());

// Generic API client
class ApiClient {
  public baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Get JWT token from localStorage if available
    // AuthContext stores it as 'kraftikaToken'
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('kraftikaToken') || sessionStorage.getItem('kraftikaToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`🌐 API GET: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || errorJson.message || `API Error: ${response.status} ${response.statusText}`);
        } catch {
          throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Fetch error for ${url}:`, error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error: Cannot connect to ${this.baseUrl}. Please check CORS and network connectivity.`);
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `API Error: ${response.status} ${response.statusText}`);
      } catch {
        throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `API Error: ${response.status} ${response.statusText}`);
      } catch {
        throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `API Error: ${response.status} ${response.statusText}`);
      } catch {
        throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

