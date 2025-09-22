"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
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
  DollarSign,
  User,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserMenu &&
        !(event.target as Element).closest(".user-menu-container")
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const handleSignOut = () => {
    logout();
    setShowUserMenu(false);
    // Redirect to home page
    window.location.href = "/";
  };

  const navigation = [
    { name: "Charts", href: "/charts", icon: BarChart3 },
    { name: "Screener", href: "/screener", icon: Zap },
    { name: "Alerts", href: "/alerts", icon: Shield },
    { name: "Liquidity", href: "/liquidity", icon: Target },
    { name: "Education", href: "/education", icon: BookOpen },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "AI Coach", href: "#ai-coach", icon: Brain },
    { name: "Community", href: "#community", icon: Users },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-black/75 dark:bg-black/75 supports-[backdrop-filter]:bg-black/60 dark:supports-[backdrop-filter]:bg-black/60">
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

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground hover:bg-white/10 dark:hover:bg-muted/50"
                >
                  <Bell className="h-4 w-4" />
                </Button>

                {/* User Profile Dropdown */}
                <div className="relative user-menu-container">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground hover:bg-white/10 dark:hover:bg-muted/50"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user?.full_name || user?.email || "User"}
                  </Button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium">
                          {user?.full_name || "User"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            {user?.plan?.toUpperCase() || "FREE"}
                          </span>
                          {user?.is_verified ? (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                              ⚠ Unverified
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : isLoading ? (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-16 bg-white/20" />
                <Skeleton className="h-8 w-24 bg-white/20" />
              </div>
            ) : (
              <>
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
              </>
            )}
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
          <div className="md:hidden border-t bg-black/95 dark:bg-black/95">
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
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="px-2 py-3 text-sm text-white dark:text-foreground border-b border-white/20 dark:border-border">
                      <div className="font-medium">
                        {user?.full_name || "User"}
                      </div>
                      <div className="text-xs text-gray-300 dark:text-muted-foreground">
                        {user?.email}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                          {user?.plan?.toUpperCase() || "FREE"}
                        </span>
                        {user?.is_verified ? (
                          <span className="text-xs text-green-400">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="text-xs text-yellow-400">
                            ⚠ Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* User Actions */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white dark:text-foreground hover:text-gray-300 dark:hover:text-muted-foreground hover:bg-white/10 dark:hover:bg-muted/50"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full bg-white/20" />
                    <Skeleton className="h-10 w-full bg-white/20" />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
