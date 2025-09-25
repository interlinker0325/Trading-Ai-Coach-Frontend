"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedChart } from "@/components/advanced-chart";
import { Search, TrendingUp } from "lucide-react";

export default function ChartsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [selectedAssetType, setSelectedAssetType] = useState<
    "stocks" | "crypto" | "forex" | "commodities"
  >("stocks");
  const [searchQuery, setSearchQuery] = useState("");
  const [plan] = useState<"free" | "pro" | "elite">("pro"); // Mock user plan

  const popularSymbols = {
    stocks: ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN", "SPY", "QQQ"],
    crypto: ["BTC", "ETH", "SOL", "ADA", "DOT", "AVAX", "MATIC", "LINK"],
    forex: [
      "EUR/USD",
      "GBP/USD",
      "USD/JPY",
      "AUD/USD",
      "USD/CAD",
      "NZD/USD",
      "EUR/GBP",
      "GBP/JPY",
    ],
    commodities: [
      "Gold",
      "Silver",
      "Oil",
      "Natural Gas",
      "Copper",
      "Platinum",
      "Palladium",
      "Wheat",
    ],
  };

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSelectedSymbol(searchQuery.toUpperCase());
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Advanced Charts</h1>
          <p className="text-muted-foreground">
            TradingView-style charting with technical analysis
          </p>
        </div>

        {/* Symbol Search and Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Symbol Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Search symbol (e.g., AAPL, BTC, EUR/USD, Gold)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Select
                value={selectedAssetType}
                onValueChange={(value: any) => setSelectedAssetType(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stocks & ETFs</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="commodities">Commodities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs
              value={selectedAssetType}
              onValueChange={(value: any) => setSelectedAssetType(value)}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                <TabsTrigger value="forex">Forex</TabsTrigger>
                <TabsTrigger value="commodities">Commodities</TabsTrigger>
              </TabsList>

              {Object.entries(popularSymbols).map(([assetType, symbols]) => (
                <TabsContent key={assetType} value={assetType} className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {symbols.map((symbol) => (
                      <Button
                        key={symbol}
                        variant={
                          selectedSymbol === symbol ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleSymbolSelect(symbol)}
                      >
                        {symbol}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Advanced Chart Component */}
        <AdvancedChart
          symbol={selectedSymbol}
          assetType={selectedAssetType}
          plan={plan}
        />
      </div>
    </div>
  );
}
