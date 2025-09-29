"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: "light" | "dark";
  height?: number;
  plan?: "free" | "pro" | "elite";
}

export function TradingViewChart({
  symbol = "AAPL",
  interval = "1D",
  theme = "light",
  height = 500,
  plan = "free",
}: TradingViewChartProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const [currentInterval, setCurrentInterval] = useState(interval);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Load TradingView widget script
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    const config = {
      autosize: true,
      symbol: `NASDAQ:${currentSymbol}`,
      interval: currentInterval,
      timezone: "Etc/UTC",
      theme: isDarkMode ? "dark" : "light",
      style: "1",
      locale: "en",
      toolbar_bg: isDarkMode ? "#1a1a1a" : "#f1f3f6",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: "tradingview_chart",
      studies:
        plan !== "free"
          ? [
              "RSI@tv-basicstudies",
              "MACD@tv-basicstudies",
              "BB@tv-basicstudies",
            ]
          : [],
      disabled_features:
        plan === "free"
          ? [
              "use_localstorage_for_settings",
              "volume_force_overlay",
              "create_volume_indicator_by_default",
            ]
          : [],
      enabled_features: ["study_templates"],
      overrides: {
        "paneProperties.background": isDarkMode ? "#1a1a1a" : "#ffffff",
        "paneProperties.vertGridProperties.color": isDarkMode
          ? "#2a2a2a"
          : "#e1e3e6",
        "paneProperties.horzGridProperties.color": isDarkMode
          ? "#2a2a2a"
          : "#e1e3e6",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": isDarkMode ? "#d1d4dc" : "#131722",
      },
    };

    script.innerHTML = JSON.stringify(config);

    const container = document.getElementById("tradingview_chart");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [currentSymbol, currentInterval, isDarkMode, plan]);

  const popularSymbols = [
    { symbol: "AAPL", name: "Apple" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "NVDA", name: "NVIDIA" },
    { symbol: "MSFT", name: "Microsoft" },
    { symbol: "GOOGL", name: "Google" },
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "SPY", name: "S&P 500" },
    { symbol: "QQQ", name: "NASDAQ 100" },
  ];

  const intervals = [
    { value: "1", label: "1m", disabled: plan === "free" },
    { value: "5", label: "5m", disabled: plan === "free" },
    { value: "15", label: "15m", disabled: plan === "free" },
    { value: "60", label: "1H", disabled: plan === "free" },
    { value: "240", label: "4H", disabled: false },
    { value: "1D", label: "1D", disabled: false },
    { value: "1W", label: "1W", disabled: false },
  ];

  const handleSymbolChange = (newSymbol: string) => {
    setCurrentSymbol(newSymbol);
  };

  const handleIntervalChange = (newInterval: string) => {
    setCurrentInterval(newInterval);
  };

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <Card>
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold">{currentSymbol}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">NASDAQ</span>
                  <Badge variant={plan === "free" ? "outline" : "default"}>
                    {plan === "free"
                      ? "Free"
                      : plan === "pro"
                      ? "Pro"
                      : "Elite"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Symbol Selector */}
              <div className="flex flex-wrap gap-1 max-w-xs">
                {popularSymbols.slice(0, 4).map((item) => (
                  <Button
                    key={item.symbol}
                    variant={
                      currentSymbol === item.symbol ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleSymbolChange(item.symbol)}
                    className="text-xs"
                  >
                    {item.symbol}
                  </Button>
                ))}
              </div>

              {/* Interval Selector */}
              <div className="flex space-x-1">
                {intervals.slice(-4).map((interval) => (
                  <Button
                    key={interval.value}
                    variant={
                      currentInterval === interval.value ? "default" : "outline"
                    }
                    size="sm"
                    disabled={interval.disabled}
                    onClick={() => handleIntervalChange(interval.value)}
                    className="text-xs"
                  >
                    {interval.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* TradingView Chart */}
      <Card>
        <CardContent className="p-0">
          <div
            id="tradingview_chart"
            style={{ height: `${height}px` }}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Plan Limitations */}
      {plan === "free" && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold">Free Plan Limitations</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro for intraday charts, advanced indicators, and
                  real-time data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
