"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { BarChart3, PieChart, Target, Lock, TrendingUp, Shield, Zap, DollarSign } from "lucide-react"

interface PortfolioAnalyticsProps {
  plan: "free" | "pro" | "elite"
}

export function PortfolioAnalytics({ plan }: PortfolioAnalyticsProps) {
  const [timePeriod, setTimePeriod] = useState("1Y")
  const [assetFilter, setAssetFilter] = useState("all")

  const analytics = {
    totalValue: 125750.42,
    totalReturn: 18.7,
    totalReturnValue: 19750.42,
    assetAllocation: [
      { type: "Stocks", value: 75450.25, percentage: 60.0, target: 65.0, return: 22.3 },
      { type: "Crypto", value: 25150.08, percentage: 20.0, target: 15.0, return: 45.2 },
      { type: "ETFs", value: 18825.06, percentage: 15.0, target: 15.0, return: 12.1 },
      { type: "Options", value: 3768.51, percentage: 3.0, target: 3.0, return: 8.7 },
      { type: "Forex", value: 1256.26, percentage: 1.0, target: 1.0, return: 5.4 },
      { type: "Commodities", value: 1300.26, percentage: 1.0, target: 1.0, return: 15.8 },
    ],
    sectorAllocation: [
      { sector: "Technology", percentage: 32.0, target: 25.0, value: 40240.13 },
      { sector: "Cryptocurrency", percentage: 20.0, target: 15.0, value: 25150.08 },
      { sector: "ETF", percentage: 15.0, target: 15.0, value: 18825.06 },
      { sector: "Consumer Discretionary", percentage: 11.9, target: 20.0, value: 14964.3 },
      { sector: "Healthcare", percentage: 8.5, target: 10.0, value: 10688.79 },
      { sector: "Financials", percentage: 7.2, target: 8.0, value: 9054.03 },
      { sector: "Energy", percentage: 3.4, target: 5.0, value: 4275.51 },
      { sector: "Commodities", percentage: 2.0, target: 2.0, value: 2515.01 },
    ],
    riskMetrics: {
      beta: 1.24,
      sharpeRatio: 1.67,
      volatility: 18.5,
      maxDrawdown: -12.3,
      var95: -4.2,
      sortino: 2.1,
      calmar: 1.52,
      informationRatio: 0.85,
      trackingError: 8.2,
    },
    performanceMetrics: {
      totalReturn: 18.7,
      annualizedReturn: 16.2,
      monthlyReturn: 1.3,
      winRate: 68.5,
      profitFactor: 2.4,
      maxConsecutiveWins: 7,
      maxConsecutiveLosses: 3,
      averageWin: 4.2,
      averageLoss: -2.1,
    },
    correlationMatrix: [
      { asset1: "AAPL", asset2: "NVDA", correlation: 0.78, risk: "High" },
      { asset1: "AAPL", asset2: "TSLA", correlation: 0.45, risk: "Medium" },
      { asset1: "NVDA", asset2: "TSLA", correlation: 0.52, risk: "Medium" },
      { asset1: "BTC", asset2: "TSLA", correlation: 0.31, risk: "Low" },
      { asset1: "BTC", asset2: "ETH", correlation: 0.89, risk: "High" },
      { asset1: "SPY", asset2: "QQQ", correlation: 0.92, risk: "High" },
    ],
    diversificationScore: 7.2,
    riskScore: 6.8,
    recommendations: [
      {
        type: "Rebalancing",
        message: "Consider reducing tech exposure by 7% to meet target allocation",
        priority: "High",
        impact: "Risk Reduction",
        action: "Sell $2,800 in tech stocks",
      },
      {
        type: "Diversification",
        message: "Add healthcare positions to improve sector balance",
        priority: "Medium",
        impact: "Better Diversification",
        action: "Buy $1,500 in healthcare ETF",
      },
      {
        type: "Risk Management",
        message: "High correlation between AAPL and NVDA detected",
        priority: "Medium",
        impact: "Correlation Risk",
        action: "Consider reducing one position",
      },
      {
        type: "Opportunity",
        message: "Energy sector underweight - consider adding exposure",
        priority: "Low",
        impact: "Sector Balance",
        action: "Add $2,100 in energy stocks",
      },
    ],
    topHoldings: [
      { symbol: "AAPL", name: "Apple Inc.", value: 15680.25, percentage: 12.5, return: 18.2, risk: "Medium" },
      { symbol: "BTC", name: "Bitcoin", value: 12575.04, percentage: 10.0, return: 52.1, risk: "High" },
      { symbol: "NVDA", name: "NVIDIA Corp.", value: 11317.54, percentage: 9.0, return: 89.3, risk: "High" },
      { symbol: "SPY", name: "SPDR S&P 500", value: 9460.03, percentage: 7.5, return: 12.1, risk: "Low" },
      { symbol: "TSLA", name: "Tesla Inc.", value: 8818.03, percentage: 7.0, return: 15.7, risk: "High" },
    ],
  }

  const getSectorColor = (sector: string) => {
    const colors = {
      Technology: "bg-blue-500",
      Cryptocurrency: "bg-orange-500",
      ETF: "bg-green-500",
      "Consumer Discretionary": "bg-purple-500",
      Healthcare: "bg-red-500",
      Financials: "bg-indigo-500",
      Energy: "bg-yellow-500",
      Commodities: "bg-amber-500",
    }
    return colors[sector as keyof typeof colors] || "bg-gray-500"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-700 border-red-200"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      case "Low":
        return "bg-green-500/10 text-green-700 border-green-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (plan === "free") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Asset Allocation</span>
            </CardTitle>
            <CardDescription>Your portfolio distribution by asset type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.assetAllocation.slice(0, 3).map((asset) => (
                <div key={asset.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{asset.type}</span>
                    <span>{asset.percentage}%</span>
                  </div>
                  <Progress value={asset.percentage} className="h-2" />
                </div>
              ))}
              <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg border border-dashed">
                <div className="text-center space-y-2">
                  <Lock className="h-6 w-6 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Upgrade to see full analytics</p>
                  <Button size="sm">Upgrade to Pro</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Risk Metrics</span>
            </CardTitle>
            <CardDescription>Portfolio risk analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg border border-dashed">
              <div className="text-center space-y-2">
                <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Risk analytics available in Pro plan</p>
                <Button size="sm">Upgrade Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Value</span>
            </div>
            <div className="text-2xl font-bold">${analytics.totalValue.toLocaleString()}</div>
            <div className="text-sm text-green-600">
              +${analytics.totalReturnValue.toLocaleString()} ({analytics.totalReturn}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Risk Score</span>
            </div>
            <div className="text-2xl font-bold">{analytics.riskScore}/10</div>
            <div className="text-sm text-muted-foreground">Moderate Risk</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Diversification</span>
            </div>
            <div className="text-2xl font-bold">{analytics.diversificationScore}/10</div>
            <div className="text-sm text-muted-foreground">Well Diversified</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="space-y-2">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="ALL">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assetFilter} onValueChange={setAssetFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="stocks">Stocks Only</SelectItem>
                  <SelectItem value="crypto">Crypto Only</SelectItem>
                  <SelectItem value="etfs">ETFs Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="allocation" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="holdings">Top Holdings</TabsTrigger>
          <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Asset Allocation</span>
                </CardTitle>
                <CardDescription>Distribution across asset classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.assetAllocation.map((asset) => (
                    <div key={asset.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{asset.type}</span>
                        <div className="flex items-center space-x-2">
                          <span>${asset.value.toLocaleString()}</span>
                          <Badge variant="secondary" className="text-xs">
                            {asset.percentage}%
                          </Badge>
                          <span className={`text-xs ${asset.return > 0 ? "text-green-600" : "text-red-600"}`}>
                            {asset.return > 0 ? "+" : ""}
                            {asset.return}%
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={asset.percentage} className="h-3" />
                        <div
                          className="absolute top-0 h-3 w-1 bg-destructive rounded"
                          style={{ left: `${asset.target}%` }}
                        />
                      </div>
                      {Math.abs(asset.percentage - asset.target) > 2 && (
                        <div className="text-xs text-muted-foreground">
                          {asset.percentage > asset.target ? "Overweight" : "Underweight"} by{" "}
                          {Math.abs(asset.percentage - asset.target).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation vs Target</CardTitle>
                <CardDescription>Compare current allocation with targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.sectorAllocation.map((sector) => (
                    <div key={sector.sector} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{sector.sector}</span>
                        <div className="flex items-center space-x-2">
                          <span>${sector.value.toLocaleString()}</span>
                          <span>Current: {sector.percentage}%</span>
                          <span className="text-muted-foreground">Target: {sector.target}%</span>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={sector.percentage} className="h-3" />
                        <div
                          className="absolute top-0 h-3 w-1 bg-destructive rounded"
                          style={{ left: `${sector.target}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
                <CardDescription>Portfolio performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Return</div>
                    <div className="text-2xl font-bold text-green-600">{analytics.performanceMetrics.totalReturn}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Annualized Return</div>
                    <div className="text-2xl font-bold">{analytics.performanceMetrics.annualizedReturn}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                    <div className="text-2xl font-bold">{analytics.performanceMetrics.winRate}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Profit Factor</div>
                    <div className="text-2xl font-bold">{analytics.performanceMetrics.profitFactor}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Statistics</CardTitle>
                <CardDescription>Win/loss analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Max Consecutive Wins</span>
                    <Badge variant="secondary">{analytics.performanceMetrics.maxConsecutiveWins}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Max Consecutive Losses</span>
                    <Badge variant="destructive">{analytics.performanceMetrics.maxConsecutiveLosses}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Win</span>
                    <span className="text-sm text-green-600">+{analytics.performanceMetrics.averageWin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Loss</span>
                    <span className="text-sm text-red-600">{analytics.performanceMetrics.averageLoss}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Risk Metrics</span>
                </CardTitle>
                <CardDescription>Comprehensive risk analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Beta</div>
                    <div className="text-2xl font-bold">{analytics.riskMetrics.beta}</div>
                    <div className="text-xs text-muted-foreground">vs Market</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                    <div className="text-2xl font-bold text-green-600">{analytics.riskMetrics.sharpeRatio}</div>
                    <div className="text-xs text-muted-foreground">Risk-adjusted return</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Sortino Ratio</div>
                    <div className="text-2xl font-bold">{analytics.riskMetrics.sortino}</div>
                    <div className="text-xs text-muted-foreground">Downside risk</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Calmar Ratio</div>
                    <div className="text-2xl font-bold">{analytics.riskMetrics.calmar}</div>
                    <div className="text-xs text-muted-foreground">Return/drawdown</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Volatility</div>
                    <div className="text-2xl font-bold">{analytics.riskMetrics.volatility}%</div>
                    <div className="text-xs text-muted-foreground">Annual</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Max Drawdown</div>
                    <div className="text-2xl font-bold text-red-600">{analytics.riskMetrics.maxDrawdown}%</div>
                    <div className="text-xs text-muted-foreground">Worst decline</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Correlation Analysis</span>
                </CardTitle>
                <CardDescription>Asset correlation matrix</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.correlationMatrix.map((corr, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm">
                        {corr.asset1} × {corr.asset2}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={Math.abs(corr.correlation) * 100} className="w-16 h-2" />
                        <span className={`text-sm font-medium ${getRiskColor(corr.risk)}`}>
                          {corr.correlation.toFixed(2)}
                        </span>
                        <Badge
                          variant={
                            corr.risk === "High" ? "destructive" : corr.risk === "Medium" ? "secondary" : "outline"
                          }
                          className="text-xs"
                        >
                          {corr.risk}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground mt-2">
                    High correlation (&gt;0.7) indicates similar price movements and concentration risk
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="holdings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Holdings Analysis</CardTitle>
              <CardDescription>Your largest positions and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topHoldings.map((holding, index) => (
                  <div key={holding.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                      <div>
                        <div className="font-medium">{holding.symbol}</div>
                        <div className="text-sm text-muted-foreground">{holding.name}</div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-medium">${holding.value.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{holding.percentage}% of portfolio</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className={`font-medium ${holding.return > 0 ? "text-green-600" : "text-red-600"}`}>
                        {holding.return > 0 ? "+" : ""}
                        {holding.return}%
                      </div>
                      <Badge
                        variant={
                          holding.risk === "High" ? "destructive" : holding.risk === "Medium" ? "secondary" : "outline"
                        }
                        className="text-xs"
                      >
                        {holding.risk} Risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>AI-Powered Recommendations</span>
              </CardTitle>
              <CardDescription>Personalized suggestions to optimize your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                        <Badge
                          variant={
                            rec.priority === "High"
                              ? "destructive"
                              : rec.priority === "Medium"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {rec.priority} Priority
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {rec.impact}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{rec.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">Suggested Action:</span>
                      <span className="text-xs">{rec.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
