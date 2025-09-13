"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, PieChart, AlertTriangle, Lightbulb, History, BookOpen, Settings } from "lucide-react"

interface CoachSidebarProps {
  plan: "free" | "pro" | "elite"
}

export function CoachSidebar({ plan }: CoachSidebarProps) {
  const [activeSection, setActiveSection] = useState("chat")

  const quickActions = [
    {
      id: "portfolio-analysis",
      title: "Analyze My Portfolio",
      description: "Get AI insights on your holdings",
      icon: PieChart,
      premium: false,
    },
    {
      id: "market-outlook",
      title: "Market Outlook",
      description: "Today's market analysis",
      icon: TrendingUp,
      premium: false,
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Evaluate portfolio risk",
      icon: AlertTriangle,
      premium: plan === "free",
    },
    {
      id: "opportunities",
      title: "Find Opportunities",
      description: "Discover investment ideas",
      icon: Lightbulb,
      premium: plan === "free",
    },
  ]

  const recentTopics = [
    "NVDA earnings impact",
    "Fed rate decision analysis",
    "Tech sector rotation",
    "Crypto market trends",
    "Portfolio rebalancing",
  ]

  const learningResources = [
    "Options Trading Basics",
    "Risk Management 101",
    "Technical Analysis Guide",
    "Market Psychology",
    "Portfolio Theory",
  ]

  return (
    <div className="w-80 border-r bg-card">
      <div className="p-4 border-b">
        <h3 className="font-semibold">AI Coach</h3>
        <p className="text-sm text-muted-foreground">Intelligent financial guidance</p>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Quick Actions</h4>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3"
                    disabled={action.premium}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{action.title}</span>
                          {action.premium && (
                            <Badge variant="outline" className="text-xs">
                              Pro
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Recent Topics */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Recent Topics</span>
            </h4>
            <div className="space-y-1">
              {recentTopics.slice(0, plan === "free" ? 2 : 5).map((topic, index) => (
                <Button key={index} variant="ghost" className="w-full justify-start text-xs h-8">
                  {topic}
                </Button>
              ))}
              {plan === "free" && (
                <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">Upgrade to see full history</div>
              )}
            </div>
          </div>

          {/* Learning Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Learning Hub</span>
            </h4>
            <div className="space-y-1">
              {learningResources.slice(0, plan === "free" ? 2 : 5).map((resource, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-xs h-8"
                  disabled={plan === "free" && index >= 2}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{resource}</span>
                    {plan === "free" && index >= 2 && (
                      <Badge variant="outline" className="text-xs">
                        Pro
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* AI Coach Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Your AI Coach Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Queries Today</span>
                <span className="font-medium">{plan === "free" ? "3/5" : "47"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy Rate</span>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recommendations</span>
                <span className="font-medium">{plan === "free" ? "12" : "156"}</span>
              </div>
              {plan === "free" && (
                <Button size="sm" className="w-full mt-3">
                  Upgrade for More
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Coach Settings
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
