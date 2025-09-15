"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Menu,
  X,
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
      <header className="sticky top-0 z-50 w-full border-b bg-black/95 dark:bg-background/95 supports-[backdrop-filter]:bg-black/60 dark:supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Furu+ Logo"
              width={100}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <div className="text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground">
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground hover:bg-white/10 dark:hover:bg-muted/50"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-white text-black dark:bg-primary dark:text-primary-foreground hover:bg-gray-200 dark:hover:bg-primary/90"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-1 sm:space-x-2">
            <div className="text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground">
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground hover:bg-white/10 dark:hover:bg-muted/50"
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
          <div className="md:hidden border-t bg-black/95 dark:bg-background/95">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-sm font-medium text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground transition-colors py-3 px-2 rounded-md hover:bg-white/10 dark:hover:bg-muted/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20 dark:border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground hover:bg-white/10 dark:hover:bg-muted/50"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button
                  className="w-full bg-white text-black dark:bg-primary dark:text-primary-foreground hover:bg-gray-200 dark:hover:bg-primary/90"
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
