"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  User,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AICoachInterfaceProps {
  plan: "free" | "pro" | "elite";
}

export function AICoachInterface({ plan }: AICoachInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dailyQueries, setDailyQueries] = useState(plan === "free" ? 1 : 0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const maxQueries = plan === "free" ? 5 : Number.POSITIVE_INFINITY;

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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (plan === "free" && dailyQueries >= maxQueries) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (plan === "free") {
      setDailyQueries((prev) => prev + 1);
    }

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
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Fallback error message
      const errorResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
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

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea
        className="flex-1 p-4 bg-white dark:bg-gray-900"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex space-x-3 max-w-3xl ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.role === "assistant" ? (
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50">
                      <Brain className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="space-y-2">
                  <Card
                    className={`py-1 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p
                        className={`text-sm ${
                          message.role === "user"
                            ? "text-white"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
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
                <Card className="py-1">
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
      <div className="border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 p-6">
        {plan === "free" && dailyQueries >= maxQueries ? (
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-700">
            <CardContent className="p-6 text-center">
              <p className="text-orange-800 dark:text-orange-200 mb-4 font-medium">
                You've reached your daily query limit ({dailyQueries}/
                {maxQueries})
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                Upgrade to Pro for Unlimited Queries
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 shadow-lg transition-all duration-200">
              <Input
                placeholder="Ask me anything about trading, market analysis, portfolio optimization, or investment strategies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="flex-1 border-0 bg-transparent focus:ring-0 text-base py-4 px-4 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="m-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                size="sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Sending...</span>
                  </div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {plan === "free" && (
              <div className="flex items-center justify-between mt-3 px-2">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Queries today: {dailyQueries}/{maxQueries}
                </p>
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <span>💡</span>
                  <span>Upgrade for unlimited queries</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
