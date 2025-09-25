"use client";

import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { AICoachInterface } from "@/components/ai-coach-interface";

export default function AICoachPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          {/* <Skeleton className="h-[600px] w-full" /> */}
        </div>
      </div>
    );
  }

  const userPlan = user?.plan || "free";

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Trading Assistant</h1>
          <p className="text-muted-foreground">
            Get real-time market analysis, backtest strategies, and optimize
            your portfolio with advanced AI technology
          </p>
        </div>

        {/* AI Coach Interface */}
        <div className="h-[700px] rounded-b-lg">
          <AICoachInterface plan={userPlan as "free" | "pro" | "elite"} />
        </div>
      </div>
    </div>
  );
}
