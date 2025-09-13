"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventFeed } from "@/components/event-feed"
import { AlertSettings } from "@/components/alert-settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Zap } from "lucide-react"

export default function AlertsPage() {
  const [plan] = useState<"free" | "pro" | "elite">("pro") // Mock user plan

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market Alerts & Events</h1>
          <p className="text-muted-foreground">Stay informed with real-time market events and custom alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          {plan !== "free" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Real-time Updates</span>
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Feed - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <EventFeed plan={plan} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Alert Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Alerts</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today's Events</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">High Priority</span>
                <Badge variant="destructive">3</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Triggers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>AAPL &gt; $190</span>
                  <span className="text-muted-foreground">2m ago</span>
                </div>
                <div className="flex justify-between">
                  <span>BTC Whale Alert</span>
                  <span className="text-muted-foreground">5m ago</span>
                </div>
                <div className="flex justify-between">
                  <span>NVDA Earnings</span>
                  <span className="text-muted-foreground">12m ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Alert Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <AlertSettings plan={plan} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
