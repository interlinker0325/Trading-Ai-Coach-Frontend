"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Search, Plus, MoreHorizontal } from "lucide-react"
import { useState } from "react"

interface PortfolioHoldingsProps {
  plan: "free" | "pro" | "elite"
}

export function PortfolioHoldings({ plan }: PortfolioHoldingsProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock holdings data
  const holdings = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 50,
      avgCost: 180.25,
      currentPrice: 185.42,
      marketValue: 9271.0,
      gainLoss: 258.5,
      gainLossPercent: 2.87,
      allocation: 18.5,
      sector: "Technology",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      shares: 25,
      avgCost: 245.8,
      currentPrice: 238.15,
      marketValue: 5953.75,
      gainLoss: -191.25,
      gainLossPercent: -3.11,
      allocation: 11.9,
      sector: "Consumer Discretionary",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      shares: 0.5,
      avgCost: 45000,
      currentPrice: 67420,
      marketValue: 33710.0,
      gainLoss: 11210.0,
      gainLossPercent: 49.82,
      allocation: 26.9,
      sector: "Cryptocurrency",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      shares: 15,
      avgCost: 420.3,
      currentPrice: 445.2,
      marketValue: 6678.0,
      gainLoss: 373.5,
      gainLossPercent: 5.92,
      allocation: 13.4,
      sector: "Technology",
    },
    {
      symbol: "SPY",
      name: "SPDR S&P 500 ETF",
      shares: 30,
      avgCost: 425.6,
      currentPrice: 445.2,
      marketValue: 13356.0,
      gainLoss: 588.0,
      gainLossPercent: 4.61,
      allocation: 26.7,
      sector: "ETF",
    },
  ]

  const filteredHoldings = holdings.filter(
    (holding) =>
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSectorColor = (sector: string) => {
    const colors = {
      Technology: "bg-blue-500/10 text-blue-700",
      "Consumer Discretionary": "bg-purple-500/10 text-purple-700",
      Cryptocurrency: "bg-orange-500/10 text-orange-700",
      ETF: "bg-green-500/10 text-green-700",
    }
    return colors[sector as keyof typeof colors] || "bg-gray-500/10 text-gray-700"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>Your current positions and performance</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search holdings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Avg Cost</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Market Value</TableHead>
                <TableHead>Gain/Loss</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHoldings.map((holding) => (
                <TableRow key={holding.symbol}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{holding.symbol}</div>
                      <div className="text-sm text-muted-foreground">{holding.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{holding.shares}</TableCell>
                  <TableCell>${holding.avgCost.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>${holding.currentPrice.toFixed(2)}</span>
                      {plan === "free" && (
                        <Badge variant="outline" className="text-xs">
                          15min
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${holding.marketValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center space-x-1 ${holding.gainLoss > 0 ? "text-secondary" : "text-destructive"}`}
                    >
                      {holding.gainLoss > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <div>
                        <div className="font-medium">
                          {holding.gainLoss > 0 ? "+" : ""}${Math.abs(holding.gainLoss).toFixed(2)}
                        </div>
                        <div className="text-xs">
                          {holding.gainLoss > 0 ? "+" : ""}
                          {holding.gainLossPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(holding.allocation, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm">{holding.allocation}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSectorColor(holding.sector)}>{holding.sector}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {plan === "free" && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Upgrade to Pro for real-time prices, advanced sorting, and portfolio optimization suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
