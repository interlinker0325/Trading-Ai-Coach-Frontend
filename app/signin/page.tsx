"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { ForgotPasswordModal } from "@/components/forgot-password-modal";
import { AlertCircle, Mail, CheckCircle } from "lucide-react";
import { Lock, Eye, EyeOff, Chrome, TrendingUp, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "none" | "sent" | "verified"
  >("none");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      router.push("/");
      return;
    }

    // Check if user was redirected after email verification
    if (searchParams.get("verified") === "true") {
      setSuccess("Email verified successfully! You can now sign in.");
      setVerificationStatus("verified");
    }
    // Check if user was redirected after signup (verification email sent)
    else if (searchParams.get("verification_sent") === "true") {
      setSuccess(
        "Verification email sent! Please check your email and click the verification link to activate your account."
      );
      setVerificationStatus("sent");
    }
    // Check if user was redirected after password reset
    else if (searchParams.get("password_reset") === "true") {
      setSuccess(
        "Password reset successfully! You can now sign in with your new password."
      );
      setVerificationStatus("none");
      setIsPasswordReset(true);
    }
  }, [searchParams, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await login(email, password, rememberMe);

    if (result.success) {
      setSuccess("Sign in successful!");
      // Wait for authentication state to be properly set
      setTimeout(() => {
        router.replace("/");
      }, 800);
    } else {
      setError(result.error || "Sign in failed. Please try again.");

      // Show resend verification button if error is about email verification
      if (result.error && result.error.includes("verify your email")) {
        setShowResendVerification(true);
      } else {
        setShowResendVerification(false);
      }
    }
  };

  const handleResendVerification = async () => {
    const formData = document.querySelector("form") as HTMLFormElement;
    const email = formData?.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;

    if (!email?.value) {
      setError("Please enter your email address first");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.value }),
        }
      );

      if (response.ok) {
        setSuccess("Verification email sent! Please check your inbox.");
        setShowResendVerification(false);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to send verification email");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background dark:from-black dark:via-gray-900/30 dark:to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Auth Card */}
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">Furu</span>
              <Badge variant="secondary" className="text-xs">
                AI
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your AI financial coach
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              disabled={isLoading}
            >
              <Chrome className="h-4 w-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
                {showResendVerification && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResendVerification}
                    className="w-full text-sm"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </Button>
                )}
              </div>
            )}

            {/* Verification Alert */}
            {verificationStatus === "sent" && (
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Verification email sent!</strong> Please check your
                  email and click the verification link to activate your
                  account. You can sign in after verification.
                </AlertDescription>
              </Alert>
            )}

            {verificationStatus === "verified" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Email verified successfully!</strong> You can now sign
                  in to your account.
                </AlertDescription>
              </Alert>
            )}

            {/* Regular success message for other cases */}
            {success && verificationStatus === "none" && (
              <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <span>{success}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading ||
                  (!!success &&
                    verificationStatus === "none" &&
                    !isPasswordReset)
                }
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-muted-foreground">
              <span>
                Don't have an account?{" "}
                <Link href="/signup">
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Sign up
                  </Button>
                </Link>
              </span>
            </div>

            {/* Footer Links */}
            <div className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <Button variant="link" className="p-0 h-auto text-xs">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button variant="link" className="p-0 h-auto text-xs">
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </div>
  );
}
