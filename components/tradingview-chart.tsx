"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  height?: string;
  plan?: "free" | "pro" | "elite";
}

function TradingViewChart({
  symbol = "NASDAQ:AAPL",
  interval = "D",
  height = "100%",
  plan = "free",
}: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();

  // Use resolvedTheme to handle system theme preference
  const currentTheme = resolvedTheme || theme || "light";
  const isDark = currentTheme === "dark";

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing script
    const existingScript = container.current.querySelector("script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "allow_symbol_change": ${plan !== "free"},
        "calendar": false,
        "details": true,
        "hide_side_toolbar": ${plan === "free"},
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": ${plan !== "free"},
        "interval": "${interval}",
        "locale": "en",
        "save_image": ${plan !== "free"},
        "style": "1",
        "symbol": "${symbol}",
        "theme": "${isDark ? "dark" : "light"}",
        "timezone": "Etc/UTC",
        "backgroundColor": "${isDark ? "#1a1a1a" : "#ffffff"}",
        "gridColor": "${
          isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(46, 46, 46, 0.06)"
        }",
        "watchlist": [],
        "withdateranges": ${plan !== "free"},
        "compareSymbols": [],
        "studies": [],
        "autosize": true
      }`;

    container.current.appendChild(script);

    // Cleanup function
    return () => {
      if (container.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, isDark, plan]);

  return (
    <div className="w-full h-full relative">
      <div
        className="tradingview-widget-container"
        ref={container}
        style={{ height: height, width: "100%" }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height: "100%", width: "100%" }}
        ></div>
      </div>
    </div>
  );
}

export default memo(TradingViewChart);
