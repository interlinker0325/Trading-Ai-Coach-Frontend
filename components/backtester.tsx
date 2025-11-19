"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Play, Settings, Target, Activity, Plus, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
   
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
  { value: "minute", label: "1 Minute" },
  { value: "hour", label: "1 Hour" },
  { value: "day", label: "1 Day" },
  { value: "week", label: "1 Week" },
  { value: "month", label: "1 Month" },
  { value: "quarter", label: "1 Quarter" },
  { value: "year", label: "1 Year" },
]

const assetTypes = [
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "forex", label: "Forex" },
  { value: "options", label: "Options" },
]

export function Backtester() {
  const { toast } = useToast()
  const [strategy, setStrategy] = useState({
    name: "",
    symbol: "",
    assetType: "",
    timeframe: "",
    startDate: "",
    endDate: "",
    initialCapital: "100000",
    indicators: [] as string[],
    entryRules: [] as Array<{indicator: string, operator: string, value: string, logic?: string}>,
    exitRules: [] as Array<{indicator: string, operator: string, value: string, logic?: string}>,
    stopLoss: "",
    takeProfit: "",
    positionSize: "2",
  })

  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [trades, setTrades] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("builder")
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

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
        // Remove rules that use this indicator
        entryRules: prev.entryRules.filter((r) => r.indicator !== indicator),
        exitRules: prev.exitRules.filter((r) => r.indicator !== indicator),
      }))
    }
  }

  const addEntryRule = () => {
    setStrategy((prev) => ({
      ...prev,
      entryRules: [...prev.entryRules, { indicator: "", operator: ">", value: "", logic: "AND" }],
    }))
  }

  const removeEntryRule = (index: number) => {
    setStrategy((prev) => ({
      ...prev,
      entryRules: prev.entryRules.filter((_, i) => i !== index),
    }))
  }

  const updateEntryRule = (index: number, field: string, value: string) => {
    setStrategy((prev) => ({
      ...prev,
      entryRules: prev.entryRules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      ),
    }))
  }

  const addExitRule = () => {
    setStrategy((prev) => ({
      ...prev,
      exitRules: [...prev.exitRules, { indicator: "", operator: ">", value: "", logic: "AND" }],
    }))
  }

  const removeExitRule = (index: number) => {
    setStrategy((prev) => ({
      ...prev,
      exitRules: prev.exitRules.filter((_, i) => i !== index),
    }))
  }

  const updateExitRule = (index: number, field: string, value: string) => {
    setStrategy((prev) => ({
      ...prev,
      exitRules: prev.exitRules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      ),
    }))
  }

  const getOperatorsForIndicator = (indicator: string) => {
    const crossoverIndicators = ["macd", "sma", "ema"]
    if (crossoverIndicators.includes(indicator.toLowerCase())) {
      return [
        { value: ">", label: ">" },
        { value: "<", label: "<" },
        { value: "crosses_above", label: "Crosses Above" },
        { value: "crosses_below", label: "Crosses Below" },
      ]
    }
    return [
      { value: ">", label: ">" },
      { value: "<", label: "<" },
      { value: ">=", label: ">=" },
      { value: "<=", label: "<=" },
    ]
  }

  const runBacktest = async () => {
    // Validate required fields
    if (!strategy.name || !strategy.symbol || !strategy.assetType || !strategy.timeframe || !strategy.startDate || !strategy.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (name, symbol, asset type, timeframe, start date, end date)",
        variant: "destructive",
      })
      return
    }

    // Validate date range
    if (new Date(strategy.endDate) <= new Date(strategy.startDate)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive",
      })
      return
    }

    // Validate indicators and rules
    if (strategy.indicators.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one indicator",
        variant: "destructive",
      })
      return
    }

    // Validate entry rules
    if (strategy.entryRules.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please define at least one entry rule",
        variant: "destructive",
      })
      return
    }

    // Validate that all entry rules have required fields
    const invalidEntryRules = strategy.entryRules.some(
      (rule) => !rule.indicator || !rule.operator || (rule.operator !== "crosses_above" && rule.operator !== "crosses_below" && !rule.value)
    )
    if (invalidEntryRules) {
      toast({
        title: "Validation Error",
        description: "Please complete all entry rules (indicator, operator, and value)",
        variant: "destructive",
      })
      return
    }

    // Validate exit rules if provided
    if (strategy.exitRules.length > 0) {
      const invalidExitRules = strategy.exitRules.some(
        (rule) => !rule.indicator || !rule.operator || (rule.operator !== "crosses_above" && rule.operator !== "crosses_below" && !rule.value)
      )
      if (invalidExitRules) {
        toast({
          title: "Validation Error",
          description: "Please complete all exit rules (indicator, operator, and value)",
          variant: "destructive",
        })
        return
      }
    }

    setIsRunning(true)
    setActiveTab("results")
    setResults(null)
    setTrades([])

    try {
      // Prepare strategy data
      const strategyData = {
        name: strategy.name,
        symbol: strategy.symbol,
        asset_type: strategy.assetType,
        timeframe: strategy.timeframe,
        start_date: new Date(strategy.startDate).toISOString(),
        end_date: new Date(strategy.endDate).toISOString(),
        initial_capital: parseFloat(strategy.initialCapital),
        indicators: strategy.indicators,
        entry_rules: strategy.entryRules.length > 0 ? JSON.stringify(strategy.entryRules) : null,
        exit_rules: strategy.exitRules.length > 0 ? JSON.stringify(strategy.exitRules) : null,
        stop_loss: strategy.stopLoss ? parseFloat(strategy.stopLoss) : null,
        take_profit: strategy.takeProfit ? parseFloat(strategy.takeProfit) : null,
        position_size: strategy.positionSize ? parseFloat(strategy.positionSize) : null,
      }

      // Create and run backtest
      const response = await apiClient.post("/api/v1/backtest/run", {
        strategy: strategyData,
        run_async: true,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to start backtest")
      }

      const data = await response.json()

      // Start polling for results
      startPolling(data.result_id)
    } catch (error: any) {
      console.error("Error running backtest:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to run backtest",
        variant: "destructive",
      })
      setIsRunning(false)
    }
  }

  const startPolling = (id: number) => {
    // Clear any existing polling
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }

    // Poll every 2 seconds
    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get(`/api/v1/backtest/results/${id}`)
        if (response.ok) {
          const result = await response.json()
          
          if (result.status === "completed") {
            // Backtest completed, stop polling
            clearInterval(interval)
            setPollingInterval(null)
            setIsRunning(false)
            
            // Load results and trades
            setResults(result)
            
            // Load trades
            const tradesResponse = await apiClient.get(`/api/v1/backtest/results/${id}/trades`)
            if (tradesResponse.ok) {
              const tradesData = await tradesResponse.json()
              setTrades(tradesData)
            }
          } else if (result.status === "failed") {
            // Backtest failed, stop polling
            clearInterval(interval)
            setPollingInterval(null)
            setIsRunning(false)
            
            toast({
              title: "Backtest Failed",
              description: result.error_message || "Backtest execution failed",
              variant: "destructive",
            })
          }
          // If status is "pending" or "running", continue polling
        }
      } catch (error) {
        console.error("Error polling backtest status:", error)
      }
    }, 2000)

    setPollingInterval(interval)
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [pollingInterval])

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Trade Simulation Backtester</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Build and test trading strategies with historical data</p>
        </div>
        <Button onClick={runBacktest} disabled={isRunning} className="w-full sm:w-auto">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
          <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0 h-auto p-1 bg-muted rounded-lg">
            <TabsTrigger value="builder" className="flex-1 sm:flex-initial text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap">
              Strategy Builder
            </TabsTrigger>
            <TabsTrigger value="results" className="flex-1 sm:flex-initial text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap">
              Results
            </TabsTrigger>
            <TabsTrigger value="trades" className="flex-1 sm:flex-initial text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap">
              Trade Log
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="builder" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="strategy-name">Strategy Name</Label>
                    <Input
                      id="strategy-name"
                      placeholder="My RSI Strategy"
                      value={strategy.name}
                      onChange={(e) => setStrategy((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol/Ticker</Label>
                    <Input
                      id="symbol"
                      placeholder="AAPL, BTCUSD, EURUSD"
                      value={strategy.symbol}
                      onChange={(e) => setStrategy((prev) => ({ ...prev, symbol: e.target.value }))}
                      className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={strategy.startDate}
                      onChange={(e) => setStrategy((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={strategy.endDate}
                      onChange={(e) => setStrategy((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
                    className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Entry Rules</CardTitle>
                <CardDescription>Define when to enter trades based on selected indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {strategy.entryRules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No entry rules defined. Select indicators first, then add rules.</p>
                ) : (
                  strategy.entryRules.map((rule, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      {index > 0 && (
                        <Select
                          value={rule.logic || "AND"}
                          onValueChange={(value) => updateEntryRule(index, "logic", value)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <Select
                        value={rule.indicator}
                        onValueChange={(value) => updateEntryRule(index, "indicator", value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Indicator" />
                        </SelectTrigger>
                        <SelectContent>
                          {strategy.indicators.map((ind) => {
                            const indicatorObj = indicators.find((i) => i.value === ind)
                            return (
                              <SelectItem key={ind} value={ind}>
                                {indicatorObj?.label || ind}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      {rule.indicator && (
                        <>
                          <Select
                            value={rule.operator}
                            onValueChange={(value) => {
                              updateEntryRule(index, "operator", value)
                              // Auto-set value for MACD crossovers
                              if (value.includes("crosses") && rule.indicator === "macd") {
                                updateEntryRule(index, "value", "signal")
                              } else if (value.includes("crosses") && !rule.value) {
                                // Clear value for other crossovers until user selects
                                updateEntryRule(index, "value", "")
                              }
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOperatorsForIndicator(rule.indicator).map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {rule.operator.includes("crosses") ? (
                            rule.indicator === "macd" ? (
                              <span className="text-sm text-muted-foreground px-2">signal</span>
                            ) : (
                              <Select
                                value={rule.value}
                                onValueChange={(value) => updateEntryRule(index, "value", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Compare to" />
                                </SelectTrigger>
                                <SelectContent>
                                  {strategy.indicators
                                    .filter((ind) => ind !== rule.indicator)
                                    .map((ind) => {
                                      const indicatorObj = indicators.find((i) => i.value === ind)
                                      return (
                                        <SelectItem key={ind} value={ind}>
                                          {indicatorObj?.label || ind}
                                        </SelectItem>
                                      )
                                    })}
                                </SelectContent>
                              </Select>
                            )
                          ) : (
                            <Input
                              type="number"
                              placeholder="Value"
                              value={rule.value}
                              onChange={(e) => updateEntryRule(index, "value", e.target.value)}
                              className="w-24 bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                            />
                          )}
                        </>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEntryRule(index)}
                        className="h-10 w-10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEntryRule}
                  disabled={strategy.indicators.length === 0}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry Rule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exit Rules</CardTitle>
                <CardDescription>Define when to exit trades based on selected indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {strategy.exitRules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No exit rules defined. Select indicators first, then add rules.</p>
                ) : (
                  strategy.exitRules.map((rule, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      {index > 0 && (
                        <Select
                          value={rule.logic || "AND"}
                          onValueChange={(value) => updateExitRule(index, "logic", value)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <Select
                        value={rule.indicator}
                        onValueChange={(value) => updateExitRule(index, "indicator", value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Indicator" />
                        </SelectTrigger>
                        <SelectContent>
                          {strategy.indicators.map((ind) => {
                            const indicatorObj = indicators.find((i) => i.value === ind)
                            return (
                              <SelectItem key={ind} value={ind}>
                                {indicatorObj?.label || ind}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      {rule.indicator && (
                        <>
                          <Select
                            value={rule.operator}
                            onValueChange={(value) => {
                              updateExitRule(index, "operator", value)
                              // Auto-set value for MACD crossovers
                              if (value.includes("crosses") && rule.indicator === "macd") {
                                updateExitRule(index, "value", "signal")
                              } else if (value.includes("crosses") && !rule.value) {
                                // Clear value for other crossovers until user selects
                                updateExitRule(index, "value", "")
                              }
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOperatorsForIndicator(rule.indicator).map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {rule.operator.includes("crosses") ? (
                            rule.indicator === "macd" ? (
                              <span className="text-sm text-muted-foreground px-2">signal</span>
                            ) : (
                              <Select
                                value={rule.value}
                                onValueChange={(value) => updateExitRule(index, "value", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Compare to" />
                                </SelectTrigger>
                                <SelectContent>
                                  {strategy.indicators
                                    .filter((ind) => ind !== rule.indicator)
                                    .map((ind) => {
                                      const indicatorObj = indicators.find((i) => i.value === ind)
                                      return (
                                        <SelectItem key={ind} value={ind}>
                                          {indicatorObj?.label || ind}
                                        </SelectItem>
                                      )
                                    })}
                                </SelectContent>
                              </Select>
                            )
                          ) : (
                            <Input
                              type="number"
                              placeholder="Value"
                              value={rule.value}
                              onChange={(e) => updateExitRule(index, "value", e.target.value)}
                              className="w-24 bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                            />
                          )}
                        </>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExitRule(index)}
                        className="h-10 w-10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExitRule}
                  disabled={strategy.indicators.length === 0}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exit Rule
                </Button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                  <Input
                    id="stop-loss"
                    type="number"
                    placeholder="5"
                    value={strategy.stopLoss}
                    onChange={(e) => setStrategy((prev) => ({ ...prev, stopLoss: e.target.value }))}
                    className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
                    className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
                    className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 sm:space-y-6">
          {isRunning ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8 sm:py-12">
                <div className="text-center space-y-4 px-4">
                  <Activity className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto text-primary" />
                  <div>
                    <h3 className="text-base sm:text-lg font-medium">Running Backtest...</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Analyzing historical data and executing strategy</p>
                  </div>
                  <Progress value={66} className="w-full max-w-xs mx-auto" />
                </div>
              </CardContent>
            </Card>
          ) : results ? (
            <>
              {/* Performance Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {results.total_return !== undefined ? `${results.total_return >= 0 ? "+" : ""}${results.total_return.toFixed(2)}%` : "-"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Return</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold">
                      {results.sharpe_ratio !== undefined ? results.sharpe_ratio.toFixed(2) : "-"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Sharpe Ratio</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-red-600">
                      {results.max_drawdown !== undefined ? `${results.max_drawdown.toFixed(2)}%` : "-"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Max Drawdown</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {results.win_rate !== undefined ? `${results.win_rate.toFixed(2)}%` : "-"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Win Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold">{results.total_trades || 0}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Trades</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold">
                      {results.profit_factor !== undefined ? results.profit_factor.toFixed(2) : "-"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Profit Factor</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Equity Curve</CardTitle>
                    <CardDescription>Portfolio value over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results?.equity_curve && results.equity_curve.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                        <LineChart data={results.equity_curve.map((point: any) => ({
                          date: new Date(point.date).toLocaleDateString(),
                          value: point.value,
                          drawdown: point.drawdown,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground text-sm">
                        No equity curve data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Returns</CardTitle>
                    <CardDescription>Monthly performance breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {trades && trades.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                        <BarChart data={trades.slice(0, 20).map((trade: any, index: number) => ({
                          trade: `T${index + 1}`,
                          pnl: trade.pnl || 0,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="trade" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="pnl" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground text-sm">
                        No trade data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Detailed Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">RETURNS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Return</span>
                          <span className="text-sm font-medium text-green-600">
                            {results.total_return !== undefined ? `${results.total_return >= 0 ? "+" : ""}${results.total_return.toFixed(2)}%` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Annualized Return</span>
                          <span className="text-sm font-medium">
                            {results.annualized_return !== undefined ? `${results.annualized_return >= 0 ? "+" : ""}${results.annualized_return.toFixed(2)}%` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Volatility</span>
                          <span className="text-sm font-medium">
                            {results.volatility !== undefined ? `${results.volatility.toFixed(2)}%` : "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">RISK METRICS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Sharpe Ratio</span>
                          <span className="text-sm font-medium">
                            {results.sharpe_ratio !== undefined ? results.sharpe_ratio.toFixed(2) : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Sortino Ratio</span>
                          <span className="text-sm font-medium">
                            {results.sortino_ratio !== undefined ? results.sortino_ratio.toFixed(2) : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Calmar Ratio</span>
                          <span className="text-sm font-medium">
                            {results.calmar_ratio !== undefined ? results.calmar_ratio.toFixed(2) : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Max Drawdown</span>
                          <span className="text-sm font-medium text-red-600">
                            {results.max_drawdown !== undefined ? `${results.max_drawdown.toFixed(2)}%` : "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">TRADE STATISTICS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Trades</span>
                          <span className="text-sm font-medium">{results.total_trades || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Win Rate</span>
                          <span className="text-sm font-medium text-green-600">
                            {results.win_rate !== undefined ? `${results.win_rate.toFixed(2)}%` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Profit Factor</span>
                          <span className="text-sm font-medium">
                            {results.profit_factor !== undefined ? results.profit_factor.toFixed(2) : "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">WIN/LOSS</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Win</span>
                          <span className="text-sm font-medium text-green-600">
                            {results.avg_win !== undefined ? `$${results.avg_win.toFixed(2)}` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Loss</span>
                          <span className="text-sm font-medium text-red-600">
                            {results.avg_loss !== undefined ? `$${results.avg_loss.toFixed(2)}` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Largest Win</span>
                          <span className="text-sm font-medium text-green-600">
                            {results.largest_win !== undefined ? `$${results.largest_win.toFixed(2)}` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Largest Loss</span>
                          <span className="text-sm font-medium text-red-600">
                            {results.largest_loss !== undefined ? `$${results.largest_loss.toFixed(2)}` : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8 sm:py-12 px-4">
                <div className="text-center space-y-4">
                  <Target className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-base sm:text-lg font-medium">No Results Yet</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Configure your strategy and run a backtest to see results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trades" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Trade Log</CardTitle>
              <CardDescription className="text-sm">Detailed record of all trades executed during backtest</CardDescription>
            </CardHeader>
            <CardContent>
              {trades && trades.length > 0 ? (
                <>
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-3">
                    {trades.map((trade: any) => (
                      <Card key={trade.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Date</span>
                            <span className="text-sm font-medium">{new Date(trade.entry_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Type</span>
                            <Badge variant={trade.trade_type === "long" ? "default" : "secondary"} className="text-xs">
                              {trade.trade_type === "long" ? "Long" : "Short"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Entry</span>
                            <span className="text-sm">${trade.entry_price?.toFixed(2) || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Exit</span>
                            <span className="text-sm">${trade.exit_price?.toFixed(2) || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Quantity</span>
                            <span className="text-sm">{trade.quantity?.toFixed(2) || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">P&L</span>
                            <span className={`text-sm font-medium ${trade.pnl && trade.pnl > 0 ? "text-green-600" : "text-red-600"}`}>
                              {trade.pnl ? `$${trade.pnl > 0 ? "+" : ""}${trade.pnl.toFixed(2)}` : "-"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Duration</span>
                            <span className="text-sm">{trade.duration_days ? `${trade.duration_days.toFixed(1)} days` : "-"}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
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
                        {trades.map((trade: any) => (
                          <tr key={trade.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">{new Date(trade.entry_date).toLocaleDateString()}</td>
                            <td className="p-2 font-medium">-</td>
                            <td className="p-2">
                              <Badge variant={trade.trade_type === "long" ? "default" : "secondary"}>
                                {trade.trade_type === "long" ? "Long" : "Short"}
                              </Badge>
                            </td>
                            <td className="p-2 text-right">${trade.entry_price?.toFixed(2) || "-"}</td>
                            <td className="p-2 text-right">${trade.exit_price?.toFixed(2) || "-"}</td>
                            <td className="p-2 text-right">{trade.quantity?.toFixed(2) || "-"}</td>
                            <td
                              className={`p-2 text-right font-medium ${trade.pnl && trade.pnl > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {trade.pnl ? `$${trade.pnl > 0 ? "+" : ""}${trade.pnl.toFixed(2)}` : "-"}
                            </td>
                            <td className="p-2 text-right text-muted-foreground">
                              {trade.duration_days ? `${trade.duration_days.toFixed(1)} days` : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No trades available. Run a backtest to see trade history.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
