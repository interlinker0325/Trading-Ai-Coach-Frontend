import { DashboardHeader } from "@/components/dashboard-header"
import { ScreenerInterface } from "@/components/screener-interface"

export default function ScreenerPage() {
  // Mock user data - in real app this would come from auth/database
  const user = {
    name: "Alex Thompson",
    email: "alex@example.com",
    plan: "pro", // free, pro, elite
    avatar: "/professional-avatar.png",
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Market Screener</h1>
          <p className="text-muted-foreground">Discover investment opportunities across all asset classes</p>
        </div>

        <ScreenerInterface plan={user.plan} />
      </main>
    </div>
  )
}
