import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MarketOverviewProps {
  plan: "free" | "pro" | "elite"
}

export function MarketOverview({ plan }: MarketOverviewProps) {
  const marketData = {
    stocks: [
      { symbol: "SPY", price: 445.2, change: 1.2 },
      { symbol: "QQQ", price: 378.5, change: 0.8 },
      { symbol: "IWM", price: 198.3, change: -0.3 },
    ],
    crypto: [
      { symbol: "BTC", price: 67420, change: 3.2 },
      { symbol: "ETH", price: 3240, change: 2.8 },
      { symbol: "SOL", price: 142, change: 5.1 },
    ],
    forex: [
      { symbol: "EUR/USD", price: 1.0842, change: -0.2 },
      { symbol: "GBP/USD", price: 1.2654, change: 0.1 },
      { symbol: "USD/JPY", price: 149.82, change: 0.4 },
    ],
    commodities: [
      { symbol: "Gold", price: 2034.5, change: 0.8 },
      { symbol: "Silver", price: 24.12, change: 1.2 },
      { symbol: "Oil", price: 78.45, change: -1.1 },
    ],
  }

  const renderMarketList = (data: typeof marketData.stocks, prefix = "$") => (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.symbol} className="flex items-center justify-between">
          <div className="font-medium">{item.symbol}</div>
          <div className="flex items-center space-x-2">
            <span>
              {prefix}
              {item.price.toLocaleString()}
            </span>
            <div
              className={`flex items-center space-x-1 text-sm ${item.change > 0 ? "text-secondary" : "text-destructive"}`}
            >
              {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>
                {item.change > 0 ? "+" : ""}
                {item.change}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Real-time market data across all asset classes</CardDescription>
          </div>
          {plan === "free" && (
            <Badge variant="outline" className="text-xs">
              Limited Access
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stocks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="crypto" disabled={plan === "free"}>
              Crypto
            </TabsTrigger>
            <TabsTrigger value="forex" disabled={plan === "free"}>
              Forex
            </TabsTrigger>
            <TabsTrigger value="commodities" disabled={plan === "free"}>
              Commodities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stocks" className="mt-4">
            {renderMarketList(marketData.stocks)}
          </TabsContent>

          <TabsContent value="crypto" className="mt-4">
            {renderMarketList(marketData.crypto)}
          </TabsContent>

          <TabsContent value="forex" className="mt-4">
            {renderMarketList(marketData.forex, "")}
          </TabsContent>

          <TabsContent value="commodities" className="mt-4">
            {renderMarketList(marketData.commodities)}
          </TabsContent>
        </Tabs>

        {plan === "free" && (
          <div className="mt-4 text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            Upgrade to access crypto, forex, and commodities data with real-time updates
          </div>
        )}
      </CardContent>
    </Card>
  )
}
