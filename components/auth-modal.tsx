"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Chrome,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onModeChange?: (mode: "signin" | "signup") => void;
}

export function AuthModal({
  isOpen,
  onClose,
  mode,
  onModeChange,
}: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    onClose();
  };

  const benefits = [
    "AI-powered market analysis",
    "Real-time trading signals",
    "Multi-asset portfolio tracking",
    "24/7 financial coaching",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Furu</span>
            <Badge variant="secondary" className="text-xs">
              AI
            </Badge>
          </div>
          <DialogTitle className="text-2xl">
            {mode === "signin" ? "Welcome back" : "Start your journey"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to access your AI financial coach"
              : "Join thousands of traders making smarter decisions"}
          </p>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  <span>Please wait...</span>
                </div>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Benefits for Signup */}
          {mode === "signup" && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium">What you'll get:</h4>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <span>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => onModeChange?.("signup")}
                >
                  Sign up
                </Button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => onModeChange?.("signin")}
                >
                  Sign in
                </Button>
              </span>
            )}
          </div>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
