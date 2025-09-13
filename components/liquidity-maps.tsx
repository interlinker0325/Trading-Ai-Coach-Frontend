"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Lock, Layers, BarChart3, Activity, TrendingUp, TrendingDown, Zap } from "lucide-react"

interface LiquidityMapsProps {
  plan: "free" | "pro" | "elite"
}

interface OrderBookLevel {
  price: number
  size: number
  total: number
  percentage: number
}

interface LiquidityZone {
  price: number
  volume: number
  strength: "weak" | "medium" | "strong"
  type: "support" | "resistance"
}

export function LiquidityMaps({ plan }: LiquidityMapsProps) {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [timeframe, setTimeframe] = useState("1m")
  const [loading, setLoading] = useState(false)

  // Mock order book data
  const orderBookData = {
    symbol: selectedSymbol,
    lastPrice: 185.42,
    spread: 0.02,
    spreadPercentage: 0.011,
    bids: [
      { price: 185.4, size: 2500, total: 2500, percentage: 15.2 },
      { price: 185.38, size: 1800, total: 4300, percentage: 26.1 },
      { price: 185.36, size: 3200, total: 7500, percentage: 45.5 },
      { price: 185.34, size: 1200, total: 8700, percentage: 52.7 },
      { price: 185.32, size: 2100, total: 10800, percentage: 65.5 },
      { price: 185.3, size: 1500, total: 12300, percentage: 74.5 },
      { price: 185.28, size: 2800, total: 15100, percentage: 91.5 },
      { price: 185.26, size: 900, total: 16000, percentage: 97.0 },
      { price: 185.24, size: 500, total: 16500, percentage: 100.0 },
    ] as OrderBookLevel[],
    asks: [
      { price: 185.42, size: 1800, total: 1800, percentage: 12.8 },
      { price: 185.44, size: 2200, total: 4000, percentage: 28.4 },
      { price: 185.46, size: 1600, total: 5600, percentage: 39.7 },
      { price: 185.48, size: 2900, total: 8500, percentage: 60.3 },
      { price: 185.5, size: 1400, total: 9900, percentage: 70.2 },
      { price: 185.52, size: 2100, total: 12000, percentage: 85.1 },
      { price: 185.54, size: 1200, total: 13200, percentage: 93.6 },
      { price: 185.56, size: 600, total: 13800, percentage: 97.9 },
      { price: 185.58, size: 300, total: 14100, percentage: 100.0 },
    ] as OrderBookLevel[],
  }

  const liquidityZones: LiquidityZone[] = [
    { price: 185.6, volume: 45000, strength: "strong", type: "resistance" },
    { price: 185.25, volume: 38000, strength: "strong", type: "support" },
    { price: 186.0, volume: 28000, strength: "medium", type: "resistance" },
    { price: 184.8, volume: 32000, strength: "medium", type: "support" },
    { price: 186.5, volume: 15000, strength: "weak", type: "resistance" },
    { price: 184.2, volume: 18000, strength: "weak", type: "support" },
  ]

  const marketDepthMetrics = {
    bidDepth: 16500,
    askDepth: 14100,
    imbalance: 0.17, // (bids - asks) / (bids + asks)
    liquidityScore: 8.2,
    volatilityRisk: "Medium",
    slippageEstimate: {
      "1000": 0.02,
      "5000": 0.08,
      "10000": 0.15,
      "25000": 0.35,
    },
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "weak":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getImbalanceColor = (imbalance: number) => {
    if (Math.abs(imbalance) > 0.2) return "text-red-600"
    if (Math.abs(imbalance) > 0.1) return "text-yellow-600"
    return "text-green-600"
  }

  if (plan === "free") {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Professional Feature</h3>
            <p className="text-muted-foreground">
              Liquidity Maps and Order Book Analysis are available with Pro or Elite plans
            </p>
            <Button>Upgrade to Pro</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="h-5 w-5" />
            <span>Liquidity Analysis Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Symbol</label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AAPL">AAPL</SelectItem>
                  <SelectItem value="TSLA">TSLA</SelectItem>
                  <SelectItem value="NVDA">NVDA</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1m</SelectItem>
                  <SelectItem value="5m">5m</SelectItem>
                  <SelectItem value="15m">15m</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" disabled={loading}>
              <Activity className="h-4 w-4 mr-2" />
              {loading ? "Updating..." : "Real-time"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="orderbook" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orderbook">Order Book</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Zones</TabsTrigger>
          <TabsTrigger value="depth">Market Depth</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="orderbook" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Book Visualization */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Order Book - {selectedSymbol}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Last: ${orderBookData.lastPrice}</Badge>
                      <Badge variant="secondary">Spread: ${orderBookData.spread}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {/* Asks (Sell Orders) */}
                    <div className="space-y-1">
                      {orderBookData.asks
                        .slice()
                        .reverse()
                        .map((ask, index) => (
                          <div key={`ask-${index}`} className="relative flex items-center justify-between p-2 rounded">
                            <div
                              className="absolute inset-0 bg-red-500/10 rounded"
                              style={{ width: `${ask.percentage}%` }}
                            />
                            <div className="relative z-10 flex justify-between w-full">
                              <span className="text-sm text-red-600 font-mono">${ask.price.toFixed(2)}</span>
                              <span className="text-sm font-mono">{ask.size.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground font-mono">
                                {ask.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Spread Indicator */}
                    <div className="flex items-center justify-center py-2 bg-muted/50 rounded">
                      <span className="text-sm font-medium">
                        Spread: ${orderBookData.spread} ({orderBookData.spreadPercentage.toFixed(3)}%)
                      </span>
                    </div>

                    {/* Bids (Buy Orders) */}
                    <div className="space-y-1">
                      {orderBookData.bids.map((bid, index) => (
                        <div key={`bid-${index}`} className="relative flex items-center justify-between p-2 rounded">
                          <div
                            className="absolute inset-0 bg-green-500/10 rounded"
                            style={{ width: `${bid.percentage}%` }}
                          />
                          <div className="relative z-10 flex justify-between w-full">
                            <span className="text-sm text-green-600 font-mono">${bid.price.toFixed(2)}</span>
                            <span className="text-sm font-mono">{bid.size.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground font-mono">
                              {bid.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Book Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Market Depth</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bid Depth</span>
                      <span className="text-sm font-medium text-green-600">
                        {marketDepthMetrics.bidDepth.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ask Depth</span>
                      <span className="text-sm font-medium text-red-600">
                        {marketDepthMetrics.askDepth.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Imbalance</span>
                      <span className={`text-sm font-medium ${getImbalanceColor(marketDepthMetrics.imbalance)}`}>
                        {(marketDepthMetrics.imbalance * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Liquidity Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{marketDepthMetrics.liquidityScore}/10</span>
                      <Badge variant="secondary">High Liquidity</Badge>
                    </div>
                    <Progress value={marketDepthMetrics.liquidityScore * 10} className="h-2" />
                    <div className="text-xs text-muted-foreground">Based on depth, spread, and volume</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Slippage Estimates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(marketDepthMetrics.slippageEstimate).map(([size, slippage]) => (
                      <div key={size} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {Number.parseInt(size).toLocaleString()} shares
                        </span>
                        <span className="text-sm font-medium">{(slippage as number).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Liquidity Zones - {selectedSymbol}</span>
              </CardTitle>
              <CardDescription>Key support and resistance levels based on order flow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liquidityZones
                  .sort((a, b) => b.price - a.price)
                  .map((zone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStrengthColor(zone.strength)}`} />
                        <div>
                          <div className="font-medium">${zone.price.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {zone.strength} {zone.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{zone.volume.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Volume</div>
                      </div>
                      <div className="flex items-center">
                        {zone.type === "resistance" ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Depth Chart</CardTitle>
                <CardDescription>Visualizing market depth and liquidity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Interactive depth chart</p>
                    <p className="text-xs text-muted-foreground">Real-time order book visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume Profile</CardTitle>
                <CardDescription>Price levels with highest trading activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { price: 185.42, volume: 125000, percentage: 100 },
                    { price: 185.25, volume: 98000, percentage: 78 },
                    { price: 185.6, volume: 87000, percentage: 70 },
                    { price: 184.8, volume: 76000, percentage: 61 },
                    { price: 186.0, volume: 65000, percentage: 52 },
                  ].map((level, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">${level.price.toFixed(2)}</span>
                        <span>{level.volume.toLocaleString()}</span>
                      </div>
                      <Progress value={level.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Liquidity Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Liquidity Score</div>
                    <div className="text-2xl font-bold text-green-600">{marketDepthMetrics.liquidityScore}/10</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Volatility Risk</div>
                    <div className="text-2xl font-bold">{marketDepthMetrics.volatilityRisk}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Market Impact (10K shares)</span>
                    <Badge variant="secondary">0.15%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Execution Quality</span>
                    <Badge variant="secondary">Excellent</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Best Execution Time</span>
                    <Badge variant="outline">London Session</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-500/10 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      Optimal Entry
                    </Badge>
                  </div>
                  <p className="text-sm">Strong support at $185.25 with high liquidity</p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      Caution Zone
                    </Badge>
                  </div>
                  <p className="text-sm">Resistance at $185.60 may cause slippage</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      Order Strategy
                    </Badge>
                  </div>
                  <p className="text-sm">Use limit orders near bid/ask for better fills</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
