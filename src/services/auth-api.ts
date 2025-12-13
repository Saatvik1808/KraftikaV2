import { API_BASE_URL } from "./config";

export interface AuthResponse {
  token: string;
  userId: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  authProvider: string;
}

export interface OtpResponse {
  message: string;
  success: boolean;
  expiresInMinutes: number;
}

export const authApi = {
  /**
   * Register with email and password
   */
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  /**
   * Send OTP to phone number
   */
  async sendOtp(phone: string): Promise<OtpResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send OTP");
    }

    return response.json();
  },

  /**
   * Verify OTP and login/register
   */
  async verifyOtp(phone: string, otp: string, firstName?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp, firstName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "OTP verification failed");
    }

    return response.json();
  },

  /**
   * Login with Google
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Google login failed");
    }

    return response.json();
  },
};




