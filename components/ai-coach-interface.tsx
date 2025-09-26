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
  const [dailyQueries, setDailyQueries] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!input.trim() || isLoading) return;
    if (plan === "free" && dailyQueries >= maxQueries) {
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

  const handleUpgrade = () => {
    setShowLimitModal(false);
    router.push("/pricing");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to AI Trading Coach
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
                className={`flex space-x-4 max-w-4xl ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div className="flex-shrink-0">
                  {message.role === "assistant" ? (
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div
                    className={`relative group ${
                      message.role === "user"
                        ? "ml-auto max-w-2xl"
                        : "max-w-3xl"
                    }`}
                  >
                    <div
                      className={`px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
                          : "bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50"
                      }`}
                    >
                      <p
                        className={`text-sm leading-relaxed ${
                          message.role === "user"
                            ? "text-white"
                            : "text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {message.content}
                      </p>
                    </div>

                    {/* Message timestamp */}
                    <div
                      className={`text-xs text-gray-500 dark:text-gray-400 mt-2 ${
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
              <div className="flex space-x-4 max-w-4xl">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
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
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-center space-x-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 focus-within:border-blue-500 dark:focus-within:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center pl-6">
                <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                placeholder="Ask me anything about trading, market analysis, portfolio optimization, or investment strategies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                disabled={isLoading}
                className="flex-1 border-0 border-none bg-transparent focus:ring-0 focus:ring-offset-0 focus:border-0 focus:border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 focus-visible:border-none focus-visible:outline-none text-base py-5 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="m-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                size="sm"
              >
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span className="text-sm font-medium">Send</span>
                </div>
              </Button>
            </div>

            {plan === "free" && (
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {dailyQueries}/{maxQueries} queries used today
                  </p>
                </div>
                <Link href="/pricing">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>Upgrade for unlimited queries</span>
                  </div>
                </Link>
              </div>
            )}
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
