"use client";

import { PricingPlans } from "@/components/pricing-plans";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function PlansPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-balance">Choose Your Plan</h1>
          <p className="text-muted-foreground mt-2">
            Unlock the full power of AI-driven financial insights
          </p>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <LogIn className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription>
              <strong>Sign in required:</strong> Please sign in to your account
              to subscribe to a plan and access premium features.
            </AlertDescription>
          </Alert>
        )}

        <PricingPlans />
      </div>
    </div>
  );
}
