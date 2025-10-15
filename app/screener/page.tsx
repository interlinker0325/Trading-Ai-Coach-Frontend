"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ScreenerInterface } from "@/components/screener-interface";
import { useAuth } from "@/contexts/auth-context";

export default function ScreenerPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center text-2xl font-bold h-[calc(100vh-64px)]">
        Please login to access this page
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background dark:bg-black">
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
