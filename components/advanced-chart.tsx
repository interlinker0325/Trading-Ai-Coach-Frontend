"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, TrendingDown, Activity, Lock } from "lucide-react"

interface AdvancedChartProps {
  symbol: string
  assetType: "stocks" | "crypto" | "forex" | "commodities"
  plan: "free" | "pro" | "elite"
}

export function AdvancedChart({ symbol, assetType, plan }: AdvancedChartProps) {
  const [timeframe, setTimeframe] = useState("1D")
  const [indicators, setIndicators] = useState<string[]>(["SMA20", "Volume"])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock chart data generation
  useEffect(() => {
    const generateChartData = () => {
      const data = []
      let basePrice = assetType === "forex" ? 1.085 : assetType === "crypto" ? 42000 : 185.42

      for (let i = 0; i < 100; i++) {
        const change = (Math.random() - 0.5) * 0.02
        const open = basePrice
        const close = basePrice * (1 + change)
        const high = Math.max(open, close) * (1 + Math.random() * 0.01)
        const low = Math.min(open, close) * (1 - Math.random() * 0.01)
        const volume = Math.floor(Math.random() * 1000000) + 500000

        // Technical indicators
        const sma20 =
          i >= 19
            ? data.slice(Math.max(0, i - 19), i + 1).reduce((sum, item) => sum + item.close, 0) / Math.min(20, i + 1)
            : close
        const rsi = 50 + (Math.random() - 0.5) * 60 // Simplified RSI
        const macd = (Math.random() - 0.5) * 2
        const bollinger_upper = sma20 * 1.02
        const bollinger_lower = sma20 * 0.98

        data.push({
          timestamp: new Date(Date.now() - (99 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          open,
          high,
          low,
          close,
          volume,
          sma20,
          rsi,
          macd,
          bollinger_upper,
          bollinger_lower,
          vwap: (high + low + close) / 3,
        })

        basePrice = close
      }
      return data
    }

    setLoading(true)
    setTimeout(() => {
      setChartData(generateChartData())
      setLoading(false)
    }, 1000)
  }, [symbol, timeframe, assetType])

  const timeframes = [
    { value: "1m", label: "1M", disabled: plan === "free" },
    { value: "5m", label: "5M", disabled: plan === "free" },
    { value: "15m", label: "15M", disabled: plan === "free" },
    { value: "1H", label: "1H", disabled: plan === "free" },
    { value: "4H", label: "4H", disabled: false },
    { value: "1D", label: "1D", disabled: false },
    { value: "1W", label: "1W", disabled: false },
  ]

  const availableIndicators = [
    { value: "SMA20", label: "SMA 20", color: "#8884d8" },
    { value: "EMA20", label: "EMA 20", color: "#82ca9d" },
    { value: "Bollinger", label: "Bollinger Bands", color: "#ffc658" },
    { value: "RSI", label: "RSI", color: "#ff7300" },
    { value: "MACD", label: "MACD", color: "#8dd1e1" },
    { value: "VWAP", label: "VWAP", color: "#d084d0" },
    { value: "Volume", label: "Volume", color: "#8884d8" },
  ]

  const toggleIndicator = (indicator: string) => {
    setIndicators((prev) => (prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator]))
  }

  const formatPrice = (value: number) => {
    if (assetType === "forex") return value.toFixed(4)
    if (assetType === "crypto") return value.toLocaleString()
    return `$${value.toFixed(2)}`
  }

  const currentPrice = chartData[chartData.length - 1]?.close || 0
  const previousPrice = chartData[chartData.length - 2]?.close || 0
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = (priceChange / previousPrice) * 100

  if (plan === "free" && (timeframe === "1m" || timeframe === "5m" || timeframe === "15m" || timeframe === "1H")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{symbol} Chart</span>
            <Badge variant="outline">Free Plan</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-muted/50 rounded-lg border border-dashed">
            <div className="text-center space-y-4">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold">Advanced Timeframes Locked</h3>
                <p className="text-sm text-muted-foreground">Upgrade to Pro for intraday charts and real-time data</p>
              </div>
              <Button>Upgrade to Pro</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold">{symbol}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{formatPrice(currentPrice)}</span>
                  <div
                    className={`flex items-center space-x-1 ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-medium">
                      {priceChange >= 0 ? "+" : ""}
                      {formatPrice(priceChange)} ({priceChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Timeframe Selector */}
              <div className="flex space-x-1">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    variant={timeframe === tf.value ? "default" : "outline"}
                    size="sm"
                    disabled={tf.disabled}
                    onClick={() => setTimeframe(tf.value)}
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardContent className="p-0">
          <div className="h-96">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ChartContainer
                config={{
                  close: { label: "Price", color: "hsl(var(--chart-1))" },
                  volume: { label: "Volume", color: "hsl(var(--chart-2))" },
                  sma20: { label: "SMA 20", color: "hsl(var(--chart-3))" },
                  bollinger_upper: { label: "BB Upper", color: "hsl(var(--chart-4))" },
                  bollinger_lower: { label: "BB Lower", color: "hsl(var(--chart-4))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis
                      yAxisId="price"
                      domain={["dataMin - 5", "dataMax + 5"]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={formatPrice}
                    />
                    <YAxis
                      yAxisId="volume"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />

                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />

                    {/* Price Line */}
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="close"
                      stroke="var(--color-close)"
                      strokeWidth={2}
                      dot={false}
                    />

                    {/* Technical Indicators */}
                    {indicators.includes("SMA20") && (
                      <Line
                        yAxisId="price"
                        type="monotone"
                        dataKey="sma20"
                        stroke="var(--color-sma20)"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    )}

                    {indicators.includes("Bollinger") && (
                      <>
                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="bollinger_upper"
                          stroke="var(--color-bollinger_upper)"
                          strokeWidth={1}
                          strokeOpacity={0.6}
                          dot={false}
                        />
                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="bollinger_lower"
                          stroke="var(--color-bollinger_lower)"
                          strokeWidth={1}
                          strokeOpacity={0.6}
                          dot={false}
                        />
                      </>
                    )}

                    {indicators.includes("Volume") && (
                      <Bar yAxisId="volume" dataKey="volume" fill="var(--color-volume)" opacity={0.3} />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Indicators Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Technical Indicators</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableIndicators.map((indicator) => (
              <Button
                key={indicator.value}
                variant={indicators.includes(indicator.value) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleIndicator(indicator.value)}
                disabled={plan === "free" && !["SMA20", "Volume"].includes(indicator.value)}
              >
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: indicator.color }} />
                {indicator.label}
                {plan === "free" && !["SMA20", "Volume"].includes(indicator.value) && <Lock className="h-3 w-3 ml-1" />}
              </Button>
            ))}
          </div>

          {plan === "free" && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro for advanced indicators: RSI, MACD, Bollinger Bands, VWAP, and more
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secondary Charts for RSI/MACD */}
      {(indicators.includes("RSI") || indicators.includes("MACD")) && plan !== "free" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {indicators.includes("RSI") && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">RSI (14)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-32">
                  <ChartContainer
                    config={{
                      rsi: { label: "RSI", color: "hsl(var(--chart-5))" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" />
                        <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="2 2" />
                        <Line type="monotone" dataKey="rsi" stroke="var(--color-rsi)" strokeWidth={2} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {indicators.includes("MACD") && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">MACD</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-32">
                  <ChartContainer
                    config={{
                      macd: { label: "MACD", color: "hsl(var(--chart-6))" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ReferenceLine y={0} stroke="#6b7280" />
                        <Bar dataKey="macd" fill="var(--color-macd)" opacity={0.7} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
