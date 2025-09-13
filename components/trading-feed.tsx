import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Bell, Lock } from "lucide-react"

interface TradingFeedProps {
  plan: "free" | "pro" | "elite"
}

export function TradingFeed({ plan }: TradingFeedProps) {
  const feedItems = [
    {
      type: "Large Trade",
      symbol: "AAPL",
      message: "Unusual options activity: 10,000 calls bought",
      time: "2 min ago",
      premium: true,
    },
    {
      type: "News Alert",
      symbol: "TSLA",
      message: "Q4 earnings beat expectations by 15%",
      time: "5 min ago",
      premium: false,
    },
    {
      type: "Technical Signal",
      symbol: "BTC",
      message: "Breaking above key resistance at $67,000",
      time: "8 min ago",
      premium: true,
    },
    {
      type: "Insider Trading",
      symbol: "NVDA",
      message: "CEO purchased $2M worth of shares",
      time: "12 min ago",
      premium: true,
    },
    {
      type: "Analyst Upgrade",
      symbol: "MSFT",
      message: "Goldman Sachs raises target to $420",
      time: "15 min ago",
      premium: false,
    },
  ]

  const displayItems = plan === "free" ? feedItems.filter((item) => !item.premium).slice(0, 2) : feedItems

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Trading Feed</span>
            </CardTitle>
            <CardDescription>Real-time market events and signals</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayItems.map((item, index) => (
          <div key={index} className="space-y-2 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
                <span className="font-medium text-sm">{item.symbol}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
            <p className="text-sm">{item.message}</p>
          </div>
        ))}

        {plan === "free" && (
          <div className="space-y-2">
            {feedItems
              .filter((item) => item.premium)
              .slice(0, 2)
              .map((item, index) => (
                <div
                  key={`locked-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-dashed"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {item.type} - {item.symbol}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Pro
                  </Badge>
                </div>
              ))}

            <Button variant="outline" className="w-full bg-transparent" size="sm">
              Upgrade for Premium Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
