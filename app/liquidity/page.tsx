"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LiquidityMaps } from "@/components/liquidity-maps"
import { OrderFlowAnalysis } from "@/components/order-flow-analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layers, Activity, BarChart3 } from "lucide-react"

export default function LiquidityPage() {
  const [plan] = useState<"free" | "pro" | "elite">("pro") // Mock user plan

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Liquidity Analysis</h1>
          <p className="text-muted-foreground">Advanced order book analysis and liquidity mapping</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>Real-time Data</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Market Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Markets</span>
              <Badge variant="secondary">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High Liquidity</span>
              <Badge variant="secondary">8</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Alerts Triggered</span>
              <Badge variant="destructive">3</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Order Flow Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Net Flow</span>
              <Badge variant="secondary">+$2.4M</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dark Pool Activity</span>
              <Badge variant="outline">High</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Institutional Bias</span>
              <Badge variant="secondary">Bullish</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Feed</span>
              <Badge variant="secondary">Live</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Latency</span>
              <Badge variant="outline">2ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Updates/sec</span>
              <Badge variant="secondary">1,247</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="liquidity" className="w-full">
        <TabsList>
          <TabsTrigger value="liquidity" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Liquidity Maps</span>
          </TabsTrigger>
          <TabsTrigger value="orderflow" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Order Flow</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liquidity" className="mt-6">
          <LiquidityMaps plan={plan} />
        </TabsContent>

        <TabsContent value="orderflow" className="mt-6">
          <OrderFlowAnalysis plan={plan} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
