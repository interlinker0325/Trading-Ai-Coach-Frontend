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
  const [currentPrice, setCurrentPrice] = useState<number>(150.0); // Mock price
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const [isCompletingStep, setIsCompletingStep] = useState(false);

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
      const response = await apiClient.post(
        "/api/v1/education/practice/sessions",
        {
          playbook_id: playbookId,
          playbook_data: playbook,
          symbol: "AAPL", // Default symbol
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
      const entryPrice = parseFloat(tradeForm.entryPrice) || currentPrice;
      const quantity = parseFloat(tradeForm.quantity);

      if (!quantity || quantity <= 0) {
        toast({
          title: "Invalid quantity",
          description: "Please enter a valid quantity",
          variant: "destructive",
        });
        return;
      }

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
        /* Start Practice Session */
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <Target className="w-16 h-16 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Ready to Practice?</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start a practice session to follow along with this strategy
                step-by-step. You'll execute trades in a simulated environment
                while learning.
              </p>
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
                    symbol={session.symbol}
                    interval="5m"
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
                  Current Price: ${currentPrice.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trade Type</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={tradeForm.tradeType}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, tradeType: e.target.value })
                    }
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
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
                  />
                </div>

                <div className="space-y-2">
                  <Label>Entry Price (leave empty for market order)</Label>
                  <Input
                    type="number"
                    placeholder={currentPrice.toFixed(2)}
                    value={tradeForm.entryPrice}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, entryPrice: e.target.value })
                    }
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
