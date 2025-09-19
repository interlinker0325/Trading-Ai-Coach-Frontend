"use client";

import { ScreenerInterface } from "@/components/screener-interface";
import { useAuth } from "@/contexts/auth-context";

export default function ScreenerPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to access the screener
          </h1>
          <a href="/signin" className="text-primary hover:underline">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Market Screener</h1>
          <p className="text-muted-foreground">
            Discover investment opportunities across all asset classes
          </p>
        </div>

        <ScreenerInterface plan={user?.plan || "free"} />
      </div>
    </div>
  );
}
