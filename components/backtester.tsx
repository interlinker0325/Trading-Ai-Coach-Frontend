"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Play, Settings, Target, Brain, Activity } from "lucide-react"

const indicators = [
  { value: "sma", label: "Simple Moving Average (SMA)" },
  { value: "ema", label: "Exponential Moving Average (EMA)" },
  { value: "rsi", label: "Relative Strength Index (RSI)" },
  { value: "macd", label: "MACD" },
  { value: "bollinger", label: "Bollinger Bands" },
  { value: "atr", label: "Average True Range (ATR)" },
  { value: "stochastic", label: "Stochastic Oscillator" },
  { value: "williams", label: "Williams %R" },
  { value: "cci", label: "Commodity Channel Index (CCI)" },
  { value: "adx", label: "Average Directional Index (ADX)" },
]

const timeframes = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
]

const assetTypes = [
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "forex", label: "Forex" },
  { value: "commodities", label: "Commodities" },
  { value: "options", label: "Options" },
]

// Mock backtest results data
const equityCurveData = [
  { date: "2023-01", value: 100000, drawdown: 0 },
  { date: "2023-02", value: 102500, drawdown: -1.2 },
  { date: "2023-03", value: 98750, drawdown: -3.8 },
  { date: "2023-04", value: 105200, drawdown: 0 },
  { date: "2023-05", value: 108900, drawdown: 0 },
  { date: "2023-06", value: 106300, drawdown: -2.4 },
  { date: "2023-07", value: 112800, drawdown: 0 },
  { date: "2023-08", value: 109500, drawdown: -2.9 },
  { date: "2023-09", value: 115600, drawdown: 0 },
  { date: "2023-10", value: 118200, drawdown: 0 },
  { date: "2023-11", value: 121500, drawdown: 0 },
  { date: "2023-12", value: 125300, drawdown: 0 },
]

const monthlyReturns = [
  { month: "Jan", return: 2.5 },
  { month: "Feb", return: -3.7 },
  { month: "Mar", return: 6.5 },
  { month: "Apr", return: 3.5 },
  { month: "May", return: -2.4 },
  { month: "Jun", return: 6.1 },
  { month: "Jul", return: -2.9 },
  { month: "Aug", return: 5.6 },
  { month: "Sep", return: 2.2 },
  { month: "Oct", return: 2.7 },
  { month: "Nov", return: 3.0 },
]

const tradeLog = [
  {
    id: 1,
    date: "2023-12-15",
    symbol: "AAPL",
    type: "Long",
    entry: 195.5,
    exit: 198.25,
    quantity: 100,
    pnl: 275,
    duration: "2 days",
  },
  {
    id: 2,
    date: "2023-12-13",
    symbol: "TSLA",
    type: "Short",
    entry: 245.8,
    exit: 242.1,
    quantity: 50,
    pnl: 185,
    duration: "1 day",
  },
  {
    id: 3,
    date: "2023-12-12",
    symbol: "MSFT",
    type: "Long",
    entry: 375.2,
    exit: 371.5,
    quantity: 75,
    pnl: -277.5,
    duration: "3 days",
  },
  {
    id: 4,
    date: "2023-12-10",
    symbol: "GOOGL",
    type: "Long",
    entry: 142.3,
    exit: 145.8,
    quantity: 200,
    pnl: 700,
    duration: "4 days",
  },
  {
    id: 5,
    date: "2023-12-08",
    symbol: "NVDA",
    type: "Long",
    entry: 485.6,
    exit: 492.4,
    quantity: 25,
    pnl: 170,
    duration: "2 days",
  },
]

