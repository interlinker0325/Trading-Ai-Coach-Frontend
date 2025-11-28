"use client";

import { Backtester } from "@/components/backtester";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Crown } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function BacktesterPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

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

  // Check if user has Elite plan
  const userPlan = user?.plan || "free";
  if (userPlan !== "pro" && userPlan !== "elite") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Lock className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    Pro or Elite Plan Required
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    The Trade Simulation Backtester(Stocks, Cryptocurrency, Forex) is an exclusive feature available only to Elite plan subscribers.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Pro or Elite Plan includes:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 text-left">
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Advanced trade simulator & backtester
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Everything in Pro plan
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Broker integration & auto-trading
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Priority support & API access
                    </li>
                  </ul>
                </div>
                <Button
                  onClick={() => router.push("/pricing")}
                  className="w-full mt-6"
                >
                  Upgrade to Pro or Elite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Backtester />
    </div>
  );
}
