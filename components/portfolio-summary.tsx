import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, PieChart } from "lucide-react"

interface PortfolioSummaryProps {
  plan: "free" | "pro" | "elite"
}

export function PortfolioSummary({ plan }: PortfolioSummaryProps) {
  // Mock data - would come from API
  const portfolioData = {
    totalValue: 125420.5,
    dayChange: 2340.25,
    dayChangePercent: 1.87,
    positions: [
      { symbol: "AAPL", value: 45200, change: 2.3 },
      { symbol: "TSLA", value: 32100, change: -1.2 },
      { symbol: "BTC", value: 28500, change: 4.1 },
      { symbol: "NVDA", value: 19620, change: 3.8 },
    ],
  }

  const isPositive = portfolioData.dayChange > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Portfolio Summary</span>
            </CardTitle>
            <CardDescription>Your investment performance overview</CardDescription>
          </div>
          {plan === "free" && (
            <Badge variant="outline" className="text-xs">
              Delayed 15min
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Value */}
        <div className="space-y-2">
          <div className="text-3xl font-bold">${portfolioData.totalValue.toLocaleString()}</div>
          <div className={`flex items-center space-x-1 ${isPositive ? "text-secondary" : "text-destructive"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-medium">
              ${Math.abs(portfolioData.dayChange).toLocaleString()} ({portfolioData.dayChangePercent}%)
            </span>
            <span className="text-muted-foreground">today</span>
          </div>
        </div>

        {/* Top Positions */}
        <div className="space-y-3">
          <h4 className="font-medium">Top Positions</h4>
          <div className="space-y-2">
            {portfolioData.positions.map((position) => (
              <div key={position.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="font-medium">{position.symbol}</div>
                  <div className="text-sm text-muted-foreground">${position.value.toLocaleString()}</div>
                </div>
                <div className={`text-sm font-medium ${position.change > 0 ? "text-secondary" : "text-destructive"}`}>
                  {position.change > 0 ? "+" : ""}
                  {position.change}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {plan === "free" && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            Upgrade to Pro for real-time data, advanced analytics, and risk metrics
          </div>
        )}
      </CardContent>
    </Card>
  )
}
