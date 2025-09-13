import { DashboardHeader } from "@/components/dashboard-header"
import { MarketOverview } from "@/components/market-overview"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { AIInsights } from "@/components/ai-insights"
import { TradingFeed } from "@/components/trading-feed"
import { PlanUpgrade } from "@/components/plan-upgrade"

export default function DashboardPage() {
  // Mock user data - in real app this would come from auth/database
  const user = {
    name: "Alex Thompson",
    email: "alex@example.com",
    plan: "free", // free, pro, elite
    avatar: "/professional-avatar.png",
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Plan Upgrade Banner for Free Users */}
        {user.plan === "free" && <PlanUpgrade />}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio & AI */}
          <div className="lg:col-span-2 space-y-6">
            <PortfolioSummary plan={user.plan} />
            <MarketOverview plan={user.plan} />
            <AIInsights plan={user.plan} />
          </div>

          {/* Right Column - Trading Feed */}
          <div className="space-y-6">
            <TradingFeed plan={user.plan} />
          </div>
        </div>
      </main>
    </div>
  )
}
