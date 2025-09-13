"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Menu,
  X,
  TrendingUp,
  BarChart3,
  Brain,
  Shield,
  Zap,
  Users,
  BookOpen,
  Target,
} from "lucide-react";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Charts", href: "/charts", icon: BarChart3 },
    { name: "Screener", href: "/screener", icon: Zap },
    { name: "Alerts", href: "/alerts", icon: Shield },
    { name: "Liquidity", href: "/liquidity", icon: Target },
    { name: "Education", href: "/education", icon: BookOpen },
    { name: "AI Coach", href: "#ai-coach", icon: Brain },
    { name: "Community", href: "#community", icon: Users },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold">Furu</span>
            <Badge variant="secondary" className="text-xs">
              AI
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-3 px-2 rounded-md hover:bg-muted/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button
                  className="w-full"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
