"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface MarketOverviewProps {
  plan: "free" | "pro" | "elite"
}

interface MarketItem {
  symbol: string
  price: number
  change: number
}

interface MarketData {
  stocks: MarketItem[]
  crypto: MarketItem[]
  forex: MarketItem[]
  commodities: MarketItem[]
}

export function MarketOverview({ plan }: MarketOverviewProps) {
  const [marketData, setMarketData] = useState<MarketData>({
    stocks: [],
    crypto: [],
    forex: [],
    commodities: [],
  })
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [hasReceivedData, setHasReceivedData] = useState(false)

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        // Convert http/https to ws/wss
        const wsUrl = apiUrl.replace(/^http/, "ws") + "/api/v1/ws/market-data"
        
        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
          console.log("WebSocket connected")
          setIsConnected(true)
          // Clear any pending reconnection
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
          }
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            
            if (message.type === "snapshot") {
              // Initial data snapshot
              setMarketData(message.data)
              setHasReceivedData(true)
            } else if (message.type === "update") {
              // Real-time update for a single asset
              const update = message.data
              setHasReceivedData(true)
              setMarketData((prev) => {
                const newData = { ...prev }
                const assetType = update.asset_type as keyof MarketData
                
                if (newData[assetType]) {
                  // Check if symbol already exists
                  const existingIndex = newData[assetType].findIndex(
                    (item) => item.symbol === update.symbol
                  )
                  
                  if (existingIndex >= 0) {
                    // Update existing item
                    newData[assetType] = newData[assetType].map((item) =>
                      item.symbol === update.symbol
                        ? { ...item, price: update.price, change: update.change }
                        : item
                    )
                  } else {
                    // Add new item
                    newData[assetType] = [
                      ...newData[assetType],
                      {
                        symbol: update.symbol,
                        price: update.price,
                        change: update.change,
                      },
                    ]
                  }
                } else {
                  // Initialize asset type with new item
                  newData[assetType] = [
                    {
                      symbol: update.symbol,
                      price: update.price,
                      change: update.change,
                    },
                  ]
                }
                
                return newData
              })
            } else if (message.type === "pong") {
              // Heartbeat response
              console.log("WebSocket heartbeat")
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error)
          }
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          setIsConnected(false)
        }

        ws.onclose = () => {
          console.log("WebSocket disconnected")
          setIsConnected(false)
          
          // Attempt to reconnect after 5 seconds
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectTimeoutRef.current = null
              connectWebSocket()
            }, 5000)
          }
        }
      } catch (error) {
        console.error("Error connecting WebSocket:", error)
        setIsConnected(false)
      }
    }

    // Connect on mount
    connectWebSocket()

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [])

  const renderMarketList = (data: MarketItem[], prefix = "$") => {
    if (!hasReceivedData && !isConnected) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>Connecting to market data...</p>
        </div>
      )
    }
    
    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No market data available</p>
        </div>
      )
    }
    
    return (
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between">
            <div className="font-medium">{item.symbol}</div>
            <div className="flex items-center space-x-2">
              <span>
                {prefix}
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: item.price < 1 ? 4 : 2,
                  maximumFractionDigits: item.price < 1 ? 4 : 2,
                })}
              </span>
              <div
                className={`flex items-center space-x-1 text-sm ${item.change > 0 ? "text-secondary" : "text-destructive"}`}
              >
                {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>
                  {item.change > 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Market Overview
              {isConnected ? (
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" title="Connected" />
              ) : (
                <span className="h-2 w-2 bg-gray-400 rounded-full" title="Disconnected" />
              )}
            </CardTitle>
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
