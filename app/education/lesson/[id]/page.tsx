"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Clock,
  Target,
  CheckCircle,
  Video,
  FileText,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

// Import course data - in production, this would come from an API
const courses = [
  {
    id: 1,
    title: "Stock Market Fundamentals",
    description:
      "Learn the basics of stock trading, market analysis, and investment strategies",
    level: "Beginner",
    duration: "3h 20min",
    progress: 38,
    modules: 8,
    icon: "TrendingUp",
    category: "Stocks",
    instructor: "Jane Smith",
    rating: 4.8,
    students: 15420,
    lessons: [
      {
        id: 1,
        title: "Introduction to Stock Market",
        duration: "15 min",
        type: "video",
        completed: true,
      },
      {
        id: 2,
        title: "Market Participants & Exchanges",
        duration: "20 min",
        type: "video",
        completed: true,
      },
      {
        id: 3,
        title: "Stock Analysis Fundamentals",
        duration: "25 min",
        type: "video",
        completed: true,
      },
      {
        id: 4,
        title: "Practice: Analyzing AAPL",
        duration: "30 min",
        type: "practice",
        completed: false,
      },
      {
        id: 5,
        title: "Understanding Stock Prices & Quotes",
        duration: "25 min",
        type: "video",
        completed: false,
      },
      {
        id: 6,
        title: "Dividends & Stock Splits",
        duration: "20 min",
        type: "video",
        completed: false,
      },
      {
        id: 7,
        title: "Investment Strategies",
        duration: "35 min",
        type: "video",
        completed: false,
      },
      {
        id: 8,
        title: "Building Your First Portfolio",
        duration: "30 min",
        type: "practice",
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: "Options Trading Mastery",
    description:
      "Advanced options strategies, Greeks, and risk management techniques",
    level: "Advanced",
    duration: "5h 15min",
    progress: 17,
    modules: 12,
    icon: "Target",
    category: "Options",
    instructor: "Mike Johnson",
    rating: 4.9,
    students: 8920,
    lessons: [
      {
        id: 9,
        title: "Options Basics",
        duration: "20 min",
        type: "video",
        completed: true,
      },
      {
        id: 10,
        title: "The Greeks Explained",
        duration: "30 min",
        type: "video",
        completed: true,
      },
      {
        id: 11,
        title: "Covered Calls Strategy",
        duration: "25 min",
        type: "video",
        completed: false,
      },
      {
        id: 21,
        title: "Cash-Secured Puts (CSP)",
        duration: "30 min",
        type: "video",
        completed: false,
      },
      {
        id: 22,
        title: "Straddles & Strangles",
        duration: "30 min",
        type: "video",
        completed: false,
      },
      {
        id: 23,
        title: "Iron Condors & Butterflies",
        duration: "35 min",
        type: "video",
        completed: false,
      },
      {
        id: 24,
        title: "Risk Management in Options",
        duration: "30 min",
        type: "video",
        completed: false,
      },
      {
        id: 25,
        title: "Volatility Trading",
        duration: "25 min",
        type: "video",
        completed: false,
      },
      {
        id: 26,
        title: "Options Assignment & Exercise",
        duration: "20 min",
        type: "video",
        completed: false,
      },
      {
        id: 27,
        title: "Options Portfolio Management",
        duration: "30 min",
        type: "video",
        completed: false,
      },
      {
        id: 28,
        title: "Practice: Building Options Strategies",
        duration: "40 min",
        type: "practice",
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: "Cryptocurrency Trading",
    description: "Digital assets, DeFi, and crypto market dynamics",
    level: "Intermediate",
    duration: "4h 30min",
    progress: 0,
    modules: 10,
    icon: "DollarSign",
    category: "Crypto",
    instructor: "Sarah Chen",
    rating: 4.7,
    students: 12560,
    lessons: [
      {
        id: 12,
        title: "Crypto Basics & Wallets",
        duration: "25 min",
        type: "video",
        completed: false,
      },
      {
        id: 13,
        title: "Trading Platforms",
        duration: "20 min",
        type: "video",
        completed: false,
      },
    ],
  },
  {
    id: 5,
    title: "Futures Trading Essentials",
    description:
      "Master futures contracts, hedging, and market speculation strategies",
    level: "Advanced",
    duration: "5h 5min",
    progress: 20,
    modules: 10,
    icon: "TrendingUp",
    category: "Futures",
    instructor: "Robert Anderson",
    rating: 4.7,
    students: 8765,
    lessons: [
      {
        id: 16,
        title: "Understanding Futures Contracts",
        duration: "25 min",
        type: "video",
        completed: true,
      },
      {
        id: 17,
        title: "Futures vs Options",
        duration: "30 min",
        type: "video",
        completed: true,
      },
      {
        id: 18,
        title: "Hedging Strategies",
        duration: "35 min",
        type: "video",
        completed: false,
      },
    ],
  },
  {
    id: 6,
    title: "Forex & Commodities",
    description: "Currency pairs, commodity markets, and global economics",
    level: "Advanced",
    duration: "5h 10min",
    progress: 0,
    modules: 11,
    icon: "Zap",
    category: "Forex",
    instructor: "Emma Wilson",
    rating: 4.6,
    students: 11230,
    lessons: [
      {
        id: 14,
        title: "Forex Market Basics",
        duration: "20 min",
        type: "video",
        completed: false,
      },
      {
        id: 15,
        title: "Currency Pairs Explained",
        duration: "25 min",
        type: "video",
        completed: false,
      },
    ],
  },
];

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);

  // Find the lesson across all courses
  let currentLesson: any = null;
  let parentCourse: any = null;

  for (const course of courses) {
    const lesson = course.lessons.find((l: any) => l.id === lessonId);
    if (lesson) {
      currentLesson = lesson;
      parentCourse = course;
      break;
    }
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
          {!currentLesson.completed && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                alert(
                  "Lesson marked as complete! (Functionality to be implemented)"
                );
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
          <Button
            size="lg"
            variant={currentLesson.completed ? "default" : "outline"}
            className="flex-1"
            onClick={() => {
              alert(
                currentLesson.type === "video"
                  ? "Video player would load here in production"
                  : "Practice exercise would load here in production"
              );
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            {currentLesson.type === "video" ? "Watch Lesson" : "Start Exercise"}
          </Button>
        </div>
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
