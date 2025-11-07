"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Play,
  TrendingUp,
  Target,
  DollarSign,
  Zap,
  BarChart3,
} from "lucide-react";
import { EducationNavigation } from "@/components/education-navigation";

export default function SimulatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Education Hub</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Master trading with interactive courses, playbooks, and quizzes
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Play className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </div>

        {/* Navigation */}
        <EducationNavigation />

        {/* Simulator Content */}
        <div className="space-y-6">
          {/* Backtester Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Strategy Backtester
              </CardTitle>
              <CardDescription>
                Build and test trading strategies with custom indicators and
                rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-type">Asset Type</Label>
                  <select
                    id="asset-type"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue="stocks"
                  >
                    <option value="stocks">Stocks</option>
                    <option value="crypto">Crypto</option>
                    <option value="forex">Forex</option>
                    <option value="commodities">Commodities</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticker">Ticker/Symbol</Label>
                  <Input
                    id="ticker"
                    placeholder="e.g., AAPL, BTC/USD, EUR/USD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <select
                    id="timeframe"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue="1d"
                  >
                    <option value="1h">1 Hour</option>
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Backtest Period</Label>
                  <select
                    id="period"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue="1y"
                  >
                    <option value="1m">1 Month</option>
                    <option value="6m">6 Months</option>
                    <option value="1y">1 Year</option>
                    <option value="5y">5 Years</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Select Indicators</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "SMA",
                    "EMA",
                    "MACD",
                    "RSI",
                    "Bollinger",
                    "VWAP",
                    "ATR",
                  ].map((indicator) => (
                    <div
                      key={indicator}
                      className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted"
                    >
                      <Checkbox id={indicator} />
                      <Label htmlFor={indicator}>{indicator}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entry Condition</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>RSI &lt; 30 (Oversold)</option>
                    <option>SMA Golden Cross</option>
                    <option>MACD Bullish</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Exit Condition</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>RSI &gt; 70 (Overbought)</option>
                    <option>SMA Death Cross</option>
                    <option>MACD Bearish</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Stop Loss (%)</Label>
                  <Input type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label>Take Profit (%)</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label>Position Size ($)</Label>
                  <Input type="number" placeholder="1000" />
                </div>
              </div>

              <Button size="lg" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Run Backtest
              </Button>
            </CardContent>
          </Card>

          {/* Paper Trading Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Paper Trading Simulator
              </CardTitle>
              <CardDescription>
                Practice trading with virtual money across all asset classes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simulator Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    $125,430
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Portfolio Value
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    +25.43%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Return
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">247</div>
                  <div className="text-sm text-muted-foreground">
                    Total Trades
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">68%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex-col">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  Trade Stocks
                </Button>
                <Button
                  className="h-20 flex-col bg-transparent"
                  variant="outline"
                >
                  <Target className="w-6 h-6 mb-2" />
                  Options
                </Button>
                <Button
                  className="h-20 flex-col bg-transparent"
                  variant="outline"
                >
                  <DollarSign className="w-6 h-6 mb-2" />
                  Crypto
                </Button>
                <Button
                  className="h-20 flex-col bg-transparent"
                  variant="outline"
                >
                  <Zap className="w-6 h-6 mb-2" />
                  Forex
                </Button>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Start Trading Session
                </Button>
                <Button size="lg" variant="outline">
                  View Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
