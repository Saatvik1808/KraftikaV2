"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  userId: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  authProvider: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string, firstName?: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<string>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL =  "https://kraftika-backend-production.up.railway.app/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("kraftikaToken");
    const storedUser = localStorage.getItem("kraftikaUser");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const saveAuth = (authToken: string, userData: User) => {
    localStorage.setItem("kraftikaToken", authToken);
    localStorage.setItem("kraftikaUser", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    try {
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

      const data = await response.json();
      const userData: User = {
        userId: data.userId,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageUrl: data.profileImageUrl,
        role: data.role,
        authProvider: data.authProvider,
      };

      saveAuth(data.token, userData);
      
      // Sync localStorage cart to backend after login
      if (typeof window !== 'undefined') {
        import("@/services/cart-sync").then(({ syncLocalStorageCartToBackend }) => {
          syncLocalStorageCartToBackend().catch(console.error);
        });
      }
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.email || userData.phone}`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
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

      const data = await response.json();
      const userData: User = {
        userId: data.userId,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageUrl: data.profileImageUrl,
        role: data.role,
        authProvider: data.authProvider,
      };

      saveAuth(data.token, userData);
      
      // Sync localStorage cart to backend after registration
      if (typeof window !== 'undefined') {
        import("@/services/cart-sync").then(({ syncLocalStorageCartToBackend }) => {
          syncLocalStorageCartToBackend().catch(console.error);
        });
      }
      
      toast({
        title: "Welcome!",
        description: "Account created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendOtp = async (phone: string): Promise<string> => {
    try {
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

      const data = await response.json();
      toast({
        title: "OTP sent",
        description: "Check your phone for the verification code",
      });
      
      // In development, return OTP for testing (remove in production)
      if (process.env.NODE_ENV === "development") {
        // The backend logs OTP in development mode
        return "123456"; // Mock OTP for development
      }
      
      return "";
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithPhone = async (phone: string, otp: string, firstName?: string) => {
    try {
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

      const data = await response.json();
      const userData: User = {
        userId: data.userId,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageUrl: data.profileImageUrl,
        role: data.role,
        authProvider: data.authProvider,
      };

      saveAuth(data.token, userData);
      
      // Sync localStorage cart to backend after phone login
      if (typeof window !== 'undefined') {
        import("@/services/cart-sync").then(({ syncLocalStorageCartToBackend }) => {
          syncLocalStorageCartToBackend().catch(console.error);
        });
      }
      
      toast({
        title: "Welcome!",
        description: "Logged in successfully",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired OTP",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
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

      const data = await response.json();
      const userData: User = {
        userId: data.userId,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImageUrl: data.profileImageUrl,
        role: data.role,
        authProvider: data.authProvider,
      };

      saveAuth(data.token, userData);
      
      // Sync localStorage cart to backend after Google login
      if (typeof window !== 'undefined') {
        import("@/services/cart-sync").then(({ syncLocalStorageCartToBackend }) => {
          syncLocalStorageCartToBackend().catch(console.error);
        });
      }
      
      toast({
        title: "Welcome!",
        description: "Logged in with Google successfully",
      });
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("kraftikaToken");
    localStorage.removeItem("kraftikaUser");
    // Don't clear cart on logout - keep it in localStorage for when they log back in
    // The cart will be synced to backend when they log in again
    setToken(null);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithPhone,
        sendOtp,
        loginWithGoogle,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

