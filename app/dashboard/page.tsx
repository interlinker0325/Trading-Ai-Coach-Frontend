"use client";

import { MarketOverview } from "@/components/market-overview";
import { PortfolioSummary } from "@/components/portfolio-summary";
import { AIInsights } from "@/components/ai-insights";
import { TradingFeed } from "@/components/trading-feed";
import { PlanUpgrade } from "@/components/plan-upgrade";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAuthenticated, refreshUser, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Refresh user data if coming from successful checkout
  useEffect(() => {
    const upgradeSuccess = searchParams.get("upgrade");
    if (upgradeSuccess === "success" && isAuthenticated) {
      // Refresh user data to get updated plan
      refreshUser();

      // Clear the success parameter from URL after 3 seconds
      setTimeout(() => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("upgrade");
        router.replace(newUrl.pathname + newUrl.search);
      }, 3000);
    }
  }, [searchParams, isAuthenticated, refreshUser, router]);

  // Show loading while checking auth or refreshing user data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to access the dashboard
          </h1>
          <div className="mb-4 p-4 bg-gray-800 rounded text-left text-sm">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>isAuthenticated: {isAuthenticated.toString()}</p>
            <p>isLoading: {isLoading.toString()}</p>
            <p>user: {user ? JSON.stringify(user) : "null"}</p>
            <p>
              access_token:{" "}
              {typeof window !== "undefined"
                ? localStorage.getItem("access_token")
                  ? "present"
                  : "missing"
                : "N/A"}
            </p>
            <p>URL params: {searchParams.toString()}</p>
          </div>
          <a href="/signin" className="text-primary hover:underline">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Success message for successful upgrade */}
      {searchParams.get("upgrade") === "success" && user?.plan !== "free" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Upgrade Successful!</span>
            <span className="ml-2">Your {user?.plan} plan is now active.</span>
          </div>
        </div>
      )}

      {/* Plan Upgrade Banner for Free Users */}
      {user?.plan === "free" && <PlanUpgrade />}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Portfolio & AI */}
        <div className="lg:col-span-2 space-y-6">
          <PortfolioSummary plan={user?.plan || "free"} />
          <MarketOverview plan={user?.plan || "free"} />
          <AIInsights plan={user?.plan || "free"} />
        </div>

        {/* Right Column - Trading Feed */}
        <div className="space-y-6">
          <TradingFeed plan={user?.plan || "free"} />
        </div>
      </div>
    </div>
  );
}
