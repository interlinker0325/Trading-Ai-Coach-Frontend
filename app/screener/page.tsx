"use client";

import { ScreenerInterface } from "@/components/screener-interface";
import { useAuth } from "@/contexts/auth-context";

export default function ScreenerPage() {
  const { user } = useAuth();

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
