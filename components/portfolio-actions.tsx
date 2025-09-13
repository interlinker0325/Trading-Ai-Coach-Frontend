import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, RefreshCw, Target, TrendingUp, AlertTriangle } from "lucide-react"

interface PortfolioActionsProps {
  plan: "free" | "pro" | "elite"
}

export function PortfolioActions({ plan }: PortfolioActionsProps) {
  const rebalanceRecommendations = [
    {
      action: "Sell",
      symbol: "AAPL",
      shares: 10,
      reason: "Reduce tech overweight",
      impact: "Decrease allocation by 3.2%",
    },
    {
      action: "Buy",
      symbol: "JNJ",
      shares: 25,
      reason: "Add healthcare exposure",
      impact: "Increase diversification score",
    },
    {
      action: "Sell",
      symbol: "BTC",
      shares: 0.1,
      reason: "Reduce crypto exposure",
      impact: "Lower portfolio volatility",
    },
  ]

  const quickActions = [
    {
      title: "Auto-Rebalance",
      description: "Automatically rebalance to target allocation",
      icon: RefreshCw,
      premium: plan === "free",
    },
    {
      title: "Tax-Loss Harvesting",
      description: "Optimize for tax efficiency",
      icon: TrendingUp,
      premium: plan !== "elite",
    },
    {
      title: "Risk Adjustment",
      description: "Adjust portfolio risk level",
      icon: Target,
      premium: plan === "free",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trade">Manual Trading</TabsTrigger>
          <TabsTrigger value="rebalance">Rebalancing</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buy Order */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-secondary" />
                  <span>Buy Order</span>
                </CardTitle>
                <CardDescription>Add a new position to your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buy-symbol">Symbol</Label>
                  <Input id="buy-symbol" placeholder="e.g., AAPL, BTC, SPY" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buy-quantity">Quantity</Label>
                    <Input id="buy-quantity" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buy-type">Order Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Market" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buy-amount">Total Amount</Label>
                  <Input id="buy-amount" type="number" placeholder="$0.00" />
                </div>
                <Button className="w-full" disabled={plan === "free"}>
                  {plan === "free" ? "Upgrade to Trade" : "Place Buy Order"}
                </Button>
                {plan === "free" && (
                  <p className="text-xs text-muted-foreground text-center">Trading requires Pro or Elite plan</p>
                )}
              </CardContent>
            </Card>

            {/* Sell Order */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Minus className="h-5 w-5 text-destructive" />
                  <span>Sell Order</span>
                </CardTitle>
                <CardDescription>Sell existing positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sell-symbol">Position</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AAPL">AAPL (50 shares)</SelectItem>
                      <SelectItem value="TSLA">TSLA (25 shares)</SelectItem>
                      <SelectItem value="BTC">BTC (0.5 coins)</SelectItem>
                      <SelectItem value="NVDA">NVDA (15 shares)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sell-quantity">Quantity</Label>
                    <Input id="sell-quantity" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sell-type">Order Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Market" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sell-amount">Estimated Proceeds</Label>
                  <Input id="sell-amount" type="number" placeholder="$0.00" disabled />
                </div>
                <Button variant="destructive" className="w-full" disabled={plan === "free"}>
                  {plan === "free" ? "Upgrade to Trade" : "Place Sell Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rebalance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>Portfolio Rebalancing</span>
              </CardTitle>
              <CardDescription>AI-recommended trades to optimize your portfolio allocation</CardDescription>
            </CardHeader>
            <CardContent>
              {plan === "free" ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Rebalancing Requires Pro Plan</h3>
                  <p className="text-muted-foreground mb-4">
                    Get AI-powered rebalancing recommendations and automated portfolio optimization
                  </p>
                  <Button>Upgrade to Pro</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Recommended Actions</h4>
                      <p className="text-sm text-muted-foreground">Based on your target allocation</p>
                    </div>
                    <Button>Execute All</Button>
                  </div>

                  <div className="space-y-3">
                    {rebalanceRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant={rec.action === "Buy" ? "secondary" : "destructive"}>{rec.action}</Badge>
                            <span className="font-medium">
                              {rec.shares} {rec.symbol}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.reason}</p>
                          <p className="text-xs text-muted-foreground">{rec.impact}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Execute
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Icon className="h-4 w-4" />
                      <span>{action.title}</span>
                    </CardTitle>
                    <CardDescription className="text-sm">{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" disabled={action.premium} size="sm">
                      {action.premium ? "Upgrade Required" : "Enable"}
                    </Button>
                    {action.premium && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        {plan === "free" ? "Pro feature" : "Elite feature"}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {plan === "elite" && (
            <Card>
              <CardHeader>
                <CardTitle>Advanced Automation Settings</CardTitle>
                <CardDescription>Configure automated trading rules and triggers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rebalance Frequency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Monthly" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Deviation Threshold</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="5%" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">Save Automation Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
