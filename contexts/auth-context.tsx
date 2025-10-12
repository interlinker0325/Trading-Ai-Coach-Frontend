"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types
interface User {
  id: number;
  email: string;
  full_name?: string;
  plan?: "free" | "pro" | "elite";
  is_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    full_name: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<User | null | undefined>;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// AuthProvider Component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    // Add a small delay to prevent race conditions with login
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // If we're already authenticated and have user data, don't make unnecessary API calls
      if (isAuthenticated && user) {
        setIsLoading(false);
        return;
      }

      // If we're in the middle of logging in, don't reset the state
      if (isLoggingIn) {
        setIsLoading(false);
        return;
      }

      // Verify token is still valid by making a request to get user info
      await refreshUser();
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid tokens from both localStorage and cookies
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      document.cookie = "access_token=; path=/; max-age=0";
      document.cookie = "refresh_token=; path=/; max-age=0";
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    try {
      setIsLoading(true);
      setIsLoggingIn(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, remember_me: rememberMe }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store tokens in both localStorage and cookies
        localStorage.setItem("access_token", data.access_token);

        // Set different cookie expiration based on remember me
        const accessTokenExpiry = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
        const refreshTokenExpiry = rememberMe
          ? 90 * 24 * 60 * 60
          : 7 * 24 * 60 * 60; // 90 days or 7 days

        // Set cookies with proper attributes
        const isSecure = window.location.protocol === "https:";
        const cookieOptions = `path=/; max-age=${accessTokenExpiry}${
          isSecure ? "; secure" : ""
        }; samesite=strict`;

        document.cookie = `access_token=${data.access_token}; ${cookieOptions}`;

        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
          const refreshCookieOptions = `path=/; max-age=${refreshTokenExpiry}${
            isSecure ? "; secure" : ""
          }; samesite=strict`;
          document.cookie = `refresh_token=${data.refresh_token}; ${refreshCookieOptions}`;
        }

        // Store user information
        if (data.user) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.full_name,
            plan: data.user.plan,
            is_verified: data.user.is_verified,
          };
          setUser(userData);
        }

        // Set authenticated state AFTER storing everything
        setIsAuthenticated(true);

        // Add a small delay to ensure state is fully updated
        await new Promise((resolve) => setTimeout(resolve, 100));

        return { success: true };
      } else {
        return { success: false, error: data.detail || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
      // Keep isLoggingIn true for a bit longer to prevent flickering
      setTimeout(() => {
        setIsLoggingIn(false);
      }, 1000);
    }
  };

  const signup = async (email: string, password: string, full_name: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, full_name }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.detail || "Registration failed" };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all stored data from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Clear cookies
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";

    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Update tokens in localStorage
        localStorage.setItem("access_token", data.access_token);

        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        // Update cookies
        const isSecure = window.location.protocol === "https:";
        const accessTokenExpiry = 24 * 60 * 60; // 1 day default
        const cookieOptions = `path=/; max-age=${accessTokenExpiry}${
          isSecure ? "; secure" : ""
        }; samesite=strict`;
        document.cookie = `access_token=${data.access_token}; ${cookieOptions}`;

        if (data.refresh_token) {
          const refreshTokenExpiry = 7 * 24 * 60 * 60; // 7 days default
          const refreshCookieOptions = `path=/; max-age=${refreshTokenExpiry}${
            isSecure ? "; secure" : ""
          }; samesite=strict`;
          document.cookie = `refresh_token=${data.refresh_token}; ${refreshCookieOptions}`;
        }

        return data.access_token;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      let token = localStorage.getItem("access_token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Make request to get current user info
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If token is expired (401), try to refresh it
      if (response.status === 401) {
        console.log("Access token expired, attempting refresh...");
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Retry the request with new token
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );
        } else {
          // Refresh failed, logout
          logout();
          return null;
        }
      }

      if (response.ok) {
        const userData = await response.json();
        const userInfo: User = {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          plan: userData.plan,
          is_verified: userData.is_verified,
        };
        setUser(userInfo);
        setIsAuthenticated(true);
        return userInfo; // Return user data for external use
      } else {
        // Token is invalid, logout
        logout();
        return null;
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
      logout();
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
    setUser,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
