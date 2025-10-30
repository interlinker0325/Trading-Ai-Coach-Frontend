"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Bell,
  Lock,
  TrendingUp,
  DollarSign,
  Zap,
  AlertTriangle,
  Eye,
  Building2,
  Newspaper,
} from "lucide-react";

interface EventFeedProps {
  plan: "free" | "pro" | "elite";
}

interface MarketEvent {
  id: string;
  type:
    | "insider_trade"
    | "unusual_options"
    | "whale_transaction"
    | "news"
    | "technical_signal"
    | "volatility_spike"
    | "analyst_upgrade"
    | "earnings";
  assetType: "stocks" | "crypto" | "forex" | "commodities";
  symbol: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: "low" | "medium" | "high";
  premium: boolean;
  data?: any;
}

export function EventFeed({ plan }: EventFeedProps) {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock event generation
  useEffect(() => {
    const generateMockEvents = (): MarketEvent[] => {
      const mockEvents: MarketEvent[] = [
        {
          id: "1",
          type: "insider_trade",
          assetType: "stocks",
          symbol: "AAPL",
          title: "Insider Purchase Alert",
          description:
            "CEO Tim Cook purchased $2.5M worth of shares at $185.42",
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          severity: "high",
          premium: true,
          data: { amount: 2500000, price: 185.42, insider: "CEO Tim Cook" },
        },
        {
          id: "2",
          type: "whale_transaction",
          assetType: "crypto",
          symbol: "BTC",
          title: "Large Bitcoin Transfer",
          description: "15,000 BTC moved from exchange to cold storage",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          severity: "high",
          premium: true,
          data: { amount: 15000, direction: "exchange_to_cold" },
        },
        {
          id: "3",
          type: "unusual_options",
          assetType: "stocks",
          symbol: "TSLA",
          title: "Unusual Options Activity",
          description:
            "10,000 call options bought at $240 strike, expiring Friday",
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          severity: "medium",
          premium: true,
          data: { volume: 10000, strike: 240, type: "calls", expiry: "Friday" },
        },
        {
          id: "4",
          type: "news",
          assetType: "stocks",
          symbol: "NVDA",
          title: "Earnings Beat",
          description:
            "Q4 earnings beat expectations by 15%, revenue up 22% YoY",
          timestamp: new Date(Date.now() - 12 * 60 * 1000),
          severity: "high",
          premium: false,
          data: { beat_percentage: 15, revenue_growth: 22 },
        },
        {
          id: "5",
          type: "technical_signal",
          assetType: "forex",
          symbol: "EUR/USD",
          title: "Breakout Alert",
          description:
            "EUR/USD breaking above key resistance at 1.0850 with high volume",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          severity: "medium",
          premium: true,
          data: { level: 1.085, direction: "bullish", volume: "high" },
        },
        {
          id: "6",
          type: "volatility_spike",
          assetType: "commodities",
          symbol: "Gold",
          title: "Volatility Spike",
          description:
            "Gold volatility increased 45% following Fed announcement",
          timestamp: new Date(Date.now() - 18 * 60 * 1000),
          severity: "high",
          premium: false,
          data: { volatility_increase: 45, trigger: "Fed announcement" },
        },
        {
          id: "7",
          type: "analyst_upgrade",
          assetType: "stocks",
          symbol: "MSFT",
          title: "Analyst Upgrade",
          description: "Goldman Sachs upgrades to Buy, raises target to $420",
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          severity: "medium",
          premium: false,
          data: { firm: "Goldman Sachs", rating: "Buy", target: 420 },
        },
        {
          id: "8",
          type: "whale_transaction",
          assetType: "crypto",
          symbol: "ETH",
          title: "Ethereum Whale Movement",
          description:
            "50,000 ETH moved to Binance, potential selling pressure",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          severity: "medium",
          premium: true,
          data: {
            amount: 50000,
            exchange: "Binance",
            direction: "to_exchange",
          },
        },
      ];
      return mockEvents;
    };

    setLoading(true);
    setTimeout(() => {
      setEvents(generateMockEvents());
      setLoading(false);
    }, 1000);

    // Simulate real-time events for Pro/Elite users
    if (plan !== "free") {
      const interval = setInterval(() => {
        const newEvent: MarketEvent = {
          id: Date.now().toString(),
          type: "technical_signal",
          assetType: "stocks",
          symbol: "SPY",
          title: "Technical Signal",
          description: "SPY breaking above 20-day moving average with volume",
          timestamp: new Date(),
          severity: "low",
          premium: false,
          data: { indicator: "SMA20", direction: "bullish" },
        };

        setEvents((prev) => [newEvent, ...prev].slice(0, 20));

        // Show toast notification
        toast({
          title: "New Market Event",
          description: `${newEvent.symbol}: ${newEvent.title}`,
        });
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [plan, toast]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "insider_trade":
        return <Building2 className="h-4 w-4" />;
      case "unusual_options":
        return <Eye className="h-4 w-4" />;
      case "whale_transaction":
        return <Zap className="h-4 w-4" />;
      case "news":
        return <Newspaper className="h-4 w-4" />;
      case "technical_signal":
        return <TrendingUp className="h-4 w-4" />;
      case "volatility_spike":
        return <AlertTriangle className="h-4 w-4" />;
      case "analyst_upgrade":
        return <TrendingUp className="h-4 w-4" />;
      case "earnings":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-500/10 text-green-700 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getAssetTypeColor = (assetType: string) => {
    switch (assetType) {
      case "stocks":
        return "bg-blue-500/10 text-blue-700";
      case "crypto":
        return "bg-purple-500/10 text-purple-700";
      case "forex":
        return "bg-green-500/10 text-green-700";
      case "commodities":
        return "bg-orange-500/10 text-orange-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true;
    return event.assetType === activeTab;
  });

  const displayEvents =
    plan === "free"
      ? filteredEvents.filter((event) => !event.premium).slice(0, 3)
      : filteredEvents;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Market Events & Alerts</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time market events across all asset classes
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {plan !== "free" && (
              <Badge variant="secondary" className="text-xs">
                Live Updates
              </Badge>
            )}
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pb-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
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
          </div>

          <ScrollArea className="h-96 px-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {displayEvents.map((event) => (
                  <Alert
                    key={event.id}
                    className={`${getSeverityColor(
                      event.severity
                    )} transition-all hover:shadow-sm`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getAssetTypeColor(
                                event.assetType
                              )}`}
                            >
                              {event.symbol}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {event.type.replace("_", " ")}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {event.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1">
                          {event.title}
                        </h4>
                        <AlertDescription className="text-xs">
                          {event.description}
                        </AlertDescription>

                        {event.data && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {Object.entries(event.data).map(([key, value]) => (
                              <Badge
                                key={key}
                                variant="secondary"
                                className="text-xs"
                              >
                                {key}: {(value as string) ?? (value as number)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}

                {plan === "free" && (
                  <div className="space-y-2 mt-4">
                    {filteredEvents
                      .filter((event) => event.premium)
                      .slice(0, 2)
                      .map((event, index) => (
                        <div
                          key={`locked-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-dashed"
                        >
                          <div className="flex items-center space-x-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {event.type.replace("_", " ")} - {event.symbol}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Pro
                          </Badge>
                        </div>
                      ))}

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      size="sm"
                    >
                      Upgrade for Premium Alerts & Real-time Updates
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
