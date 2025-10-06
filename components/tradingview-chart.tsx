"use client";

import React, { useEffect, useRef, memo, useState } from "react";

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  height?: string;
  plan?: "free" | "pro" | "elite";
  studies?: string[];
}

function TradingViewChart({
  symbol,
  interval,
  height,
  plan,
  studies,
}: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect theme changes by listening to DOM class changes
  useEffect(() => {
    const detectTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    // Initial theme detection
    detectTheme();

    // Create a MutationObserver to watch for class changes on documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          detectTheme();
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [symbol, interval, plan]);

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
               "studies": ${JSON.stringify(studies)},
        "autosize": true
      }`;

    container.current.appendChild(script);

    // Cleanup function
    return () => {
      if (container.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, isDark, plan, studies]);

  return (
    <div className="w-full h-full relative">
      <div
        key={`tradingview-${symbol}-${interval}-${
          isDark ? "dark" : "light"
        }-${plan}-${studies?.join(",") || ""}`}
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
