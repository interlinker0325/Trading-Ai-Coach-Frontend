"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Clock,
  Target,
  CheckCircle,
  Video,
  FileText,
  ArrowLeft,
  BookOpen,
  Loader2,
  X,
  Maximize2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [parentCourse, setParentCourse] = useState<any>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isViewingContent, setIsViewingContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceChecks, setPracticeChecks] = useState<{
    [k: string]: boolean;
  }>({
    understoodObjective: false,
    completedSteps: false,
  });
  const [isSubmittingPractice, setIsSubmittingPractice] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        const resLesson = await apiClient.get(
          `/api/v1/education/lessons/${lessonId}`
        );
        if (!resLesson.ok) throw new Error("Lesson not found");
        const lesson = await resLesson.json();
        const resCourse = await apiClient.get(
          `/api/v1/education/courses/${lesson.course_id}`
        );
        if (!resCourse.ok) throw new Error("Course not found");
        const course = await resCourse.json();
        if (cancelled) return;
        setCurrentLesson(lesson);
        setParentCourse(course);
        setLessonCompleted(!!lesson.completed);
      } catch (e) {
        // handle not found state by leaving currentLesson null
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!currentLesson || !parentCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button onClick={() => router.push("/education")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Education
          </Button>
        </div>
      </div>
    );
  }

  // Generate lesson content
  const getLessonContent = (title: string) => {
    const content: any = {
      "Introduction to Stock Market": {
        overview:
          "Learn the fundamentals of the stock market, how it works, and why stocks are important investments.",
        topics: [
          "What are stocks and how they represent ownership",
          "Understanding stock exchanges (NYSE, NASDAQ)",
          "Key market participants: investors, traders, institutions",
          "Market hours and trading sessions",
          "Basic terminology every investor should know",
        ],
        outcomes: [
          "Understand how the stock market functions",
          "Identify key market participants",
          "Know when markets are open for trading",
          "Use basic stock market terminology confidently",
        ],
      },
      "Chart Patterns Mastery": {
        overview:
          "Master the art of reading and interpreting chart patterns to make better trading decisions.",
        topics: [
          "Support and resistance levels",
          "Trend lines and channels",
          "Common reversal patterns (head & shoulders, double tops/bottoms)",
          "Continuation patterns (triangles, flags, pennants)",
          "Pattern recognition and validation",
        ],
        outcomes: [
          "Identify major chart patterns confidently",
          "Use patterns for entry and exit signals",
          "Validate patterns before trading",
          "Apply pattern analysis to real charts",
        ],
      },
      "Indicators Deep Dive": {
        overview:
          "Deep dive into technical indicators and how to use them effectively in your trading strategy.",
        topics: [
          "Moving averages (SMA, EMA) and crossover strategies",
          "MACD and momentum analysis",
          "RSI for overbought/oversold conditions",
          "Bollinger Bands for volatility",
          "Combining indicators for confirmation",
        ],
        outcomes: [
          "Apply moving averages effectively",
          "Interpret MACD signals correctly",
          "Use RSI for entry/exit timing",
          "Combine multiple indicators successfully",
        ],
      },
      "Trading Psychology": {
        overview:
          "Master the psychological aspects of trading to control emotions and make rational decisions.",
        topics: [
          "Common psychological pitfalls in trading",
          "Fear and greed management",
          "Developing discipline and patience",
          "Risk tolerance assessment",
          "Building a trader's mindset",
        ],
        outcomes: [
          "Recognize and overcome psychological barriers",
          "Manage emotions during trades",
          "Develop disciplined trading habits",
          "Maintain confidence in your strategy",
        ],
      },
      "Strategy Building": {
        overview:
          "Learn how to build, test, and refine your own trading strategies from scratch.",
        topics: [
          "Defining your trading style and goals",
          "Researching and selecting strategies",
          "Backtesting your strategies",
          "Risk management integration",
          "Strategy refinement and optimization",
        ],
        outcomes: [
          "Create a personalized trading strategy",
          "Backtest strategies effectively",
          "Integrate risk management rules",
          "Optimize strategies for better results",
        ],
      },
      "Understanding Futures Contracts": {
        overview:
          "Learn the fundamentals of futures contracts, how they work, and why traders use them.",
        topics: [
          "What are futures contracts",
          "Futures specifications (contract size, expiration, delivery)",
          "Long vs short positions",
          "Margin requirements and leverage",
          "Settling futures contracts",
        ],
        outcomes: [
          "Understand how futures contracts work",
          "Read futures contract specifications",
          "Differentiate long and short positions",
          "Calculate margin requirements",
        ],
      },
      "Futures vs Options": {
        overview:
          "Compare futures and options to understand when to use each derivative instrument.",
        topics: [
          "Key differences between futures and options",
          "Obligation vs right to trade",
          "Risk/reward profiles comparison",
          "Capital requirements",
          "Which instrument to use when",
        ],
        outcomes: [
          "Understand key differences",
          "Choose the right derivative instrument",
          "Assess risk-reward profiles",
          "Make informed trading decisions",
        ],
      },
      "Hedging Strategies": {
        overview:
          "Master hedging techniques using futures to protect against adverse price movements.",
        topics: [
          "Why hedge with futures",
          "Hedge ratio calculations",
          "Cross-hedging strategies",
          "Basis risk management",
          "Hedging portfolio risk",
        ],
        outcomes: [
          "Implement effective hedging strategies",
          "Calculate proper hedge ratios",
          "Manage basis risk",
          "Protect portfolio positions",
        ],
      },
      "Market Participants & Exchanges": {
        overview:
          "Understand who participates in the stock market and how exchanges facilitate trading.",
        topics: [
          "Retail vs institutional investors",
          "Key stock exchanges (NYSE, NASDAQ)",
          "Market makers and their role",
          "Brokers and their services",
          "Trading mechanisms and order types",
        ],
        outcomes: [
          "Identify different market participants",
          "Understand exchange structure",
          "Know how trades are executed",
          "Choose appropriate brokers",
        ],
      },
      "Stock Analysis Fundamentals": {
        overview:
          "Learn the fundamental techniques for analyzing stocks and making informed investment decisions.",
        topics: [
          "Fundamental vs technical analysis",
          "Reading financial statements",
          "Key financial ratios",
          "Industry analysis",
          "Valuation methods",
        ],
        outcomes: [
          "Analyze company financials",
          "Calculate important ratios",
          "Value stocks accurately",
          "Make investment decisions",
        ],
      },
      "Practice: Analyzing AAPL": {
        overview:
          "Apply your knowledge by analyzing Apple Inc. (AAPL) using fundamental and technical analysis.",
        topics: [
          "Company overview and business model",
          "Financial statement analysis",
          "Technical chart analysis",
          "Valuation assessment",
          "Investment recommendation",
        ],
        outcomes: [
          "Conduct complete stock analysis",
          "Apply analysis techniques practically",
          "Make informed recommendations",
          "Build confidence in stock picking",
        ],
      },
      "Understanding Stock Prices & Quotes": {
        overview:
          "Learn how to read stock prices, quotes, and understand market data terminology.",
        topics: [
          "Bid vs ask prices",
          "Spread and its significance",
          "Understanding stock quotes",
          "Pre-market and after-hours trading",
          "Reading Level 2 order books",
        ],
        outcomes: [
          "Read stock quotes confidently",
          "Understand bid-ask dynamics",
          "Interpret market depth data",
          "Time trades effectively",
        ],
      },
      "Dividends & Stock Splits": {
        overview:
          "Understand how dividends work, stock splits affect ownership, and their impact on investment returns.",
        topics: [
          "Types of dividends (cash, stock)",
          "Dividend yield and payout ratio",
          "Stock split mechanics",
          "Ex-dividend dates",
          "Impact on shareholder value",
        ],
        outcomes: [
          "Understand dividend basics",
          "Calculate dividend yields",
          "Explain stock split effects",
          "Maximize dividend income",
        ],
      },
      "Investment Strategies": {
        overview:
          "Explore various investment strategies from conservative to aggressive approaches.",
        topics: [
          "Buy and hold strategy",
          "Dollar-cost averaging",
          "Value investing principles",
          "Growth investing approach",
          "Dividend investing strategy",
        ],
        outcomes: [
          "Choose suitable investment strategy",
          "Implement dollar-cost averaging",
          "Apply value investing criteria",
          "Build long-term wealth",
        ],
      },
      "Building Your First Portfolio": {
        overview:
          "Create your first stock portfolio with proper diversification and risk management.",
        topics: [
          "Portfolio diversification principles",
          "Asset allocation strategies",
          "Risk tolerance assessment",
          "Portfolio rebalancing",
          "Performance tracking and evaluation",
        ],
        outcomes: [
          "Build diversified portfolio",
          "Apply asset allocation rules",
          "Manage portfolio risk",
          "Track investment performance",
        ],
      },
    };
    return (
      content[title] || {
        overview:
          "Comprehensive lesson covering key concepts and practical applications.",
        topics: [
          "Introduction to core concepts",
          "Detailed explanations with examples",
          "Hands-on practice exercises",
          "Common pitfalls and how to avoid them",
          "Real-world applications",
        ],
        outcomes: [
          "Understand core concepts",
          "Apply knowledge practically",
          "Avoid common mistakes",
          "Use skills effectively",
        ],
      }
    );
  };

  const lessonContent = getLessonContent(currentLesson.title);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button
          onClick={() => router.push("/education")}
          className="hover:text-foreground transition-colors"
        >
          Education
        </button>
        <span>/</span>
        <span>{parentCourse.title}</span>
        <span>/</span>
        <span className="text-foreground">{currentLesson.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-3 mb-4">
          {currentLesson.type === "video" ? (
            <Video className="w-8 h-8 text-primary" />
          ) : currentLesson.type === "description" ? (
            <BookOpen className="w-8 h-8 text-primary" />
          ) : (
            <FileText className="w-8 h-8 text-primary" />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{currentLesson.title}</h1>
            <p className="text-muted-foreground mt-1">
              {parentCourse.title} by {parentCourse.instructor}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{currentLesson.duration}</span>
          </div>
          <Badge variant="outline">{currentLesson.type}</Badge>
          <Badge className={getLevelColor(parentCourse.level)}>
            {parentCourse.level}
          </Badge>
        </div>
      </div>

      {/* Content Cards */}
      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {lessonContent.overview}
            </p>
          </CardContent>
        </Card>

        {/* What You'll Learn */}
        <Card>
          <CardHeader>
            <CardTitle>What You'll Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lessonContent.topics.map((topic: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{topic}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Learning Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lessonContent.outcomes.map((outcome: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                >
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm">{outcome}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {!lessonCompleted && (
            <Button
              size="lg"
              className="flex-1"
              disabled={isSaving}
              onClick={async () => {
                try {
                  setIsSaving(true);
                  const res = await apiClient.post(
                    `/api/v1/education/lessons/${lessonId}/complete`
                  );
                  if (!res.ok) throw new Error("Failed to save");
                  setLessonCompleted(true);
                  setCurrentLesson({ ...currentLesson, completed: true });
                  toast({
                    title: "Lesson Completed!",
                    description: `You've successfully completed "${currentLesson.title}"`,
                  });
                } catch (e) {
                  toast({
                    title: "Failed to save",
                    description: "Could not mark as complete.",
                  });
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Mark as Complete"}
            </Button>
          )}
          <Button
            size="lg"
            variant={lessonCompleted ? "default" : "outline"}
            className="flex-1"
            onClick={() => {
              setIsViewingContent(true);
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            {currentLesson.type === "video"
              ? "Watch Lesson"
              : currentLesson.type === "description"
              ? "Read Lesson"
              : "Start Exercise"}
          </Button>
        </div>

        {/* Content Viewer Modal */}
        {isViewingContent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsViewingContent(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {currentLesson.type === "video" ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                      <video
                        ref={videoRef}
                        className="w-full h-full"
                        controls
                        controlsList="nodownload"
                        style={{ maxHeight: "100%" }}
                      >
                        <source
                          src={`${
                            currentLesson.video_url || "/videos/lesson.mp4"
                          }`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-4 right-4 z-10"
                        onClick={() => {
                          const video = videoRef.current;
                          if (video) {
                            if (video.requestFullscreen) {
                              video.requestFullscreen();
                            } else if ((video as any).webkitRequestFullscreen) {
                              (video as any).webkitRequestFullscreen();
                            } else if ((video as any).mozRequestFullScreen) {
                              (video as any).mozRequestFullScreen();
                            } else if ((video as any).msRequestFullscreen) {
                              (video as any).msRequestFullscreen();
                            }
                          }
                        }}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {currentLesson.content && currentLesson.content.trim() ? (
                      <div className="space-y-4">
                        <div className="whitespace-pre-line text-base leading-relaxed prose prose-slate dark:prose-invert max-w-none">
                          {currentLesson.content
                            .split("\n")
                            .map((line: string, index: number) => {
                              const isHeading =
                                line &&
                                line.length > 0 &&
                                (line === line.toUpperCase() ||
                                  (line[0] === line[0].toUpperCase() &&
                                    !line.includes(".") &&
                                    line.length < 50));

                              if (isHeading && line.trim()) {
                                return (
                                  <h3
                                    key={index}
                                    className="text-2xl font-bold mt-6 mb-3 first:mt-0"
                                  >
                                    {line}
                                  </h3>
                                );
                              }
                              return (
                                <p
                                  key={index}
                                  className="mb-4 text-muted-foreground"
                                >
                                  {line || "\u00A0"}
                                </p>
                              );
                            })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">
                            Lesson Overview
                          </h3>
                          <p className="text-muted-foreground">
                            {lessonContent.overview}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : currentLesson.type === "description" ? (
                  <div className="space-y-6 prose prose-slate dark:prose-invert max-w-none">
                    {currentLesson.content && currentLesson.content.trim() ? (
                      <div className="whitespace-pre-line text-base leading-relaxed">
                        {currentLesson.content
                          .split("\n")
                          .map((line: string, index: number) => {
                            // Check if line is a heading (all caps or starts with capital and no period)
                            const isHeading =
                              line &&
                              line.length > 0 &&
                              (line === line.toUpperCase() ||
                                (line[0] === line[0].toUpperCase() &&
                                  !line.includes(".") &&
                                  line.length < 50));

                            if (isHeading && line.trim()) {
                              return (
                                <h3
                                  key={index}
                                  className="text-2xl font-bold mt-6 mb-3 first:mt-0"
                                >
                                  {line}
                                </h3>
                              );
                            }
                            return (
                              <p
                                key={index}
                                className="mb-4 text-muted-foreground"
                              >
                                {line || "\u00A0"}
                              </p>
                            );
                          })}
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-2xl font-bold mb-4">Overview</h3>
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            {lessonContent.overview}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold mb-4">
                            What You'll Learn
                          </h3>
                          <ul className="space-y-3 list-none">
                            {lessonContent.topics.map(
                              (topic: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                                >
                                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-base">{topic}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold mb-4">
                            Learning Outcomes
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {lessonContent.outcomes.map(
                              (outcome: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-4 bg-muted rounded-lg"
                                >
                                  <Target className="w-5 h-5 text-primary flex-shrink-0" />
                                  <span className="text-base">{outcome}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentLesson.content && currentLesson.content.trim() ? (
                      <div className="whitespace-pre-line text-base leading-relaxed prose prose-slate dark:prose-invert max-w-none">
                        {currentLesson.content
                          .split("\n")
                          .map((line: string, index: number) => {
                            const isHeading =
                              line &&
                              line.length > 0 &&
                              (line === line.toUpperCase() ||
                                (line[0] === line[0].toUpperCase() &&
                                  !line.includes(".") &&
                                  line.length < 50));

                            if (isHeading && line.trim()) {
                              return (
                                <h3
                                  key={index}
                                  className="text-2xl font-bold mt-6 mb-3 first:mt-0"
                                >
                                  {line}
                                </h3>
                              );
                            }
                            return (
                              <p
                                key={index}
                                className="mb-4 text-muted-foreground"
                              >
                                {line || "\u00A0"}
                              </p>
                            );
                          })}
                      </div>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle>Practice Exercise</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">Instructions</h3>
                            <p className="text-muted-foreground">
                              Complete the exercise by writing your analysis or
                              answer, then confirm the checklist and submit.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Your Answer</h4>
                            <textarea
                              className="w-full min-h-[120px] p-3 rounded-md border bg-background"
                              placeholder="Write your answer or analysis here..."
                              value={practiceAnswer}
                              onChange={(e) =>
                                setPracticeAnswer(e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id="understoodObjective"
                                checked={practiceChecks.understoodObjective}
                                onCheckedChange={(val) =>
                                  setPracticeChecks((p) => ({
                                    ...p,
                                    understoodObjective: Boolean(val),
                                  }))
                                }
                                className="mt-0.5 h-4 w-4 border border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <label
                                htmlFor="understoodObjective"
                                className="text-sm text-muted-foreground"
                              >
                                I understand the objective of this exercise
                              </label>
                            </div>
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id="completedSteps"
                                checked={practiceChecks.completedSteps}
                                onCheckedChange={(val) =>
                                  setPracticeChecks((p) => ({
                                    ...p,
                                    completedSteps: Boolean(val),
                                  }))
                                }
                                className="mt-0.5 h-4 w-4 border border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <label
                                htmlFor="completedSteps"
                                className="text-sm text-muted-foreground"
                              >
                                I completed the required steps for this exercise
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setPracticeAnswer("");
                                setPracticeChecks({
                                  understoodObjective: false,
                                  completedSteps: false,
                                });
                              }}
                            >
                              Reset
                            </Button>
                            <Button
                              disabled={isSubmittingPractice}
                              onClick={async () => {
                                if (
                                  !practiceAnswer.trim() ||
                                  !practiceChecks.understoodObjective ||
                                  !practiceChecks.completedSteps
                                ) {
                                  toast({
                                    title: "Incomplete",
                                    description:
                                      "Please write an answer and check both confirmations.",
                                  });
                                  return;
                                }
                                try {
                                  setIsSubmittingPractice(true);
                                  const res = await apiClient.post(
                                    `/api/v1/education/lessons/${lessonId}/complete`
                                  );
                                  if (!res.ok)
                                    throw new Error("Failed to save");
                                  setLessonCompleted(true);
                                  setCurrentLesson({
                                    ...currentLesson,
                                    completed: true,
                                  });
                                  setIsViewingContent(false);
                                  toast({
                                    title: "Exercise Submitted",
                                    description:
                                      "Your practice submission was recorded and the lesson marked complete.",
                                  });
                                } catch (e) {
                                  toast({
                                    title: "Submission failed",
                                    description: "Please try again.",
                                  });
                                } finally {
                                  setIsSubmittingPractice(false);
                                }
                              }}
                            >
                              {isSubmittingPractice ? (
                                <span className="inline-flex items-center">
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting...
                                </span>
                              ) : (
                                <>Submit Exercise</>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsViewingContent(false)}
                >
                  Close
                </Button>
                {!lessonCompleted && (
                  <Button
                    disabled={isSaving}
                    onClick={async () => {
                      try {
                        setIsSaving(true);
                        const res = await apiClient.post(
                          `/api/v1/education/lessons/${lessonId}/complete`
                        );
                        if (!res.ok) throw new Error("Failed to save");
                        setLessonCompleted(true);
                        setCurrentLesson({ ...currentLesson, completed: true });
                        setIsViewingContent(false);
                        toast({
                          title: "Lesson Completed!",
                          description: `You've successfully completed "${currentLesson.title}"`,
                        });
                      } catch (e) {
                        toast({
                          title: "Failed to save",
                          description: "Could not mark as complete.",
                        });
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Mark as Complete"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getLevelColor(level: string) {
  switch (level) {
    case "Beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}
