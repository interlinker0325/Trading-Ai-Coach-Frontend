"use client";

import { useAuth } from "@/contexts/auth-context";
import { PortfolioOverview } from "@/components/portfolio-overview";
import { PortfolioHoldings } from "@/components/portfolio-holdings";
import { PortfolioAnalytics } from "@/components/portfolio-analytics";
import { PortfolioActions } from "@/components/portfolio-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PortfolioPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to access your portfolio
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
      {/* Portfolio Overview */}
      <PortfolioOverview plan={user?.plan || "free"} />

      {/* Portfolio Management Tabs */}
      <Tabs defaultValue="holdings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          <PortfolioHoldings plan={user?.plan || "free"} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PortfolioAnalytics plan={user?.plan || "free"} />
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <PortfolioActions plan={user?.plan || "free"} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Portfolio history coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
