"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, TrendingUp, TrendingDown, Zap, BarChart3 } from "lucide-react"

interface OrderFlowAnalysisProps {
  plan: "free" | "pro" | "elite"
}

export function OrderFlowAnalysis({ plan }: OrderFlowAnalysisProps) {
  const [timeframe, setTimeframe] = useState("5m")

  const orderFlowData = {
    symbol: "AAPL",
    currentPrice: 185.42,
    orderFlow: {
      buyVolume: 2450000,
      sellVolume: 1890000,
      netFlow: 560000,
      flowRatio: 1.3,
      aggressiveBuys: 1680000,
      aggressiveSells: 1320000,
    },
    volumeProfile: [
      { price: 185.6, volume: 125000, type: "resistance", strength: 85 },
      { price: 185.42, volume: 180000, type: "current", strength: 100 },
      { price: 185.25, volume: 145000, type: "support", strength: 90 },
      { price: 185.0, volume: 98000, type: "support", strength: 65 },
      { price: 184.8, volume: 87000, type: "support", strength: 55 },
    ],
    institutionalFlow: {
      darkPoolVolume: 890000,
      blockTrades: 45,
      averageBlockSize: 19800,
      institutionalBias: "bullish",
      smartMoneyFlow: 1250000,
    },
    microstructure: {
      tickDirection: "uptick",
      lastTickSize: 0.01,
      bidAskSpread: 0.02,
      effectiveSpread: 0.015,
      priceImpact: 0.008,
      realizationRatio: 0.75,
    },
  }

  const getFlowColor = (flow: number) => {
    if (flow > 0) return "text-green-600"
    if (flow < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case "bullish":
        return "text-green-600"
      case "bearish":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Net Flow</span>
            </div>
            <div className={`text-2xl font-bold ${getFlowColor(orderFlowData.orderFlow.netFlow)}`}>
              {orderFlowData.orderFlow.netFlow > 0 ? "+" : ""}
              {orderFlowData.orderFlow.netFlow.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Ratio: {orderFlowData.orderFlow.flowRatio.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Aggressive Buys</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {orderFlowData.orderFlow.aggressiveBuys.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Market orders</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Aggressive Sells</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {orderFlowData.orderFlow.aggressiveSells.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Market orders</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Smart Money</span>
            </div>
            <div className={`text-2xl font-bold ${getBiasColor(orderFlowData.institutionalFlow.institutionalBias)}`}>
              {orderFlowData.institutionalFlow.smartMoneyFlow.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground capitalize">
              {orderFlowData.institutionalFlow.institutionalBias} bias
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="flow" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flow">Order Flow</TabsTrigger>
          <TabsTrigger value="volume">Volume Profile</TabsTrigger>
          <TabsTrigger value="institutional">Institutional</TabsTrigger>
          <TabsTrigger value="microstructure">Microstructure</TabsTrigger>
        </TabsList>

        <TabsContent value="flow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Order Flow</CardTitle>
                <CardDescription>Buy vs Sell pressure analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Buy Volume</span>
                    <span className="text-sm font-medium text-green-600">
                      {orderFlowData.orderFlow.buyVolume.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={
                      (orderFlowData.orderFlow.buyVolume /
                        (orderFlowData.orderFlow.buyVolume + orderFlowData.orderFlow.sellVolume)) *
                      100
                    }
                    className="h-3"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sell Volume</span>
                    <span className="text-sm font-medium text-red-600">
                      {orderFlowData.orderFlow.sellVolume.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={
                      (orderFlowData.orderFlow.sellVolume /
                        (orderFlowData.orderFlow.buyVolume + orderFlowData.orderFlow.sellVolume)) *
                      100
                    }
                    className="h-3"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Net Flow</span>
                    <Badge variant={orderFlowData.orderFlow.netFlow > 0 ? "secondary" : "destructive"}>
                      {orderFlowData.orderFlow.netFlow > 0 ? "Bullish" : "Bearish"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Momentum</CardTitle>
                <CardDescription>Directional flow strength over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Flow momentum chart</p>
                    <p className="text-xs text-muted-foreground">Real-time directional analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="volume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Volume Profile Analysis</CardTitle>
              <CardDescription>Price levels with highest trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderFlowData.volumeProfile.map((level, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">${level.price.toFixed(2)}</span>
                        <Badge
                          variant={
                            level.type === "resistance"
                              ? "destructive"
                              : level.type === "support"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {level.type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{level.volume.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Strength: {level.strength}%</div>
                      </div>
                    </div>
                    <Progress value={level.strength} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institutional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dark Pool Activity</CardTitle>
                <CardDescription>Institutional trading patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Dark Pool Volume</div>
                    <div className="text-xl font-bold">
                      {orderFlowData.institutionalFlow.darkPoolVolume.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Block Trades</div>
                    <div className="text-xl font-bold">{orderFlowData.institutionalFlow.blockTrades}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Block Size</span>
                    <span className="text-sm font-medium">
                      {orderFlowData.institutionalFlow.averageBlockSize.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Institutional Bias</span>
                    <Badge
                      variant={
                        orderFlowData.institutionalFlow.institutionalBias === "bullish" ? "secondary" : "destructive"
                      }
                      className="capitalize"
                    >
                      {orderFlowData.institutionalFlow.institutionalBias}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Money Indicators</CardTitle>
                <CardDescription>Professional trader activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Smart Money Flow</span>
                      <Badge variant="secondary">Strong</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Large institutional orders detected</div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Accumulation Pattern</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Consistent buying at support levels</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="microstructure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Microstructure</CardTitle>
                <CardDescription>Detailed execution metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Bid-Ask Spread</div>
                    <div className="text-xl font-bold">${orderFlowData.microstructure.bidAskSpread.toFixed(3)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Effective Spread</div>
                    <div className="text-xl font-bold">${orderFlowData.microstructure.effectiveSpread.toFixed(3)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Price Impact</div>
                    <div className="text-xl font-bold">
                      {(orderFlowData.microstructure.priceImpact * 100).toFixed(3)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Realization Ratio</div>
                    <div className="text-xl font-bold">
                      {(orderFlowData.microstructure.realizationRatio * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execution Quality</CardTitle>
                <CardDescription>Trade execution analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tick Direction</span>
                    <Badge
                      variant={orderFlowData.microstructure.tickDirection === "uptick" ? "secondary" : "destructive"}
                    >
                      {orderFlowData.microstructure.tickDirection}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Tick Size</span>
                    <span className="text-sm font-medium">${orderFlowData.microstructure.lastTickSize.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Execution Quality</span>
                    <Badge variant="secondary">Excellent</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
