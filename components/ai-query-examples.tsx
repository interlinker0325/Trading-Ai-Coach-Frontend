"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Coins, DollarSign, BarChart3, Brain, Zap } from "lucide-react"

interface AIQueryExamplesProps {
  onSelectQuery: (query: string) => void
}

export function AIQueryExamples({ onSelectQuery }: AIQueryExamplesProps) {
  const queryExamples = [
    {
      category: "Forex",
      icon: <DollarSign className="h-4 w-4" />,
      color: "bg-blue-500/10 text-blue-700 border-blue-200",
      queries: [
        "Show EUR/USD 6-month chart with Bollinger Bands and RSI",
        "Analyze GBP/JPY with Ichimoku Cloud",
        "Find best forex setups this week",
        "Show volatility heatmap of all USD pairs today",
      ],
    },
    {
      category: "Commodities",
      icon: <Coins className="h-4 w-4" />,
      color: "bg-amber-500/10 text-amber-700 border-amber-200",
      queries: [
        "Backtest gold trading strategy with MACD and ATR stops",
        "Analyze oil price with seasonal patterns",
        "Show silver momentum indicators",
        "What affects copper prices this quarter?",
      ],
    },
    {
      category: "Crypto",
      icon: <Zap className="h-4 w-4" />,
      color: "bg-purple-500/10 text-purple-700 border-purple-200",
      queries: [
        "Show Bitcoin whale transactions this week",
        "Analyze ETH/USD with volume profile",
        "Find altcoins with strong momentum",
        "Track exchange inflows for top 10 cryptos",
      ],
    },
    {
      category: "Options",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "bg-green-500/10 text-green-700 border-green-200",
      queries: [
        "Find safe CSPs for SCHD with 8%+ yield",
        "Show covered call opportunities in QQQ",
        "Analyze options flow for NVDA",
        "Best wheel strategies for dividend stocks",
      ],
    },
    {
      category: "Backtesting",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-orange-500/10 text-orange-700 border-orange-200",
      queries: [
        "Backtest buying gold when RSI < 30, sell when RSI > 70",
        "Test MACD strategy on S&P 500 last 5 years",
        "Analyze moving average crossover on EUR/USD",
        "Backtest momentum strategy on crypto portfolio",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Try These AI Queries</h3>
        <p className="text-sm text-muted-foreground">Ask natural language questions about any asset class</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {queryExamples.map((category) => (
          <Card key={category.category} className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <div className={`p-1 rounded ${category.color}`}>{category.icon}</div>
                <span>{category.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.queries.map((query, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2 text-xs"
                  onClick={() => onSelectQuery(query)}
                >
                  <Brain className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{query}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
