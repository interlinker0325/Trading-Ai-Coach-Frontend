"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Settings,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPortalSession } from "@/lib/stripe";

interface SubscriptionManagementProps {
  user: {
    plan: "free" | "pro" | "elite";
    subscriptionStatus?: "active" | "canceled" | "past_due" | "incomplete";
    currentPeriodEnd?: string;
    customerId?: string;
    nextBillingAmount?: number;
  };
}

export function SubscriptionManagement({ user }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const planDetails = {
    free: {
      name: "Free Plan",
      price: "$0",
      color: "bg-muted text-muted-foreground",
    },
    pro: {
      name: "Pro Plan",
      price: "$29/month",
      color: "bg-secondary text-secondary-foreground",
    },
    elite: {
      name: "Elite Plan",
      price: "$99/month",
      color: "bg-primary text-primary-foreground",
    },
  };

  const statusDetails = {
    active: {
      label: "Active",
      color: "bg-green-500/10 text-green-700 border-green-200",
      icon: CheckCircle,
    },
    canceled: {
      label: "Canceled",
      color: "bg-red-500/10 text-red-700 border-red-200",
      icon: AlertTriangle,
    },
    past_due: {
      label: "Past Due",
      color: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
      icon: AlertTriangle,
    },
    incomplete: {
      label: "Incomplete",
      color: "bg-orange-500/10 text-orange-700 border-orange-200",
      icon: AlertTriangle,
    },
  };

  const handleManageSubscription = async () => {
    if (!user.customerId) {
      toast({
        title: "Error",
        description: "No subscription found to manage.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await createPortalSession(user.customerId);

      // Redirect to Stripe Customer Portal
      if (data.url) {
        router.push(data.url);
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      toast({
        title: "Error",
        description:
          "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = planDetails[user.plan];
  const currentStatus = user.subscriptionStatus
    ? statusDetails[user.subscriptionStatus]
    : null;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Current Subscription</span>
          </CardTitle>
          <CardDescription>Manage your Furu App subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge className={currentPlan.color}>{currentPlan.name}</Badge>
                {currentStatus && (
                  <Badge className={currentStatus.color}>
                    <currentStatus.icon className="mr-1 h-3 w-3" />
                    {currentStatus.label}
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold">{currentPlan.price}</div>
            </div>
            {user.plan !== "free" && (
              <Button
                onClick={handleManageSubscription}
                disabled={isLoading}
                variant="outline"
              >
                <Settings className="mr-2 h-4 w-4" />
                {isLoading ? "Loading..." : "Manage Subscription"}
              </Button>
            )}
          </div>

          {user.plan !== "free" && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.currentPeriodEnd && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">
                        Next billing date
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.currentPeriodEnd).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                {user.nextBillingAmount && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">
                        Next billing amount
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${user.nextBillingAmount}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your past invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.plan === "free" ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No billing history for free plan
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Mock billing history - in real app, fetch from Stripe */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Pro Plan - Monthly</div>
                  <div className="text-sm text-muted-foreground">
                    Dec 1, 2024
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$29.00</div>
                  <Badge variant="secondary" className="text-xs">
                    Paid
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Pro Plan - Monthly</div>
                  <div className="text-sm text-muted-foreground">
                    Nov 1, 2024
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">$29.00</div>
                  <Badge variant="secondary" className="text-xs">
                    Paid
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                View All Invoices
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>
            What's included in your current plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {user.plan === "free" && (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">5 AI queries per day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Delayed market data (15 min)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Basic portfolio tracking</span>
                </div>
              </>
            )}
            {user.plan === "pro" && (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Unlimited AI queries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Real-time market data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Advanced portfolio analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Email & Telegram alerts</span>
                </div>
              </>
            )}
            {user.plan === "elite" && (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Everything in Pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Broker integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Auto-trading capabilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm">Priority support</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
