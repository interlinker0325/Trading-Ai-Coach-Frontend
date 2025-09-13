import { AICoachInterface } from "@/components/ai-coach-interface"
import { CoachSidebar } from "@/components/coach-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function CoachPage() {
  // Mock user data - in real app this would come from auth/database
  const user = {
    name: "Alex Thompson",
    email: "alex@example.com",
    plan: "pro", // free, pro, elite
    avatar: "/professional-avatar.png",
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <CoachSidebar plan={user.plan} />

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col">
          <AICoachInterface plan={user.plan} />
        </div>
      </div>
    </div>
  )
}
