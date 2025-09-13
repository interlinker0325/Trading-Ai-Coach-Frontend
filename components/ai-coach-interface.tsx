"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Brain, TrendingUp, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  analysis?: {
    type: "market" | "portfolio" | "risk" | "opportunity" | "backtest"
    data?: any
  }
}

interface AICoachInterfaceProps {
  plan: "free" | "pro" | "elite"
}

export function AICoachInterface({ plan }: AICoachInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI Financial Coach. I can help you analyze markets, optimize your portfolio, and make informed investment decisions. What would you like to explore today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dailyQueries, setDailyQueries] = useState(plan === "free" ? 3 : 0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const maxQueries = plan === "free" ? 5 : Number.POSITIVE_INFINITY

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return
    if (plan === "free" && dailyQueries >= maxQueries) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    if (plan === "free") {
      setDailyQueries((prev) => prev + 1)
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  const generateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase()

    // Detect asset type and query intent
    let assetType = "general"
    let analysisType = "market"

    if (
      lowerQuery.includes("eur/usd") ||
      lowerQuery.includes("forex") ||
      lowerQuery.includes("gbp/jpy") ||
      lowerQuery.includes("usd/jpy")
    ) {
      assetType = "forex"
    } else if (
      lowerQuery.includes("gold") ||
      lowerQuery.includes("oil") ||
      lowerQuery.includes("silver") ||
      lowerQuery.includes("commodities")
    ) {
      assetType = "commodities"
    } else if (
      lowerQuery.includes("btc") ||
      lowerQuery.includes("eth") ||
      lowerQuery.includes("crypto") ||
      lowerQuery.includes("bitcoin")
    ) {
      assetType = "crypto"
    } else if (lowerQuery.includes("options") || lowerQuery.includes("csp") || lowerQuery.includes("covered call")) {
      assetType = "options"
    }

    if (lowerQuery.includes("backtest") || lowerQuery.includes("strategy")) {
      analysisType = "backtest"
    } else if (lowerQuery.includes("portfolio") || lowerQuery.includes("allocation")) {
      analysisType = "portfolio"
    } else if (lowerQuery.includes("risk") || lowerQuery.includes("volatility")) {
      analysisType = "risk"
    }

    const responses = {
      forex: [
        {
          content:
            "EUR/USD is showing strong bullish momentum above the 1.0850 support level. The 6-month chart reveals a clear uptrend with Bollinger Bands expanding, indicating increased volatility. RSI at 68 suggests room for further upside before overbought conditions. Key resistance at 1.1200.",
          analysis: {
            type: "market" as const,
            data: {
              pair: "EUR/USD",
              trend: "Bullish",
              rsi: "68",
              support: "1.0850",
              resistance: "1.1200",
              signal: "Buy on dips",
            },
          },
        },
      ],
      commodities: [
        {
          content:
            "Gold is testing key resistance at $2,050 with strong momentum indicators. MACD shows bullish crossover while ATR suggests increased volatility. Historical data shows gold performs well during Q4 due to seasonal demand. Consider position sizing with 2% ATR-based stops.",
          analysis: {
            type: "opportunity" as const,
            data: {
              asset: "Gold",
              price: "$2,050",
              signal: "Bullish breakout",
              stopLoss: "ATR-based 2%",
              seasonality: "Q4 strength",
              confidence: "High",
            },
          },
        },
      ],
      crypto: [
        {
          content:
            "Bitcoin whale activity shows accumulation pattern with 15,000 BTC moved to cold storage this week. On-chain metrics indicate strong hodling behavior. Technical analysis shows BTC consolidating above $42,000 support with potential breakout to $48,000.",
          analysis: {
            type: "market" as const,
            data: {
              asset: "Bitcoin",
              whaleActivity: "Accumulation",
              support: "$42,000",
              target: "$48,000",
              onChain: "Bullish",
              timeframe: "2-4 weeks",
            },
          },
        },
      ],
      options: [
        {
          content:
            "SCHD shows excellent CSP opportunities with 30-45 DTE puts yielding 8-12% annualized. The $72 strike offers optimal risk/reward with strong support. IV rank at 35% provides decent premium while maintaining safety margin.",
          analysis: {
            type: "opportunity" as const,
            data: {
              strategy: "Cash Secured Put",
              ticker: "SCHD",
              strike: "$72",
              yield: "8-12% annualized",
              ivRank: "35%",
              dte: "30-45 days",
            },
          },
        },
      ],
      backtest: [
        {
          content:
            "Backtesting gold MACD strategy (2019-2024): Buy when MACD crosses above signal line, sell on cross below. Results: 67% win rate, 14.2% annual return, max drawdown 8.3%. Strategy works best in trending markets with 2% ATR stops.",
          analysis: {
            type: "backtest" as const,
            data: {
              asset: "Gold",
              strategy: "MACD Crossover",
              winRate: "67%",
              annualReturn: "14.2%",
              maxDrawdown: "8.3%",
              period: "2019-2024",
            },
          },
        },
      ],
      general: [
        {
          content:
            "Market analysis shows mixed signals across asset classes. Equities remain in uptrend but showing signs of fatigue. Dollar strength pressuring commodities while crypto shows institutional accumulation. Recommend diversified approach with 40% stocks, 20% bonds, 20% commodities, 20% alternatives.",
          analysis: {
            type: "portfolio" as const,
            data: {
              allocation: "Diversified",
              stocks: "40%",
              bonds: "20%",
              commodities: "20%",
              alternatives: "20%",
              outlook: "Cautiously optimistic",
            },
          },
        },
      ],
    }

    const assetResponses = responses[assetType as keyof typeof responses] || responses.general
    const randomResponse = assetResponses[Math.floor(Math.random() * assetResponses.length)]

    return {
      id: Date.now().toString(),
      type: "ai",
      content: randomResponse.content,
      timestamp: new Date(),
      analysis: randomResponse.analysis,
    }
  }

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case "market":
        return <TrendingUp className="h-4 w-4" />
      case "portfolio":
        return <BarChart3 className="h-4 w-4" />
      case "risk":
        return <AlertTriangle className="h-4 w-4" />
      case "opportunity":
        return <Lightbulb className="h-4 w-4" />
      case "backtest":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getAnalysisColor = (type: string) => {
    switch (type) {
      case "market":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "portfolio":
        return "bg-purple-500/10 text-purple-700 border-purple-200"
      case "risk":
        return "bg-red-500/10 text-red-700 border-red-200"
      case "opportunity":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "backtest":
        return "bg-orange-500/10 text-orange-700 border-orange-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">AI Financial Coach</h2>
              <p className="text-sm text-muted-foreground">Your personal investment advisor</p>
            </div>
          </div>
          {plan === "free" && (
            <Badge variant="outline">
              {dailyQueries}/{maxQueries} queries today
            </Badge>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex space-x-3 max-w-3xl ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  {message.type === "ai" ? (
                    <>
                      <AvatarImage src="/ai-avatar.png" />
                      <AvatarFallback className="bg-primary/10">
                        <Brain className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/professional-avatar.png" />
                      <AvatarFallback>AT</AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div className="space-y-2">
                  <Card className={message.type === "user" ? "bg-primary text-primary-foreground" : ""}>
                    <CardContent className="p-3">
                      <p className="text-sm">{message.content}</p>
                    </CardContent>
                  </Card>

                  {message.analysis && (
                    <Card className={`border ${getAnalysisColor(message.analysis.type)}`}>
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          {getAnalysisIcon(message.analysis.type)}
                          <span className="text-sm font-medium capitalize">{message.analysis.type} Analysis</span>
                        </div>
                        {message.analysis.data && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(message.analysis.data).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium capitalize">{key}: </span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-3xl">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">
                    <Brain className="h-4 w-4 text-primary animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card p-4">
        {plan === "free" && dailyQueries >= maxQueries ? (
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">You've reached your daily query limit</p>
              <Button size="sm">Upgrade to Pro for Unlimited Queries</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex space-x-2">
            <Input
              placeholder="Try: 'Show EUR/USD 6-month chart with Bollinger Bands' or 'Backtest gold MACD strategy'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
