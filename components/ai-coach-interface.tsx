"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Brain, User, Sparkles, Zap, MessageSquare } from "lucide-react";
import TradingViewChart from "./tradingview-chart";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  fromCache?: boolean;
  chartUpdate?: {
    needs_chart_update: boolean;
    chart_config: {
      symbol: string;
      interval: string;
      studies: string[];
      chart_type: string;
    };
    extracted_info: {
      symbols: string[];
      indicators: string[];
      timeframes: string[];
      actions: string[];
    };
  };
}

interface AICoachInterfaceProps {
  plan: "free" | "pro" | "elite";
}

export function AICoachInterface({ plan }: AICoachInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dailyQueries, setDailyQueries] = useState(0);
  const [maxQueries, setMaxQueries] = useState(
    plan === "free" ? 5 : Number.POSITIVE_INFINITY
  );
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    symbol: "BINANCE:BTCUSD",
    interval: "D",
    studies: [],
    chart_type: "1",
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load daily query count on component mount
  useEffect(() => {
    const loadDailyQueries = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai-coach/query-count`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDailyQueries(data.daily_queries_used);
          setMaxQueries(data.daily_queries_limit);
        }
      } catch (error) {
        console.error("Error loading daily queries:", error);
      }
    };

    loadDailyQueries();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    };

    // Small delay to ensure DOM is updated
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!input.trim() || isLoading) return;

    console.log(
      "[AI Coach Frontend] Sending message, current count:",
      dailyQueries
    );
    if (dailyQueries >= maxQueries) {
      setShowLimitModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call real AI API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai-coach/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            messages: messages
              .map((msg) => ({
                role: msg.role,
                content: msg.content,
              }))
              .concat([{ role: "user", content: input }]),
            plan: plan,
            chart_state: chartConfig, // Send current chart state for preservation
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
        fromCache: data.from_cache || false,
        chartUpdate: data.chart_update || undefined,
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Update chart configuration if needed
      if (data.chart_update && data.chart_update.needs_chart_update) {
        console.log(
          "[Chart Update] Updating chart config:",
          data.chart_update.chart_config
        );
        setChartConfig(data.chart_update.chart_config);
      } else {
        console.log(
          "[Chart Update] No chart update needed or chart_update missing"
        );
      }

      // Update daily queries from backend response
      setDailyQueries(data.daily_queries_used);
      setMaxQueries(data.daily_queries_limit);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Check if it's a rate limit error
      let errorMessage =
        "I'm sorry, I'm having trouble processing your request right now. Please try again later.";

      if (error instanceof Error && error.message.includes("429")) {
        errorMessage =
          "You've reached your rate limit. Please wait a moment before trying again.";
      } else if (
        error instanceof Error &&
        error.message.includes("Daily query limit")
      ) {
        errorMessage =
          "You've reached your daily query limit. Upgrade to Pro for unlimited access!";
        setShowLimitModal(true);
      }

      // Fallback error message
      const errorResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);

      // Ensure scroll to bottom after AI response
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector(
            "[data-radix-scroll-area-viewport]"
          );
          if (scrollContainer) {
            scrollContainer.scrollTo({
              top: scrollContainer.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      }, 200);
    }
  };

  const handleUpgrade = () => {
    setShowLimitModal(false);
    router.push("/pricing");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      {/* Main Content Area - Full width on mobile, 7/10 on desktop */}
      <div className="flex-1 lg:w-7/10 h-full lg:h-auto">
        {/* TradingView Chart */}
        <div className="h-full w-full p-2 lg:p-4">
          <TradingViewChart
            symbol={chartConfig.symbol}
            interval={chartConfig.interval}
            height="100%"
            plan={plan}
            studies={chartConfig.studies}
          />
        </div>
      </div>

      {/* Chat Interface - Full width on mobile, 3/10 on desktop */}
      <div className="w-full lg:w-3/10 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200/50 dark:border-gray-700/50 h-96 lg:h-full">
        {/* Messages */}
        <ScrollArea className="flex-1 p-2 lg:p-4" ref={scrollAreaRef}>
          <div className="space-y-3 lg:space-y-4 max-w-full mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                  <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  AI Trading Coach
                </h3>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`flex space-x-1 lg:space-x-2 max-w-full ${
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse gap-x-2"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {message.role === "assistant" ? (
                      <div className="relative">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <Brain className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 lg:space-y-2 flex-1">
                    <div
                      className={`relative group ${
                        message.role === "user"
                          ? "ml-auto max-w-full"
                          : "max-w-full"
                      }`}
                    >
                      <div
                        className={`px-2 py-1.5 lg:px-3 lg:py-2 rounded-lg lg:rounded-xl shadow-lg backdrop-blur-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
                            : "bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50"
                        }`}
                      >
                        <p
                          className={`text-xs lg:text-sm leading-relaxed ${
                            message.role === "user"
                              ? "text-white"
                              : "text-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {message.content}
                        </p>
                        {message.role === "assistant" && message.fromCache && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Cached
                            </span>
                          </div>
                        )}
                        {message.role === "assistant" &&
                          message.chartUpdate && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                Chart Updated
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Message timestamp */}
                      <div
                        className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                          message.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex space-x-1 lg:space-x-2 max-w-full">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Brain className="h-4 w-4 lg:h-5 lg:w-5 text-white animate-pulse" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-lg lg:rounded-xl px-2 py-1.5 lg:px-3 lg:py-2 shadow-lg backdrop-blur-sm">
                    <div className="flex space-x-1 lg:space-x-2 justify-center items-center">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div
                        className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-indigo-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 lg:p-3">
          <div className="max-w-full mx-auto">
            <div className="relative">
              <div className="flex items-center space-x-1 lg:space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg lg:rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus-within:border-blue-500 dark:focus-within:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center pl-2 lg:pl-3">
                  <MessageSquare className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  placeholder="Ask about trading..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 border-0 border-none bg-transparent focus:ring-0 focus:ring-offset-0 focus:border-0 focus:border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 focus-visible:border-none focus-visible:outline-none text-xs lg:text-sm py-2 lg:py-3 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="m-0.5 lg:m-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md lg:rounded-lg px-2 py-1.5 lg:px-3 lg:py-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                >
                  <div className="flex items-center gap-0.5 lg:gap-1">
                    <Send className="h-3 w-3 lg:h-3 lg:w-3" />
                    <span className="text-xs font-medium hidden sm:inline">
                      Send
                    </span>
                  </div>
                </Button>
              </div>

              {maxQueries < Number.POSITIVE_INFINITY && (
                <div className="flex items-center justify-between mt-1 lg:mt-2 px-0.5 lg:px-1">
                  <div className="flex items-center gap-0.5 lg:gap-1">
                    <div
                      className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full ${
                        dailyQueries >= maxQueries
                          ? "bg-red-500"
                          : dailyQueries >= maxQueries * 0.8
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      {dailyQueries}/{maxQueries}
                    </p>
                  </div>
                  <Link href="/pricing">
                    <div className="flex items-center gap-0.5 lg:gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                      <Sparkles className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                      <span className="hidden sm:inline">Upgrade</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Limit Modal */}
      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-xl font-semibold text-orange-800 dark:text-orange-200">
                Daily Limit Reached
              </DialogTitle>
              <DialogDescription className="text-orange-700 dark:text-orange-300 mt-2">
                You've used {dailyQueries}/{maxQueries} queries today. Upgrade
                to Pro for unlimited access!
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="text-center mt-6">
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleUpgrade}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
