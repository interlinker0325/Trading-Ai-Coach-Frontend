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
import { useScreener } from "@/hooks/use-market-data";
import {
  TrendingUp,
  TrendingDown,
  Lock,
  Target,
  Zap,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface ScreenerInterfaceProps {
  plan: "free" | "pro" | "elite";
}

export function ScreenerInterface({ plan }: ScreenerInterfaceProps) {
  const [activeTab, setActiveTab] = useState("stocks");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // This will be sent to the API
  const [isSearching, setIsSearching] = useState(false);

  // Memoize basic pagination parameters
  const paginationParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
    }),
    [currentPage, itemsPerPage]
  );

  // For options tab, only send search query if it's not empty
  const effectiveSearchQuery =
    activeTab === "options" && !searchQuery.trim() ? undefined : searchQuery;

  const { data, loading, error } = useScreener(
    activeTab as any,
    plan,
    paginationParams,
    effectiveSearchQuery
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

  // Reset to page 1 when switching tabs
  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setIsNavigating(true); // Show loading when switching tabs
    }
    setActiveTab(tab);
    setCurrentPage(1);
    setHasReachedEnd(false);
    setSearchTerm(""); // Reset search input when switching tabs
    setSearchQuery(""); // Reset search query when switching tabs
  };

  // Handle search button click
  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim();

    // Don't search if the search term hasn't changed
    if (trimmedSearch === searchQuery) {
      return;
    }

    setIsSearching(true);
    setSearchQuery(trimmedSearch);
  };

  // Handle see list button click - clear search and show full list
  const handleSeeList = () => {
    setIsSearching(true);
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(1);
    setHasReachedEnd(false);
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !loading &&
      !isNavigating &&
      !isSearching &&
      !(activeTab === "options" && !searchTerm.trim())
    ) {
      handleSearch();
    }
  };

  // Handle pagination with loading states
  const handlePreviousPage = async () => {
    if (currentPage > 1 && !isNavigating) {
      setIsNavigating(true);
      setCurrentPage((p) => Math.max(1, p - 1));
      setHasReachedEnd(false);
    }
  };

  const handleNextPage = async () => {
    if (!isNavigating && hasMoreData) {
      setIsNavigating(true);
      setCurrentPage((p) => p + 1);
    }
  };

  // Reset navigation loading when data changes
  useEffect(() => {
    setIsNavigating(false);
    setIsSearching(false); // Reset search loading when data changes
  }, [data]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
    setHasReachedEnd(false);
  }, [searchQuery]);

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
    setHasReachedEnd(false);
  };

  const renderStockResults = () => (
    <div className="overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Symbol</TableHead>
            <TableHead className="whitespace-nowrap">Price</TableHead>
            <TableHead className="whitespace-nowrap">Change</TableHead>
            <TableHead className="whitespace-nowrap">Volume 24h</TableHead>
            <TableHead className="whitespace-nowrap">Market Cap</TableHead>
            <TableHead className="whitespace-nowrap">Div Yield</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stock: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="whitespace-nowrap">
                <div>
                  <div className="font-medium">{stock.ticker || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">
                    {stock.name || "N/A"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${stock.price?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div
                  className={`flex items-center space-x-1 ${
                    (stock.changePercent || 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(stock.changePercent || 0) > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {(stock.changePercent || 0) > 0 ? "+" : ""}
                    {stock.changePercent?.toFixed(2) || "0.00"}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${stock.volume?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${stock.marketCap?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {stock.dividendYield?.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderCryptoResults = () => (
    <div className="overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Symbol</TableHead>
            <TableHead className="whitespace-nowrap">Price</TableHead>
            <TableHead className="whitespace-nowrap">Change</TableHead>
            <TableHead className="whitespace-nowrap">Volume 24h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((crypto: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="whitespace-nowrap">
                <div>
                  <div className="font-medium">
                    {crypto.ticker?.substring(2, crypto.ticker?.length) ||
                      "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {crypto.name || "N/A"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${crypto.price?.toLocaleString() || "0"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div
                  className={`flex items-center space-x-1 ${
                    (crypto.changePercent || 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(crypto.changePercent || 0) > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {(crypto.changePercent || 0) > 0 ? "+" : ""}
                    {crypto.changePercent?.toFixed(2) || "0.00"}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${crypto.volume?.toFixed(2) || "0.00"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderForexResults = () => (
    <div className="overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Pair</TableHead>
            <TableHead className="whitespace-nowrap">Price</TableHead>
            <TableHead className="whitespace-nowrap">Change</TableHead>
            <TableHead className="whitespace-nowrap">Volume 24h</TableHead>
            {/* <TableHead>Trend</TableHead> */}
            {/* <TableHead>Session</TableHead> */}
            {/* <TableHead>News Impact</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((forex: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="whitespace-nowrap">
                <div>
                  <div className="font-medium">
                    {forex.ticker?.substring(2, forex.ticker?.length) || "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {forex.name || "N/A"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {forex.price?.toFixed(4) || "0.0000"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div
                  className={`flex items-center space-x-1 ${
                    (forex.changePercent || 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(forex.changePercent || 0) > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {(forex.changePercent || 0) > 0 ? "+" : ""}
                    {forex.changePercent?.toFixed(2) || "0.00"}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${forex.volume?.toFixed(2) || "0.00"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderOptionsResults = () => (
    <div className="overflow-x-auto">
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">
              Underlying Ticker
            </TableHead>
            <TableHead className="whitespace-nowrap">Contract Type</TableHead>
            <TableHead className="whitespace-nowrap">Strike Price</TableHead>
            <TableHead className="whitespace-nowrap">Expiration Date</TableHead>
            <TableHead className="whitespace-nowrap">Price</TableHead>
            <TableHead className="whitespace-nowrap">Change Percent</TableHead>
            <TableHead className="whitespace-nowrap">Volume</TableHead>
            <TableHead className="whitespace-nowrap">
              Implied Volatility
            </TableHead>
            <TableHead className="whitespace-nowrap">Open Interest</TableHead>
            <TableHead className="whitespace-nowrap">Greek(Delta)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((option: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="whitespace-nowrap">
                <div>
                  <div className="font-medium">
                    {option.underlying_asset?.ticker || "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option.details?.ticker || "N/A"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {option.details?.contract_type || "N/A"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${option.details?.strike_price || "0"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {option.details?.expiration_date || "N/A"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${option.day?.close?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div
                  className={`flex items-center space-x-1 ${
                    (option.day?.change_percent || 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(option.day?.change_percent || 0) > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {(option.day?.change_percent || 0) > 0 ? "+" : ""}
                    {option.day?.change_percent?.toFixed(2) || "0.00"}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {option.day?.volume?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {option.implied_volatility?.toFixed(2) || "0.00"}%
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {option.open_interest || 0}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="secondary" className="text-green-700">
                  {option.greeks?.delta?.toFixed(1) || "0.0"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
                  : "Options"}{" "}
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
          {/* Search Input */}
          <div className="mb-6">
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="search"
                type="text"
                placeholder={`Search ${activeTab} by ticker...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                disabled={loading || isNavigating || isSearching}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="px-6 flex-1 sm:flex-none"
                  disabled={
                    isSearching ||
                    loading ||
                    isNavigating ||
                    (activeTab === "options" && !searchTerm.trim())
                  }
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>
                <Button
                  onClick={handleSeeList}
                  variant="outline"
                  className="px-6 flex-1 sm:flex-none"
                  disabled={
                    isSearching ||
                    loading ||
                    isNavigating ||
                    activeTab === "options"
                  }
                >
                  {isSearching && searchQuery === "" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    "See List"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                value="stocks"
                disabled={loading || isNavigating || isSearching}
              >
                Stocks
              </TabsTrigger>
              <TabsTrigger
                value="crypto"
                disabled={
                  plan === "free" || loading || isNavigating || isSearching
                }
              >
                <Zap className="h-4 w-4 mr-1" />
                Crypto
              </TabsTrigger>
              <TabsTrigger
                value="forex"
                disabled={
                  plan === "free" || loading || isNavigating || isSearching
                }
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Forex
              </TabsTrigger>
              <TabsTrigger
                value="options"
                disabled={
                  plan === "free" || loading || isNavigating || isSearching
                }
              >
                <Target className="h-4 w-4 mr-1" />
                Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stocks" className="mt-6">
              <div className="relative">
                {(loading || isNavigating || isSearching) &&
                  data.length > 0 && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-start justify-center pt-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                        <div>Loading stock data...</div>
                      </div>
                    </div>
                  )}
                {(loading || isNavigating || isSearching) &&
                data.length === 0 ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <div>Loading stock data...</div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    {error}
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-2">
                      No Data
                    </div>
                    <div className="text-sm text-muted-foreground">
                      No stocks found matching your criteria
                    </div>
                  </div>
                ) : (
                  <>
                    {renderStockResults()}
                    {plan !== "free" && data.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
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
                            onClick={handlePreviousPage}
                            disabled={
                              currentPage === 1 || loading || isNavigating
                            }
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={loading || !hasMoreData || isNavigating}
                          >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="mt-6">
              <div className="relative">
                {(loading || isNavigating || isSearching) &&
                  data.length > 0 && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-start justify-center pt-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                        <div>Loading crypto data...</div>
                      </div>
                    </div>
                  )}
                {(loading || isNavigating || isSearching) &&
                data.length === 0 ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <div>Loading crypto data...</div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    {error}
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-2">
                      No Data
                    </div>
                    <div className="text-sm text-muted-foreground">
                      No crypto found matching your criteria
                    </div>
                  </div>
                ) : (
                  <>
                    {renderCryptoResults()}
                    {data.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
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
                            onClick={handlePreviousPage}
                            disabled={
                              currentPage === 1 || loading || isNavigating
                            }
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={loading || !hasMoreData || isNavigating}
                          >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="forex" className="mt-6">
              <div className="relative">
                {(loading || isNavigating || isSearching) &&
                  data.length > 0 && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-start justify-center pt-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                        <div>Loading forex data...</div>
                      </div>
                    </div>
                  )}
                {(loading || isNavigating || isSearching) &&
                data.length === 0 ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <div>Loading forex data...</div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    {error}
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-2">
                      No Data
                    </div>
                    <div className="text-sm text-muted-foreground">
                      No forex pairs found matching your criteria
                    </div>
                  </div>
                ) : (
                  <>
                    {renderForexResults()}
                    {data.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
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
                            onClick={handlePreviousPage}
                            disabled={
                              currentPage === 1 || loading || isNavigating
                            }
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={loading || !hasMoreData || isNavigating}
                          >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="options" className="mt-6">
              <div className="relative">
                {(loading || isNavigating || isSearching) &&
                  data.length > 0 && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-start justify-center pt-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                        <div>Loading options data...</div>
                      </div>
                    </div>
                  )}
                {(loading || isNavigating || isSearching) &&
                data.length === 0 ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <div>Loading options data...</div>
                  </div>
                ) : !searchQuery.trim() ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-2">
                      Search Required
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Please enter a ticker symbol to search for options
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    {error}
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-2">
                      No Data
                    </div>
                    <div className="text-sm text-muted-foreground">
                      No options found matching your criteria
                    </div>
                  </div>
                ) : (
                  <>
                    {renderOptionsResults()}
                    {data.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
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
                            onClick={handlePreviousPage}
                            disabled={
                              currentPage === 1 || loading || isNavigating
                            }
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={loading || !hasMoreData || isNavigating}
                          >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
