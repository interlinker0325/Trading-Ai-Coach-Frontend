/**
 * API Client with automatic token refresh
 *
 * This utility provides a fetch wrapper that automatically handles token refresh
 * when the access token expires (401 response).
 */

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          return null;
        }

        const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

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
        }

        return null;
      } catch (error) {
        console.error("Token refresh failed:", error);
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Make an authenticated API request with automatic token refresh
   */
  async fetch(url: string, options: FetchOptions = {}): Promise<Response> {
    const { skipAuth, ...fetchOptions } = options;

    // Prepare headers
    const headers = new Headers(fetchOptions.headers);

    // Add authorization header if not skipping auth
    if (!skipAuth) {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // Add content-type if not present and body is present
    if (
      fetchOptions.body &&
      !headers.has("Content-Type") &&
      typeof fetchOptions.body === "string"
    ) {
      headers.set("Content-Type", "application/json");
    }

    // Make the request
    const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;
    let response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
    });

    // If we get a 401 and we're not skipping auth, try to refresh the token
    if (response.status === 401 && !skipAuth) {
      console.log("Access token expired, attempting refresh...");
      const newToken = await this.refreshAccessToken();

      if (newToken) {
        // Retry the request with the new token
        headers.set("Authorization", `Bearer ${newToken}`);
        response = await fetch(fullUrl, {
          ...fetchOptions,
          headers,
        });
      } else {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        document.cookie = "access_token=; path=/; max-age=0";
        document.cookie = "refresh_token=; path=/; max-age=0";

        // Redirect to signin page
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
      }
    }

    return response;
  }

  /**
   * Convenience methods for common HTTP methods
   */
  async get(url: string, options?: FetchOptions) {
    return this.fetch(url, { ...options, method: "GET" });
  }

  async post(url: string, body?: any, options?: FetchOptions) {
    return this.fetch(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put(url: string, body?: any, options?: FetchOptions) {
    return this.fetch(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch(url: string, body?: any, options?: FetchOptions) {
    return this.fetch(url, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete(url: string, options?: FetchOptions) {
    return this.fetch(url, { ...options, method: "DELETE" });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export default ApiClient;
