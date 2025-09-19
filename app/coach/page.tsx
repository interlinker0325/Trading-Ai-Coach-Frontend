"use client";

import { useAuth } from "@/contexts/auth-context";
import { AICoachInterface } from "@/components/ai-coach-interface";
import { CoachSidebar } from "@/components/coach-sidebar";

export default function CoachPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to access the AI coach
          </h1>
          <a href="/signin" className="text-primary hover:underline">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <CoachSidebar plan={user?.plan || "free"} />

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col">
          <AICoachInterface plan={user?.plan || "free"} />
        </div>
      </div>
    </div>
  );
}
