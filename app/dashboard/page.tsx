"use client";

import { MarketOverview } from "@/components/market-overview";
import { PortfolioSummary } from "@/components/portfolio-summary";
import { AIInsights } from "@/components/ai-insights";
import { TradingFeed } from "@/components/trading-feed";
import { PlanUpgrade } from "@/components/plan-upgrade";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to access the dashboard
          </h1>
          <a href="/signin" className="text-primary hover:underline">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
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
