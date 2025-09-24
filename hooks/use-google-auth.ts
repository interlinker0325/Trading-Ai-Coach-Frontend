"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export const useGoogleAuth = () => {
  const {
    login,
    isAuthenticated,
    refreshUser,
    user,
    setUser,
    setIsAuthenticated,
  } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initializeGoogleAuth = () => {
    if (typeof window === "undefined" || window.google) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    };
    document.head.appendChild(script);
  };

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    try {
      console.log("Google response received:", response);
      console.log("Credential length:", response.credential?.length);

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
        }
      );

      const data = await result.json();
      console.log("Google auth response:", data);

      if (result.ok) {
        console.log("Google auth successful:", data);

        // Store tokens in localStorage and cookies
        localStorage.setItem("access_token", data.access_token);

        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        // Set cookies
        const isSecure = window.location.protocol === "https:";
        const cookieOptions = `path=/; max-age=${24 * 60 * 60}${
          isSecure ? "; secure" : ""
        }; samesite=strict`;

        document.cookie = `access_token=${data.access_token}; ${cookieOptions}`;

        if (data.refresh_token) {
          const refreshCookieOptions = `path=/; max-age=${7 * 24 * 60 * 60}${
            isSecure ? "; secure" : ""
          }; samesite=strict`;
          document.cookie = `refresh_token=${data.refresh_token}; ${refreshCookieOptions}`;
        }

        // Update auth context with user data directly
        if (data.user) {
          const userData = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.full_name,
            plan: data.user.plan,
            is_verified: data.user.is_verified,
          };
          setUser(userData);
          setIsAuthenticated(true);
        }

        // Force a page reload to ensure middleware picks up the new cookies
        window.location.href = "/dashboard";
      } else {
        console.error("Google auth failed:", data.detail);
        // Handle error - you might want to show a toast or error message
      }
    } catch (error) {
      console.error("Google auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      console.error("Google Sign-In not loaded");
    }
  };

  return {
    initializeGoogleAuth,
    signInWithGoogle,
    isLoading,
  };
};
