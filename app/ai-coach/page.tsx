"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { AICoachInterface } from "@/components/ai-coach-interface";

export default function AICoachPage() {
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
      <div className="text-center text-2xl font-bold">
        Please login to access this page
      </div>
    );
  }

  const userPlan = user?.plan || "free";

  return (
    <div className="h-[calc(100vh-64px)] bg-white dark:bg-black flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col min-h-0">
        {/* Hero Section */}
        <div className="flex-shrink-0 mb-4">
          <h1 className="text-2xl font-bold">AI-Powered Trading Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Get real-time market analysis, backtest strategies, and optimize
            your portfolio with advanced AI technology
          </p>
        </div>

        {/* AI Coach Interface - Takes remaining space */}
        <div className="flex-1 rounded-xl overflow-hidden min-h-0">
          <AICoachInterface plan={userPlan as "free" | "pro" | "elite"} />
        </div>
      </div>
    </div>
  );
}
