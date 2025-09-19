"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { createCheckoutSession } from "@/lib/stripe";

export function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with AI financial insights",
      icon: Star,
      priceId: null, // No Stripe price ID for free plan
      features: [
        "5 AI queries per day",
        "Delayed market data (15 min)",
        "Basic portfolio tracking",
        "Community support",
        "Mobile app access",
      ],
      limitations: [
        "Limited to 3 watchlists",
        "No real-time alerts",
        "Basic charts only",
      ],
      buttonText: !isAuthenticated
        ? "Sign In to Subscribe"
        : user?.plan === "free"
        ? "Current Plan"
        : "Downgrade",
      buttonVariant: !isAuthenticated
        ? ("default" as const)
        : ("outline" as const),
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "Advanced tools for serious traders and investors",
      icon: Zap,
      priceId: "price_1S8lbvBlj5e71CfEtWSSBHAe", // Replace with actual Stripe price ID
      features: [
        "Unlimited AI queries",
        "Real-time market data",
        "Advanced screeners (stocks, crypto, forex)",
        "Portfolio analyzer with risk metrics",
        "Telegram & email alerts",
        "Technical analysis tools",
        "Options flow data",
        "Crypto sentiment analysis",
      ],
      limitations: [],
      buttonText: !isAuthenticated
        ? "Sign In to Subscribe"
        : user?.plan === "pro"
        ? "Current Plan"
        : user?.plan === "elite"
        ? "Downgrade"
        : "Upgrade to Pro",
      buttonVariant:
        user?.plan === "pro" ? ("outline" as const) : ("default" as const),
      popular: true,
    },
    {
      id: "elite",
      name: "Elite",
      price: "$99",
      period: "per month",
      description: "Professional-grade platform with automation",
      icon: Crown,
      priceId: "price_1S8lcPBlj5e71CfEPFxQrEok", // Replace with actual Stripe price ID
      features: [
        "Everything in Pro",
        "Broker integration (TD Ameritrade, IBKR)",
        "Auto-trading capabilities",
        "Liquidity heatmaps",
        "Advanced trade simulator",
        "Custom AI model training",
        "Priority support",
        "API access",
        "White-label options",
      ],
      limitations: [],
      buttonText: !isAuthenticated
        ? "Sign In to Subscribe"
        : user?.plan === "elite"
        ? "Current Plan"
        : "Go Elite",
      buttonVariant:
        user?.plan === "elite" ? ("outline" as const) : ("secondary" as const),
      popular: false,
    },
  ];

  const handleUpgrade = async (plan: (typeof plans)[0]) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      // Redirect to sign in page
      window.location.href = "/signin";
      return;
    }

    // Handle current plan
    if (user.plan === plan.id) {
      toast({
        title: "Current Plan",
        description: `You're already on the ${plan.name} plan.`,
      });
      return;
    }

    // Handle free plan (no payment needed)
    if (plan.id === "free") {
      toast({
        title: "Contact Support",
        description: "Please contact support to downgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    if (!plan.priceId) {
      toast({
        title: "Plan Not Available",
        description: "This plan is not available for subscription.",
        variant: "destructive",
      });
      return;
    }

    setLoadingPlan(plan.id);

    try {
      const data = await createCheckoutSession(
        plan.priceId,
        user.id,
        plan.name.toLowerCase()
      );

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const isLoading = loadingPlan === plan.id;

        return (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <CardDescription className="mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                className={`w-full ${
                  !isAuthenticated && plan.id === "free"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : ""
                }`}
                variant={plan.buttonVariant}
                onClick={() => handleUpgrade(plan)}
                disabled={isLoading || user?.plan === plan.id}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText
                )}
              </Button>

              <div className="space-y-3">
                <div className="text-sm font-medium">Features included:</div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Limitations:
                    </div>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
