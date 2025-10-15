"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useScreener } from "@/hooks/use-market-data";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Lock,
  Target,
  Zap,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ScreenerInterfaceProps {
  plan: "free" | "pro" | "elite";
}

export function ScreenerInterface({ plan }: ScreenerInterfaceProps) {
  const [activeTab, setActiveTab] = useState("stocks");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const [stockFilters, setStockFilters] = useState({
    sortBy: "score",
    minScore: "7",
    maxPE: "50",
    minMarketCap: "1000",
    maxMarketCap: "500000",
    minVolume: "1000000",
    sector: "all",
    minDividendYield: "0",
    maxDebtToEquity: "100",
    minROE: "10",
    priceRange: [10, 1000] as [number, number],
  });

  const [optionsFilters, setOptionsFilters] = useState({
    strategy: "csp", // cash secured puts
    minYield: "8",
    maxYield: "25",
    minDTE: "30",
    maxDTE: "60",
    minIVRank: "20",
    maxIVRank: "80",
    minLiquidity: "100",
    underlyingType: "all",
  });

  const [cryptoFilters, setCryptoFilters] = useState({
    sortBy: "whale_flow",
    minMarketCap: "100",
    maxMarketCap: "1000000",
    minVolume24h: "10",
    whaleActivity: "accumulation",
    exchangeFlow: "all",
    socialSentiment: "all",
    technicalSignal: "all",
  });

  const [forexFilters, setForexFilters] = useState({
    sortBy: "volatility",
    pairType: "major", // major, minor, exotic
    minVolatility: "0.5",
    maxVolatility: "3.0",
    trend: "all", // bullish, bearish, sideways
    newsImpact: "all",
    sessionTime: "all", // london, ny, tokyo, sydney
  });

  const [commoditiesFilters, setCommoditiesFilters] = useState({
    sortBy: "momentum",
    category: "all", // metals, energy, agriculture
    seasonalPattern: "all",
    inventoryLevel: "all",
    newsEvents: "all",
    technicalSetup: "all",
  });

  // Memoize filters to prevent infinite re-renders
  const filters = useMemo(
    () => ({
      ...getCurrentFilters(),
      page: currentPage,
      limit: itemsPerPage,
    }),
    [
      activeTab,
      currentPage,
      itemsPerPage,
      stockFilters,
      optionsFilters,
      cryptoFilters,
      forexFilters,
      commoditiesFilters,
    ]
  );

  const { data, loading, error, refetch } = useScreener(
    activeTab as any,
    plan,
    filters
  );

  // Track when we've reached the end based on getting fewer results than requested
  useEffect(() => {
    if (data.length === 0) {
      // No data returned - we've reached the end
      setHasReachedEnd(true);
    } else if (data.length < itemsPerPage) {
      // Got some data but less than requested - likely end of data
      setHasReachedEnd(true);
    } else if (data.length === itemsPerPage) {
      // Got exactly what was requested - likely more data available
      setHasReachedEnd(false);
    }
  }, [data.length, itemsPerPage]);

  // For cursor-based pagination, we only disable Next if we've reached the end
  const hasMoreData = !hasReachedEnd;

  // Reset to page 1 when filters change
  const handleFilterChange = (
    filterSetter: Function,
    key: string,
    value: any
  ) => {
    filterSetter((prev: any) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    setHasReachedEnd(false);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
    setHasReachedEnd(false);
  };

  function getCurrentFilters() {
    switch (activeTab) {
      case "stocks":
        return stockFilters;
      case "options":
        return optionsFilters;
      case "crypto":
        return cryptoFilters;
      case "forex":
        return forexFilters;
      case "commodities":
        return commoditiesFilters;
      default:
        return stockFilters;
    }
  }

  const handleStockFilterChange = (
    key: string,
    value: string | number | [number, number]
  ) => {
    setStockFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleOptionsFilterChange = (key: string, value: string) => {
    setOptionsFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCryptoFilterChange = (key: string, value: string) => {
    setCryptoFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleForexFilterChange = (key: string, value: string) => {
    setForexFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCommoditiesFilterChange = (key: string, value: string) => {
    setCommoditiesFilters((prev) => ({ ...prev, [key]: value }));
  };

  const renderStockResults = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead>P/E</TableHead>
          <TableHead>Div Yield</TableHead>
          <TableHead>ROE</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((stock: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <div>
                <div className="font-medium">{stock.ticker || "N/A"}</div>
                <div className="text-sm text-muted-foreground">
                  {stock.name || "N/A"}
                </div>
              </div>
            </TableCell>
            <TableCell>${stock.price?.toFixed(2) || "0.00"}</TableCell>
            <TableCell>
              <div
                className={`flex items-center space-x-1 ${
                  (stock.change || 0) > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {(stock.change || 0) > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {(stock.change || 0) > 0 ? "+" : ""}
                  {stock.changePercent?.toFixed(2) || "0.00"}%
                </span>
              </div>
            </TableCell>
            <TableCell>{stock.volume?.toLocaleString() || "0"}</TableCell>
            <TableCell>
              ${((stock.marketCap || 0) / 1000000000)?.toFixed(1) || "0.0"}B
            </TableCell>
            <TableCell>{stock.pe?.toFixed(1) || "0.0"}</TableCell>
            <TableCell>{stock.dividendYield?.toFixed(2)}%</TableCell>
            <TableCell>{stock.roe?.toFixed(1)}%</TableCell>
            <TableCell>
              <Badge variant="secondary">
                {stock.score?.toFixed(1) || "0.0"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderOptionsResults = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Underlying</TableHead>
          <TableHead>Strike</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Premium</TableHead>
          <TableHead>Yield</TableHead>
          <TableHead>IV Rank</TableHead>
          <TableHead>Liquidity</TableHead>
          <TableHead>Risk Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((option: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <div>
                <div className="font-medium">{option.underlying || "N/A"}</div>
                <div className="text-sm text-muted-foreground">
                  {option.strategy || "N/A"}
                </div>
              </div>
            </TableCell>
            <TableCell>${option.strike || "0"}</TableCell>
            <TableCell>{option.dte || "0"} DTE</TableCell>
            <TableCell>${option.premium?.toFixed(2) || "0.00"}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-green-700">
                {option.yield?.toFixed(1) || "0.0"}%
              </Badge>
            </TableCell>
            <TableCell>{option.ivRank || "0"}%</TableCell>
            <TableCell>
              <Badge
                variant={(option.liquidity || 0) > 500 ? "default" : "outline"}
              >
                {option.liquidity || "0"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  (option.riskScore || 0) < 5 ? "secondary" : "destructive"
                }
              >
                {option.riskScore?.toFixed(1) || "0.0"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCryptoResults = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Volume 24h</TableHead>
          <TableHead>Market Cap</TableHead>
          <TableHead>Whale Flow</TableHead>
          <TableHead>Exchange Flow</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((crypto: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <div>
                <div className="font-medium">{crypto.symbol || "N/A"}</div>
                <div className="text-sm text-muted-foreground">
                  {crypto.name || "N/A"}
                </div>
              </div>
            </TableCell>
            <TableCell>${crypto.price?.toLocaleString() || "0"}</TableCell>
            <TableCell>
              <div
                className={`flex items-center space-x-1 ${
                  (crypto.change || 0) > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {(crypto.change || 0) > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {(crypto.change || 0) > 0 ? "+" : ""}
                  {crypto.changePercent?.toFixed(2) || "0.00"}%
                </span>
              </div>
            </TableCell>
            <TableCell>
              ${((crypto.volume24h || 0) / 1000000000)?.toFixed(1) || "0.0"}B
            </TableCell>
            <TableCell>
              ${((crypto.marketCap || 0) / 1000000000)?.toFixed(1) || "0.0"}B
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  crypto.whaleFlow === "accumulation"
                    ? "secondary"
                    : "destructive"
                }
              >
                {crypto.whaleFlow || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {crypto.exchangeFlow || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {crypto.score?.toFixed(1) || "0.0"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderForexResults = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pair</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Volatility</TableHead>
          <TableHead>Trend</TableHead>
          <TableHead>Session</TableHead>
          <TableHead>News Impact</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((forex: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <div>
                <div className="font-medium">{forex.pair || "N/A"}</div>
                <div className="text-sm text-muted-foreground">
                  {forex.type || "N/A"}
                </div>
              </div>
            </TableCell>
            <TableCell>{forex.price?.toFixed(4) || "0.0000"}</TableCell>
            <TableCell>
              <div
                className={`flex items-center space-x-1 ${
                  (forex.change || 0) > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {(forex.change || 0) > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {(forex.change || 0) > 0 ? "+" : ""}
                  {forex.changePercent?.toFixed(2) || "0.00"}%
                </span>
              </div>
            </TableCell>
            <TableCell>{forex.volatility?.toFixed(2) || "0.00"}%</TableCell>
            <TableCell>
              <Badge
                variant={
                  forex.trend === "bullish"
                    ? "secondary"
                    : forex.trend === "bearish"
                    ? "destructive"
                    : "outline"
                }
              >
                {forex.trend || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {forex.activeSession || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  forex.newsImpact === "high" ? "destructive" : "secondary"
                }
              >
                {forex.newsImpact || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {forex.score?.toFixed(1) || "0.0"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCommoditiesResults = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Commodity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Momentum</TableHead>
          <TableHead>Seasonal</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>News Events</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((commodity: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <div>
                <div className="font-medium">{commodity.symbol || "N/A"}</div>
                <div className="text-sm text-muted-foreground">
                  {commodity.category || "N/A"}
                </div>
              </div>
            </TableCell>
            <TableCell>${commodity.price?.toFixed(2) || "0.00"}</TableCell>
            <TableCell>
              <div
                className={`flex items-center space-x-1 ${
                  (commodity.change || 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(commodity.change || 0) > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {(commodity.change || 0) > 0 ? "+" : ""}
                  {commodity.changePercent?.toFixed(2) || "0.00"}%
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  commodity.momentum === "strong" ? "secondary" : "outline"
                }
              >
                {commodity.momentum || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  commodity.seasonal === "favorable" ? "secondary" : "outline"
                }
              >
                {commodity.seasonal || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  commodity.inventory === "low" ? "destructive" : "secondary"
                }
              >
                {commodity.inventory || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  (commodity.newsEvents || 0) > 0 ? "destructive" : "outline"
                }
              >
                {commodity.newsEvents || "0"} events
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {commodity.score?.toFixed(1) || "0.0"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (plan === "free" && activeTab !== "stocks") {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 p-6 flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">
                Premium Screener Required
              </h3>
              <p className="text-muted-foreground">
                {activeTab === "crypto"
                  ? "Crypto"
                  : activeTab === "forex"
                  ? "Forex"
                  : activeTab === "options"
                  ? "Options"
                  : "Commodities"}{" "}
                screener is available with Pro or Elite plans
              </p>
              <Button>Upgrade to Pro</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 p-6">
      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Screening Filters</span>
          </CardTitle>
          <CardDescription>
            Customize your search criteria for {activeTab}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Stock Filters */}
          {activeTab === "stocks" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={stockFilters.sortBy}
                  onValueChange={(value) =>
                    handleStockFilterChange("sortBy", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">AI Score</SelectItem>
                    <SelectItem value="change">Price Change</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="marketCap">Market Cap</SelectItem>
                    <SelectItem value="dividendYield">
                      Dividend Yield
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sector</Label>
                <Select
                  value={stockFilters.sector}
                  onValueChange={(value) =>
                    handleStockFilterChange("sector", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="financials">Financials</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="consumer">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Min Market Cap (M)</Label>
                <Input
                  type="number"
                  value={stockFilters.minMarketCap}
                  onChange={(e) =>
                    handleStockFilterChange("minMarketCap", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Min Dividend Yield (%)</Label>
                <Input
                  type="number"
                  value={stockFilters.minDividendYield}
                  onChange={(e) =>
                    handleStockFilterChange("minDividendYield", e.target.value)
                  }
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Price Range: ${stockFilters.priceRange[0]} - $
                  {stockFilters.priceRange[1]}
                </Label>
                <Slider
                  value={stockFilters.priceRange}
                  onValueChange={(value) =>
                    handleStockFilterChange(
                      "priceRange",
                      value as [number, number]
                    )
                  }
                  max={1000}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Options Filters */}
          {activeTab === "options" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Strategy</Label>
                <Select
                  value={optionsFilters.strategy}
                  onValueChange={(value) =>
                    handleOptionsFilterChange("strategy", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csp">Cash Secured Puts</SelectItem>
                    <SelectItem value="cc">Covered Calls</SelectItem>
                    <SelectItem value="wheel">Wheel Strategy</SelectItem>
                    <SelectItem value="iron_condor">Iron Condor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Min Yield (%)</Label>
                <Input
                  type="number"
                  value={optionsFilters.minYield}
                  onChange={(e) =>
                    handleOptionsFilterChange("minYield", e.target.value)
                  }
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>Days to Expiry</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={optionsFilters.minDTE}
                    onChange={(e) =>
                      handleOptionsFilterChange("minDTE", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={optionsFilters.maxDTE}
                    onChange={(e) =>
                      handleOptionsFilterChange("maxDTE", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>IV Rank Range</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={optionsFilters.minIVRank}
                    onChange={(e) =>
                      handleOptionsFilterChange("minIVRank", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={optionsFilters.maxIVRank}
                    onChange={(e) =>
                      handleOptionsFilterChange("maxIVRank", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Crypto Filters */}
          {activeTab === "crypto" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={cryptoFilters.sortBy}
                  onValueChange={(value) =>
                    handleCryptoFilterChange("sortBy", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whale_flow">Whale Flow</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="marketCap">Market Cap</SelectItem>
                    <SelectItem value="change">Price Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Whale Activity</Label>
                <Select
                  value={cryptoFilters.whaleActivity}
                  onValueChange={(value) =>
                    handleCryptoFilterChange("whaleActivity", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activity</SelectItem>
                    <SelectItem value="accumulation">Accumulation</SelectItem>
                    <SelectItem value="distribution">Distribution</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exchange Flow</Label>
                <Select
                  value={cryptoFilters.exchangeFlow}
                  onValueChange={(value) =>
                    handleCryptoFilterChange("exchangeFlow", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Flows</SelectItem>
                    <SelectItem value="inflow">Exchange Inflow</SelectItem>
                    <SelectItem value="outflow">Exchange Outflow</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Min Market Cap (M)</Label>
                <Input
                  type="number"
                  value={cryptoFilters.minMarketCap}
                  onChange={(e) =>
                    handleCryptoFilterChange("minMarketCap", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* Forex Filters */}
          {activeTab === "forex" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Pair Type</Label>
                <Select
                  value={forexFilters.pairType}
                  onValueChange={(value) =>
                    handleForexFilterChange("pairType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pairs</SelectItem>
                    <SelectItem value="major">Major Pairs</SelectItem>
                    <SelectItem value="minor">Minor Pairs</SelectItem>
                    <SelectItem value="exotic">Exotic Pairs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trend</Label>
                <Select
                  value={forexFilters.trend}
                  onValueChange={(value) =>
                    handleForexFilterChange("trend", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trends</SelectItem>
                    <SelectItem value="bullish">Bullish</SelectItem>
                    <SelectItem value="bearish">Bearish</SelectItem>
                    <SelectItem value="sideways">Sideways</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Session Time</Label>
                <Select
                  value={forexFilters.sessionTime}
                  onValueChange={(value) =>
                    handleForexFilterChange("sessionTime", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="tokyo">Tokyo</SelectItem>
                    <SelectItem value="sydney">Sydney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Volatility Range (%)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={forexFilters.minVolatility}
                    onChange={(e) =>
                      handleForexFilterChange("minVolatility", e.target.value)
                    }
                    step="0.1"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={forexFilters.maxVolatility}
                    onChange={(e) =>
                      handleForexFilterChange("maxVolatility", e.target.value)
                    }
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Commodities Filters */}
          {activeTab === "commodities" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={commoditiesFilters.category}
                  onValueChange={(value) =>
                    handleCommoditiesFilterChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="metals">Precious Metals</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="industrial">
                      Industrial Metals
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Seasonal Pattern</Label>
                <Select
                  value={commoditiesFilters.seasonalPattern}
                  onValueChange={(value) =>
                    handleCommoditiesFilterChange("seasonalPattern", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Patterns</SelectItem>
                    <SelectItem value="favorable">Favorable</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="unfavorable">Unfavorable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Technical Setup</Label>
                <Select
                  value={commoditiesFilters.technicalSetup}
                  onValueChange={(value) =>
                    handleCommoditiesFilterChange("technicalSetup", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Setups</SelectItem>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="reversal">Reversal</SelectItem>
                    <SelectItem value="continuation">Continuation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>News Events</Label>
                <Select
                  value={commoditiesFilters.newsEvents}
                  onValueChange={(value) =>
                    handleCommoditiesFilterChange("newsEvents", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="opec">OPEC Meetings</SelectItem>
                    <SelectItem value="inventory">Inventory Reports</SelectItem>
                    <SelectItem value="weather">Weather Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <Button onClick={refetch} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "Search"}
            </Button>
            <div className="text-sm text-muted-foreground">
              {plan === "free"
                ? "Top 5 results (upgrade for unlimited)"
                : `Showing all results`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Screening Results</CardTitle>
          <CardDescription>
            {plan === "free"
              ? "Top 5 results (upgrade for unlimited)"
              : `${data.length} results found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1); // Reset to page 1 when switching tabs
              setHasReachedEnd(false); // Reset end detection when switching tabs
            }}
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="options" disabled={plan === "free"}>
                <Target className="h-4 w-4 mr-1" />
                Options
              </TabsTrigger>
              <TabsTrigger value="crypto" disabled={plan === "free"}>
                <Zap className="h-4 w-4 mr-1" />
                Crypto
              </TabsTrigger>
              <TabsTrigger value="forex" disabled={plan === "free"}>
                <DollarSign className="h-4 w-4 mr-1" />
                Forex
              </TabsTrigger>
              <TabsTrigger value="commodities" disabled={plan === "free"}>
                Commodities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stocks" className="mt-6">
              {loading ? (
                <div className="text-center py-8">Loading stock data...</div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">{error}</div>
              ) : (
                <>
                  {renderStockResults()}
                  {plan !== "free" && data.length > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage}
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="items-per-page" className="text-sm">
                            Show:
                          </Label>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1 || loading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => p + 1)}
                          disabled={loading || !hasMoreData}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="options" className="mt-6">
              {loading ? (
                <div className="text-center py-8">Loading options data...</div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">{error}</div>
              ) : (
                <>
                  {renderOptionsResults()}
                  {data.length > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage}
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="items-per-page" className="text-sm">
                            Show:
                          </Label>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1 || loading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => p + 1)}
                          disabled={loading || !hasMoreData}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="crypto" className="mt-6">
              {loading ? (
                <div className="text-center py-8">Loading crypto data...</div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">{error}</div>
              ) : (
                <>
                  {renderCryptoResults()}
                  {data.length > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage}
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="items-per-page" className="text-sm">
                            Show:
                          </Label>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1 || loading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => p + 1)}
                          disabled={loading || !hasMoreData}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="forex" className="mt-6">
              {loading ? (
                <div className="text-center py-8">Loading forex data...</div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">{error}</div>
              ) : (
                <>
                  {renderForexResults()}
                  {data.length > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage}
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="items-per-page" className="text-sm">
                            Show:
                          </Label>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1 || loading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => p + 1)}
                          disabled={loading || !hasMoreData}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="commodities" className="mt-6">
              {loading ? (
                <div className="text-center py-8">
                  Loading commodities data...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">{error}</div>
              ) : (
                <>
                  {renderCommoditiesResults()}
                  {data.length > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage}
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="items-per-page" className="text-sm">
                            Show:
                          </Label>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1 || loading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => p + 1)}
                          disabled={loading || !hasMoreData}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
