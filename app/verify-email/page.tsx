"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      setError("No verification token provided");
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email verified successfully!");

        // Redirect to signin page after 3 seconds
        setTimeout(() => {
          router.push("/signin?verified=true");
        }, 3000);
      } else {
        setStatus("error");
        setMessage("Verification failed");
        setError(data.detail || "An error occurred during verification");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Verification failed");
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">
            {status === "verifying" && (
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-16 w-16 text-green-600" />
            )}
            {status === "error" && (
              <XCircle className="h-16 w-16 text-red-600" />
            )}
          </div>

          {/* Status Message */}
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">{message}</p>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          {/* Success State */}
          {status === "success" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Redirecting you to sign in...
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 text-blue-600">
                  <span className="text-sm">Please wait</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="space-y-4">
              <div className="text-center">
                <Button asChild className="w-full">
                  <Link href="/signin">
                    Go to Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="text-center">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/signup">Try Signing Up Again</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Verifying State */}
          {status === "verifying" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