export function Backtester() {
  const [strategy, setStrategy] = useState({
    name: "",
    symbol: "",
    assetType: "",
    timeframe: "",
    startDate: "",
    endDate: "",
    initialCapital: "100000",
    indicators: [] as string[],
    entryRules: "",
    exitRules: "",
    stopLoss: "",
    takeProfit: "",
    positionSize: "2",
  })

  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("builder")

  const handleIndicatorChange = (indicator: string, checked: boolean) => {
    if (checked) {
      setStrategy((prev) => ({
        ...prev,
        indicators: [...prev.indicators, indicator],
      }))
    } else {
      setStrategy((prev) => ({
        ...prev,
        indicators: prev.indicators.filter((i) => i !== indicator),
      }))
    }
  }

  const runBacktest = async () => {
    setIsRunning(true)

    // Simulate backtest running
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock results
    setResults({
      totalReturn: 25.3,
      annualizedReturn: 18.7,
      sharpeRatio: 1.42,
      maxDrawdown: -8.5,
      winRate: 68.2,
      profitFactor: 1.85,
      totalTrades: 247,
      avgWin: 2.8,
      avgLoss: -1.9,
      largestWin: 12.4,
      largestLoss: -5.2,
      consecutiveWins: 8,
      consecutiveLosses: 3,
      calmarRatio: 2.2,
      sortinoRatio: 2.1,
      volatility: 13.2,
    })

    setIsRunning(false)
  }

  const runNaturalLanguageBacktest = async () => {
    if (!naturalLanguageQuery.trim()) return

    setIsRunning(true)
    setActiveTab("results")

    // Simulate AI processing the natural language query
    await new Promise((resolve) => setTimeout(resolve, 4000))

    // Mock results for natural language query
    setResults({
      query: naturalLanguageQuery,
      totalReturn: 32.1,
      annualizedReturn: 22.4,
      sharpeRatio: 1.68,
      maxDrawdown: -6.2,
      winRate: 72.5,
      profitFactor: 2.12,
      totalTrades: 189,
      avgWin: 3.2,
      avgLoss: -1.5,
      largestWin: 15.8,
      largestLoss: -4.1,
      consecutiveWins: 12,
      consecutiveLosses: 2,
      calmarRatio: 3.6,
      sortinoRatio: 2.8,
      volatility: 11.8,
    })

    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trade Simulation Backtester</h1>
          <p className="text-muted-foreground">Build and test trading strategies with historical data</p>
        </div>
        <Button onClick={runBacktest} disabled={isRunning}>
          {isRunning ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Backtest
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder">Strategy Builder</TabsTrigger>
          <TabsTrigger value="ai-query">AI Natural Language</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="trades">Trade Log</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strategy Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Strategy Configuration
                </CardTitle>
                <CardDescription>Define your trading strategy parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="strategy-name">Strategy Name</Label>
                    <Input
                      id="strategy-name"
                      placeholder="My RSI Strategy"
                      value={strategy.name}
                      onChange={(e) => setStrategy((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol/Ticker</Label>
                    <Input
                      id="symbol"
                      placeholder="AAPL, BTC-USD, EUR/USD"
                      value={strategy.symbol}
                      onChange={(e) => setStrategy((prev) => ({ ...prev, symbol: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset Type</Label>
                    <Select
                      value={strategy.assetType}
                      onValueChange={(value) => setStrategy((prev) => ({ ...prev, assetType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timeframe</Label>
                    <Select
                      value={strategy.timeframe}
                      onValueChange={(value) => setStrategy((prev) => ({ ...prev, timeframe: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.map((tf) => (
                          <SelectItem key={tf.value} value={tf.value}>
                            {tf.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={strategy.startDate}
                      onChange={(e) => setStrategy((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={strategy.endDate}
                      onChange={(e) => setStrategy((prev) => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initial-capital">Initial Capital ($)</Label>
                  <Input
                    id="initial-capital"
                    type="number"
                    value={strategy.initialCapital}
                    onChange={(e) => setStrategy((prev) => ({ ...prev, initialCapital: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Technical Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Indicators</CardTitle>
                <CardDescription>Select indicators for your strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                  {indicators.map((indicator) => (
                    <div key={indicator.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={indicator.value}
                        checked={strategy.indicators.includes(indicator.value)}
                        onChange={(e) => handleIndicatorChange(indicator.value, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={indicator.value} className="text-sm">
                        {indicator.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Entry Rules</CardTitle>
                <CardDescription>Define when to enter trades</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Example: Buy when RSI < 30 AND price > SMA(20) AND MACD crosses above signal line"
                  value={strategy.entryRules}
                  onChange={(e) => setStrategy((prev) => ({ ...prev, entryRules: e.target.value }))}
                  className="min-h-24"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exit Rules</CardTitle>
                <CardDescription>Define when to exit trades</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Example: Sell when RSI > 70 OR price hits stop loss OR take profit target reached"
                  value={strategy.exitRules}
                  onChange={(e) => setStrategy((prev) => ({ ...prev, exitRules: e.target.value }))}
                  className="min-h-24"
                />
              </CardContent>
            </Card>
          </div>

          {/* Risk Management */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Management</CardTitle>
              <CardDescription>Set stop loss, take profit, and position sizing rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                  <Input
                    id="stop-loss"
                    type="number"
                    placeholder="5"
                    value={strategy.stopLoss}
                    onChange={(e) => setStrategy((prev) => ({ ...prev, stopLoss: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="take-profit">Take Profit (%)</Label>
                  <Input
                    id="take-profit"
                    type="number"
                    placeholder="10"
                    value={strategy.takeProfit}
                    onChange={(e) => setStrategy((prev) => ({ ...prev, takeProfit: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position-size">Position Size (% of capital)</Label>
                  <Input
                    id="position-size"
                    type="number"
                    placeholder="2"
                    value={strategy.positionSize}
                    onChange={(e) => setStrategy((prev) => ({ ...prev, positionSize: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-query" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Natural Language Backtesting
              </CardTitle>
              <CardDescription>
                Describe your strategy in plain English and let AI build and test it for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-query">Strategy Description</Label>
                <Textarea
                  id="ai-query"
                  placeholder="Backtest buying gold when RSI < 30, sell when RSI > 70, last 5 years with 2% position sizing and 5% stop loss"
                  value={naturalLanguageQuery}
                  onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={runNaturalLanguageBacktest} disabled={isRunning || !naturalLanguageQuery.trim()}>
                  {isRunning ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Run AI Backtest
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setNaturalLanguageQuery("")}>
                  Clear
                </Button>
              </div>

              {/* Example Queries */}
              <div className="mt-6">
                <h3 className="font-medium mb-3">Example Queries:</h3>
                <div className="space-y-2">
                  {[
                    "Buy AAPL when price crosses above 20-day moving average, sell when it crosses below",
                    "Trade Bitcoin using RSI divergence strategy with 3% stop loss over last 2 years",
                    "Backtest EUR/USD carry trade strategy during high volatility periods",
                    "Test oil futures momentum strategy using MACD crossovers with 1% position size",
                  ].map((example, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="text-left h-auto p-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setNaturalLanguageQuery(example)}
                    >
                      "{example}"
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {isRunning ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Activity className="w-12 h-12 animate-spin mx-auto text-primary" />
                  <div>
                    <h3 className="text-lg font-medium">Running Backtest...</h3>
                    <p className="text-muted-foreground">Analyzing historical data and executing strategy</p>
                  </div>
                  <Progress value={66} className="w-64" />
                </div>
              </CardContent>
            </Card>
          ) : results ? (
            <>
              {/* Performance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">+{results.totalReturn}%</div>
                    <div className="text-sm text-muted-foreground">Total Return</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{results.sharpeRatio}</div>
                    <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{results.maxDrawdown}%</div>
                    <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{results.winRate}%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{results.totalTrades}</div>
                    <div className="text-sm text-muted-foreground">Total Trades</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{results.profitFactor}</div>
                    <div className="text-sm text-muted-foreground">Profit Factor</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Equity Curve</CardTitle>
                    <CardDescription>Portfolio value over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={equityCurveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Returns</CardTitle>
                    <CardDescription>Monthly performance breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyReturns}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="return" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">RETURNS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Return</span>
                          <span className="text-sm font-medium text-green-600">+{results.totalReturn}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Annualized Return</span>
                          <span className="text-sm font-medium">+{results.annualizedReturn}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Volatility</span>
                          <span className="text-sm font-medium">{results.volatility}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">RISK METRICS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Sharpe Ratio</span>
                          <span className="text-sm font-medium">{results.sharpeRatio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Sortino Ratio</span>
                          <span className="text-sm font-medium">{results.sortinoRatio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Calmar Ratio</span>
                          <span className="text-sm font-medium">{results.calmarRatio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Max Drawdown</span>
                          <span className="text-sm font-medium text-red-600">{results.maxDrawdown}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">TRADE STATISTICS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Trades</span>
                          <span className="text-sm font-medium">{results.totalTrades}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Win Rate</span>
                          <span className="text-sm font-medium text-green-600">{results.winRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Profit Factor</span>
                          <span className="text-sm font-medium">{results.profitFactor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">WIN/LOSS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Win</span>
                          <span className="text-sm font-medium text-green-600">+{results.avgWin}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Loss</span>
                          <span className="text-sm font-medium text-red-600">{results.avgLoss}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Largest Win</span>
                          <span className="text-sm font-medium text-green-600">+{results.largestWin}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Largest Loss</span>
                          <span className="text-sm font-medium text-red-600">{results.largestLoss}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Target className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">No Results Yet</h3>
                    <p className="text-muted-foreground">Configure your strategy and run a backtest to see results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade Log</CardTitle>
              <CardDescription>Detailed record of all trades executed during backtest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Entry</th>
                      <th className="text-right p-2">Exit</th>
                      <th className="text-right p-2">Qty</th>
                      <th className="text-right p-2">P&L</th>
                      <th className="text-right p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeLog.map((trade) => (
                      <tr key={trade.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{trade.date}</td>
                        <td className="p-2 font-medium">{trade.symbol}</td>
                        <td className="p-2">
                          <Badge variant={trade.type === "Long" ? "default" : "secondary"}>{trade.type}</Badge>
                        </td>
                        <td className="p-2 text-right">${trade.entry}</td>
                        <td className="p-2 text-right">${trade.exit}</td>
                        <td className="p-2 text-right">{trade.quantity}</td>
                        <td
                          className={`p-2 text-right font-medium ${trade.pnl > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ${trade.pnl > 0 ? "+" : ""}
                          {trade.pnl}
                        </td>
                        <td className="p-2 text-right text-muted-foreground">{trade.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
