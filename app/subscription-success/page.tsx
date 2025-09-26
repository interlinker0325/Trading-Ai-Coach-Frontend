"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, refreshUser, isLoading } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const sessionId = searchParams.get("session_id");
  const upgrade = searchParams.get("upgrade");

  useEffect(() => {
    const handleSubscriptionSuccess = async () => {
      if (!sessionId || upgrade !== "success") {
        setStatus("error");
        setMessage("Invalid subscription session");
        return;
      }

      if (!isAuthenticated || !user) {
        setStatus("error");
        setMessage("Please sign in to complete your subscription");
        return;
      }

      try {
        // Refresh user data to get updated plan
        await refreshUser();

        setStatus("success");
        setMessage("Your subscription has been successfully activated!");

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (error) {
        console.error("Error refreshing user data:", error);
        setStatus("error");
        setMessage(
          "Failed to update your subscription. Please contact support."
        );
      }
    };

    // Wait for authentication to complete before checking status
    if (isLoading) {
      // Still loading auth state - keep loading status
      return;
    }

    // Only run if we have the required parameters and user is authenticated
    if (sessionId && upgrade === "success" && isAuthenticated && user) {
      handleSubscriptionSuccess();
    } else if (sessionId && upgrade === "success") {
      // We have valid session but not authenticated yet - keep loading
      setStatus("loading");
      setMessage("Processing your subscription...");
    } else {
      // Missing required parameters
      setStatus("error");
      setMessage("Invalid subscription session");
    }
  }, [
    sessionId,
    upgrade,
    isAuthenticated,
    user,
    isLoading,
    refreshUser,
    router,
  ]);

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{message || "Loading..."}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "success" && (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          )}
          {status === "error" && (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          )}
          <CardTitle className="text-2xl">
            {status === "success"
              ? "Subscription Successful!"
              : "Subscription Error"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your account has been upgraded successfully. You now have access
                to all premium features!
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/pricing")}
              className="w-full"
            >
              View Plans
            </Button>
          </div>

          {status === "success" && (
            <p className="text-sm text-muted-foreground text-center">
              Redirecting to dashboard in 3 seconds...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
