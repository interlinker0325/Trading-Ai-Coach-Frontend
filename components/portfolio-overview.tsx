import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, PieChart, DollarSign, Target } from "lucide-react"

interface PortfolioOverviewProps {
  plan: "free" | "pro" | "elite"
}

export function PortfolioOverview({ plan }: PortfolioOverviewProps) {
  // Mock portfolio data
  const portfolioData = {
    totalValue: 125420.5,
    dayChange: 2340.25,
    dayChangePercent: 1.87,
    totalGainLoss: 15420.5,
    totalGainLossPercent: 14.02,
    cashBalance: 8500.0,
    investedAmount: 116920.5,
    diversificationScore: 7.2,
    riskScore: 6.8,
  }

  const isPositive = portfolioData.dayChange > 0
  const isTotalPositive = portfolioData.totalGainLoss > 0

  const metrics = [
    {
      title: "Total Value",
      value: `$${portfolioData.totalValue.toLocaleString()}`,
      change: `${isPositive ? "+" : ""}$${Math.abs(portfolioData.dayChange).toLocaleString()}`,
      changePercent: `${isPositive ? "+" : ""}${portfolioData.dayChangePercent}%`,
      icon: DollarSign,
      positive: isPositive,
    },
    {
      title: "Total Gain/Loss",
      value: `${isTotalPositive ? "+" : ""}$${Math.abs(portfolioData.totalGainLoss).toLocaleString()}`,
      change: `${isTotalPositive ? "+" : ""}${portfolioData.totalGainLossPercent}%`,
      changePercent: "All time",
      icon: TrendingUp,
      positive: isTotalPositive,
    },
    {
      title: "Cash Balance",
      value: `$${portfolioData.cashBalance.toLocaleString()}`,
      change: "Available",
      changePercent: "for trading",
      icon: DollarSign,
      positive: true,
    },
    {
      title: "Diversification",
      value: `${portfolioData.diversificationScore}/10`,
      change: plan === "free" ? "Upgrade" : "Good",
      changePercent: plan === "free" ? "for details" : "balance",
      icon: PieChart,
      positive: portfolioData.diversificationScore > 6,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center text-xs ${metric.positive ? "text-secondary" : "text-destructive"}`}>
                  {metric.positive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span className="font-medium">{metric.change}</span>
                  <span className="text-muted-foreground ml-1">{metric.changePercent}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Portfolio Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Portfolio Health Score</span>
          </CardTitle>
          <CardDescription>AI-powered analysis of your portfolio's overall health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">8.4/10</div>
              <div className="text-sm text-muted-foreground">Excellent portfolio health</div>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Well Diversified</Badge>
              <Badge variant="outline">Moderate Risk</Badge>
              <Badge variant="secondary">Strong Performance</Badge>
            </div>
          </div>

          {plan === "free" && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro for detailed risk analysis, correlation matrices, and personalized recommendations
              </p>
              <Button size="sm" className="mt-2">
                Upgrade Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
