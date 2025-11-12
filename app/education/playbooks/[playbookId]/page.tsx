"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Target,
  TrendingUp,
  DollarSign,
  BarChart3,
  Zap,
  Trophy,
  CheckCircle,
  XCircle,
  Play,
  X,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import TradingViewChart from "@/components/tradingview-chart";

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const playbookId = parseInt(params.playbookId as string);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [playbook, setPlaybook] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const [isCompletingStep, setIsCompletingStep] = useState(false);

  // Get default symbol based on playbook category
  const getDefaultSymbol = (category: string): string => {
    const categoryLower = category?.toLowerCase() || "";
    switch (categoryLower) {
      case "stocks":
        return "AAPL";
      case "crypto":
        return "BTC/USD";
      case "forex":
        return "EUR/USD";
      case "options":
        return "SPY";
      default:
        return "AAPL";
    }
  };

  // Convert symbol to TradingView format
  const formatSymbolForTradingView = (symbol: string, category?: string): string => {
    if (!symbol) return "NASDAQ:AAPL";
    
    // If already in TradingView format (contains :), return as is
    if (symbol.includes(":")) {
      return symbol;
    }

    const categoryLower = category?.toLowerCase() || "";
    const symbolUpper = symbol.toUpperCase().replace("/", "");

    // Handle different categories
    switch (categoryLower) {
      case "stocks":
        // Common stock exchanges
        if (["SPY", "QQQ", "IWM", "DIA"].includes(symbolUpper)) {
          return `AMEX:${symbolUpper}`;
        }
        // Default to NASDAQ for most stocks
        return `NASDAQ:${symbolUpper}`;
      
      case "crypto":
        // Convert BTC/USD to BINANCE:BTCUSD
        if (symbol.includes("/")) {
          const [base, quote] = symbol.toUpperCase().split("/");
          return `BINANCE:${base}${quote}`;
        }
        // If no slash, assume USD pair
        return `BINANCE:${symbolUpper}USD`;
      
      case "forex":
        // Convert EUR/USD to FX:EURUSD
        if (symbol.includes("/")) {
          const [base, quote] = symbol.toUpperCase().split("/");
          return `FX:${base}${quote}`;
        }
        // If no slash, assume USD pair
        return `FX:${symbolUpper}USD`;
      
      case "options":
        // Options typically use underlying stock symbol
        return `NASDAQ:${symbolUpper}`;
      
      default:
        // Default to NASDAQ for unknown categories
        return `NASDAQ:${symbolUpper}`;
    }
  };

  // Trade form state
  const [tradeForm, setTradeForm] = useState({
    tradeType: "buy",
    quantity: "",
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
  });

  useEffect(() => {
    let cancelled = false;
    const loadPlaybook = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(
          `/api/v1/education/playbooks/${playbookId}`
        );
        if (!res.ok) {
          if (res.status === 404) {
            // Playbook not found
            if (!cancelled) {
              setPlaybook(null);
              setIsLoading(false);
            }
            return;
          }
          throw new Error("Failed to load playbook");
        }
        const playbookData = await res.json();
        if (!cancelled) {
          setPlaybook(playbookData);
        }

        // Check for existing active or paused session for this playbook
        try {
          // Check for active sessions first
          const activeSessionsRes = await apiClient.get(
            `/api/v1/education/practice/sessions?status=active`
          );
          let existingSession = null;
          
          if (activeSessionsRes.ok && !cancelled) {
            const sessions = await activeSessionsRes.json();
            existingSession = sessions.find(
              (s: any) => s.playbook_id === playbookId
            );
          }
          
          // If no active session, check for paused sessions
          if (!existingSession && !cancelled) {
            const pausedSessionsRes = await apiClient.get(
              `/api/v1/education/practice/sessions?status=paused`
            );
            if (pausedSessionsRes.ok) {
              const sessions = await pausedSessionsRes.json();
              existingSession = sessions.find(
                (s: any) => s.playbook_id === playbookId
              );
            }
          }
          
          if (existingSession && !cancelled) {
            setSession(existingSession);
            // Load trades for the existing session
            try {
              const tradesRes = await apiClient.get(
                `/api/v1/education/practice/sessions/${existingSession.id}/trades`
              );
              if (tradesRes.ok && !cancelled) {
                const tradesData = await tradesRes.json();
                setTrades(tradesData);
              }
            } catch (tradesError) {
              console.error("Failed to load trades:", tradesError);
            }
          }
        } catch (error) {
          console.error("Failed to load existing session:", error);
          // Don't fail the whole page load if session loading fails
        }

        if (!cancelled) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load playbook:", error);
        if (!cancelled) {
          setPlaybook(null);
          setIsLoading(false);
        }
      }
    };
    loadPlaybook();
    return () => {
      cancelled = true;
    };
  }, [playbookId]);

  const createSession = async () => {
    if (!playbook) {
      toast({
        title: "Error",
        description: "Playbook not loaded",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreatingSession(true);
      const defaultSymbol = getDefaultSymbol(playbook.category);
      const response = await apiClient.post(
        "/api/v1/education/practice/sessions",
        {
          playbook_id: playbookId,
          playbook_data: playbook,
          symbol: defaultSymbol,
          initial_balance: 100000.0,
        }
      );

      if (!response.ok) throw new Error("Failed to create session");
      const sessionData = await response.json();
      setSession(sessionData);
      toast({
        title: "Practice session started",
        description: "You're ready to practice!",
      });
    } catch (error: any) {
      toast({
        title: "Failed to start practice",
        description: error.message || "Could not create practice session",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const executeTrade = async () => {
    if (!session) return;

    try {
      setIsExecutingTrade(true);
      const entryPrice = tradeForm.entryPrice
        ? parseFloat(tradeForm.entryPrice)
        : undefined;
      const quantity = parseFloat(tradeForm.quantity);

      if (!quantity || quantity <= 0) {
        toast({
          title: "Invalid quantity",
          description: "Please enter a valid quantity",
          variant: "destructive",
        });
        return;
      }

      // For market orders (no entry_price), use entry_price as current_price
      // For limit orders, use the provided entry_price as current_price
      const currentPrice = entryPrice || 100; // Fallback for market orders

      const response = await apiClient.post(
        `/api/v1/education/practice/sessions/${session.id}/trades?current_price=${currentPrice}`,
        {
          trade_type: tradeForm.tradeType,
          symbol: session.symbol,
          quantity: quantity,
          entry_price: entryPrice || undefined,
          stop_loss: tradeForm.stopLoss
            ? parseFloat(tradeForm.stopLoss)
            : undefined,
          take_profit: tradeForm.takeProfit
            ? parseFloat(tradeForm.takeProfit)
            : undefined,
        }
      );

      if (!response.ok) throw new Error("Failed to execute trade");

      const tradeResult = await response.json();
      toast({
        title: "Trade executed",
        description: tradeResult.message,
      });

      // Refresh session and trades
      await loadSession();
      await loadTrades();

      // Reset form
      setTradeForm({
        tradeType: "buy",
        quantity: "",
        entryPrice: "",
        stopLoss: "",
        takeProfit: "",
      });
    } catch (error: any) {
      toast({
        title: "Trade execution failed",
        description: error.message || "Could not execute trade",
        variant: "destructive",
      });
    } finally {
      setIsExecutingTrade(false);
    }
  };

  const completeStep = async () => {
    if (!session) return;

    try {
      setIsCompletingStep(true);
      const response = await apiClient.post(
        `/api/v1/education/practice/sessions/${session.id}/complete-step`,
        {
          step_number: session.current_step,
        }
      );

      if (!response.ok) throw new Error("Failed to complete step");

      const result = await response.json();

      // Reload session to get updated current_step
      const sessionResponse = await apiClient.get(
        `/api/v1/education/practice/sessions/${session.id}`
      );
      if (sessionResponse.ok) {
        const updatedSession = await sessionResponse.json();
        setSession(updatedSession);
      }

      toast({
        title: "Step completed!",
        description: result.feedback,
      });

      if (result.is_final_step) {
        toast({
          title: "Congratulations!",
          description: "You've completed all steps in this strategy!",
        });

        // Update sessionStorage cache when playbook is completed
        try {
          const CACHE_KEY = "education_playbooks_cache_v1";
          const cachedRaw = sessionStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as { ts: number; data: any[] };
            const updatedPlaybooksData = cached.data.map((pb) => {
              if (pb.id === playbookId) {
                return { ...pb, completed: true };
              }
              return pb;
            });
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ ts: Date.now(), data: updatedPlaybooksData })
            );
          }
        } catch (e) {
          // If cache update fails, it's not critical
          console.warn("Failed to update playbook cache:", e);
        }
      }
    } catch (error: any) {
      toast({
        title: "Failed to complete step",
        description: error.message || "Could not complete step",
        variant: "destructive",
      });
    } finally {
      setIsCompletingStep(false);
    }
  };

  const loadSession = async () => {
    if (!session?.id) return;
    try {
      const response = await apiClient.get(
        `/api/v1/education/practice/sessions/${session.id}`
      );
      if (response.ok) {
        const sessionData = await response.json();
        setSession(sessionData);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const loadTrades = async () => {
    if (!session?.id) return;
    try {
      const response = await apiClient.get(
        `/api/v1/education/practice/sessions/${session.id}/trades`
      );
      if (response.ok) {
        const tradesData = await response.json();
        setTrades(tradesData);
      }
    } catch (error) {
      console.error("Failed to load trades:", error);
    }
  };

  useEffect(() => {
    if (session?.id) {
      loadTrades();
    }
  }, [session?.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading practice mode...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!playbook) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Playbook not found
            </p>
            <Button
              onClick={() => router.push("/education/playbooks")}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playbooks
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStep = playbook?.steps?.find(
    (s: any) => s.step === (session?.current_step ?? 1)
  );
  const totalSteps = playbook?.steps?.length || 0;
  // Progress is based on completed steps, not current step
  // If current_step is 1, no steps are completed yet (0%)
  // If current_step is 2, step 1 is completed (20% for 5 steps)
  const progressPercentage = session
    ? Math.max(0, ((session.current_step - 1) / totalSteps) * 100)
    : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/education/playbooks")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">{playbook?.title}</h1>
              <p className="text-muted-foreground">{playbook?.description}</p>
            </div>
            {playbook?.completed && (
              <Badge className="bg-green-500 hover:bg-green-600">
                Completed
              </Badge>
            )}
          </div>
        </div>
        {session && (
          <Badge
            variant={session.status === "active" ? "default" : "secondary"}
          >
            {session.status}
          </Badge>
        )}
      </div>

      {!session ? (
        /* Playbook Content View */
        <div className="space-y-6">
          {/* Playbook Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Steps</CardTitle>
              <CardDescription>
                Review the strategy steps below, then start a practice session
                to follow along step-by-step.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {playbook?.steps?.map((step: any) => (
                <Card
                  key={step.step}
                  className="border-l-4 border-l-primary"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                        {step.step}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-lg font-semibold">
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                        {step.details && (
                          <div className="mt-3 p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              💡{" "}
                              <span className="font-medium">Details:</span>{" "}
                              {step.details}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Start Practice Button */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Ready to Practice?</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a practice session to execute trades in a simulated
                    environment while learning.
                  </p>
                </div>
                <Button
                  onClick={createSession}
                  disabled={isCreatingSession}
                  size="lg"
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice Session
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Practice Session Active */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Step Guide */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Practice Progress</CardTitle>
                <CardDescription>
                  Step {session.current_step} of {totalSteps}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progressPercentage} className="h-2 mb-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{Math.round(progressPercentage)}% Complete</span>
                  <span>
                    Balance: $
                    {session.current_balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Current Step Card */}
            {currentStep && (
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                        {currentStep.step}
                      </div>
                      <div>
                        <CardTitle>{currentStep.title}</CardTitle>
                        <CardDescription>
                          {currentStep.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentStep.details && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">💡 Details:</span>{" "}
                        {currentStep.details}
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={completeStep}
                    className="w-full"
                    disabled={session.status !== "active" || isCompletingStep}
                  >
                    {isCompletingStep ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Step
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Price Chart</CardTitle>
                <CardDescription>{session.symbol}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <TradingViewChart
                    symbol={formatSymbolForTradingView(session.symbol, playbook?.category)}
                    interval="1d"
                    height="400px"
                    plan="pro"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Trades List */}
            {trades.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trades.map((trade) => (
                      <div
                        key={trade.id}
                        className="p-3 border rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">
                            {trade.trade_type.toUpperCase()} {trade.quantity} @
                            ${trade.entry_price}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Step {trade.step_number} • {trade.status}
                          </div>
                        </div>
                        {trade.pnl !== null && (
                          <Badge
                            variant={trade.pnl >= 0 ? "default" : "destructive"}
                          >
                            {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Trade Execution */}
          <div className="space-y-6">
            {/* Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  $
                  {session.current_balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Initial: ${session.initial_balance.toLocaleString()}
                </div>
                <div
                  className={`text-sm mt-2 ${
                    session.current_balance >= session.initial_balance
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {session.current_balance >= session.initial_balance
                    ? "+"
                    : ""}
                  {(
                    ((session.current_balance - session.initial_balance) /
                      session.initial_balance) *
                    100
                  ).toFixed(2)}
                  %
                </div>
              </CardContent>
            </Card>

            {/* Trade Execution Form */}
            <Card>
              <CardHeader>
                <CardTitle>Execute Trade</CardTitle>
                <CardDescription>
                  Check the chart above for current prices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trade Type</Label>
                  <Select
                    value={tradeForm.tradeType}
                    onValueChange={(value) =>
                      setTradeForm({ ...tradeForm, tradeType: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select trade type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={tradeForm.quantity}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, quantity: e.target.value })
                    }
                    className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Entry Price (leave empty for market order)</Label>
                  <Input
                    type="number"
                    placeholder="Enter price from chart"
                    value={tradeForm.entryPrice}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, entryPrice: e.target.value })
                    }
                    className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stop Loss (optional)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={tradeForm.stopLoss}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, stopLoss: e.target.value })
                    }
                    className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Take Profit (optional)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={tradeForm.takeProfit}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, takeProfit: e.target.value })
                    }
                    className="bg-background dark:bg-background/50 border-2 border-border dark:border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>

                <Button
                  onClick={executeTrade}
                  disabled={isExecutingTrade || session.status !== "active"}
                  className="w-full"
                >
                  {isExecutingTrade ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Execute Trade
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
