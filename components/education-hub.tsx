"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Play,
  Trophy,
  Target,
  TrendingUp,
  DollarSign,
  BarChart3,
  Zap,
  BookOpen,
  Brain,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Stock Market Fundamentals",
    description: "Learn the basics of stock trading, market analysis, and investment strategies",
    level: "Beginner",
    duration: "4 hours",
    progress: 75,
    modules: 8,
    icon: TrendingUp,
    category: "Stocks",
  },
  {
    id: 2,
    title: "Options Trading Mastery",
    description: "Advanced options strategies, Greeks, and risk management techniques",
    level: "Advanced",
    duration: "6 hours",
    progress: 30,
    modules: 12,
    icon: Target,
    category: "Options",
  },
  {
    id: 3,
    title: "Cryptocurrency Trading",
    description: "Digital assets, DeFi, and crypto market dynamics",
    level: "Intermediate",
    duration: "5 hours",
    progress: 0,
    modules: 10,
    icon: DollarSign,
    category: "Crypto",
  },
  {
    id: 4,
    title: "Technical Analysis Pro",
    description: "Chart patterns, indicators, and trading psychology",
    level: "Intermediate",
    duration: "7 hours",
    progress: 60,
    modules: 14,
    icon: BarChart3,
    category: "Analysis",
  },
  {
    id: 5,
    title: "Forex & Commodities",
    description: "Currency pairs, commodity markets, and global economics",
    level: "Advanced",
    duration: "5 hours",
    progress: 0,
    modules: 11,
    icon: Zap,
    category: "Forex",
  },
]

const achievements = [
  { id: 1, title: "First Trade", description: "Complete your first simulated trade", earned: true },
  { id: 2, title: "Profit Streak", description: "5 consecutive profitable trades", earned: true },
  { id: 3, title: "Risk Manager", description: "Never risk more than 2% per trade for 30 days", earned: false },
  { id: 4, title: "Diversified", description: "Trade across 5 different asset classes", earned: false },
  { id: 5, title: "Technical Analyst", description: "Complete Technical Analysis course", earned: true },
  { id: 6, title: "Options Expert", description: "Execute 50 options trades", earned: false },
]

const playbooks = [
  {
    id: 1,
    title: "Stock Trading Playbook",
    category: "Stocks",
    description: "Complete guide to stock analysis, entry/exit strategies, and risk management",
    sections: [
      "Fundamental Analysis Framework",
      "Technical Entry Signals",
      "Position Sizing Rules",
      "Stop Loss Strategies",
      "Profit Taking Methods",
    ],
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Options Strategies Playbook",
    category: "Options",
    description: "Master covered calls, cash-secured puts, and advanced spreads",
    sections: ["Covered Call Strategy", "Cash-Secured Puts", "Iron Condors", "Butterfly Spreads", "Greeks Management"],
    icon: Target,
  },
  {
    id: 3,
    title: "Crypto Trading Playbook",
    category: "Crypto",
    description: "Navigate DeFi, spot trading, and crypto market cycles",
    sections: [
      "Market Cycle Analysis",
      "DeFi Yield Strategies",
      "Altcoin Selection",
      "Risk Management",
      "Whale Watching",
    ],
    icon: DollarSign,
  },
  {
    id: 4,
    title: "Forex Trading Playbook",
    category: "Forex",
    description: "Currency pair analysis, carry trades, and economic indicators",
    sections: [
      "Major Pairs Analysis",
      "Economic Calendar Trading",
      "Carry Trade Strategies",
      "Risk-Off/Risk-On",
      "Central Bank Policy",
    ],
    icon: Zap,
  },
  {
    id: 5,
    title: "Commodities Playbook",
    category: "Commodities",
    description: "Trade gold, oil, and agricultural commodities with confidence",
    sections: [
      "Gold Trading Strategies",
      "Oil Market Dynamics",
      "Agricultural Seasonality",
      "Inflation Hedging",
      "Supply/Demand Analysis",
    ],
    icon: BarChart3,
  },
]

const aiExplainers = [
  {
    question: "How to trade EUR/USD safely?",
    category: "Forex",
    answer:
      "EUR/USD is the most liquid currency pair. Key safety measures: 1) Trade during London/NY overlap for best spreads, 2) Use 1-2% position sizing, 3) Watch ECB and Fed policy divergence, 4) Set stops at key support/resistance levels, 5) Avoid trading during major news releases unless experienced.",
  },
  {
    question: "What affects oil price?",
    category: "Commodities",
    answer:
      "Oil prices are driven by: 1) Supply factors (OPEC+ decisions, US shale production, geopolitical tensions), 2) Demand factors (economic growth, seasonal driving patterns, industrial activity), 3) Dollar strength (inverse correlation), 4) Inventory levels (EIA reports), 5) Geopolitical events in major oil regions.",
  },
  {
    question: "When should I sell covered calls?",
    category: "Options",
    answer:
      "Sell covered calls when: 1) You own 100+ shares of stock, 2) Stock is in sideways/slightly bullish trend, 3) Implied volatility is elevated (>30th percentile), 4) You're willing to sell shares at strike price, 5) 30-45 days to expiration for optimal theta decay.",
  },
  {
    question: "How to identify crypto whale movements?",
    category: "Crypto",
    answer:
      "Track whale activity through: 1) On-chain analysis (large wallet movements), 2) Exchange inflows/outflows, 3) Order book analysis for large bids/asks, 4) Social sentiment shifts, 5) Unusual volume spikes. Use tools like Whale Alert, Glassnode, or CryptoQuant for real-time monitoring.",
  },
]

const quizzes = [
  {
    id: 1,
    title: "Stock Market Basics Quiz",
    category: "Stocks",
    questions: [
      {
        type: "multiple-choice",
        question: "What is the P/E ratio?",
        options: ["Price to Earnings", "Profit to Equity", "Price to Equity", "Profit to Earnings"],
        correct: 0,
      },
      {
        type: "true-false",
        question: "A higher P/E ratio always means a stock is overvalued.",
        correct: false,
      },
      {
        type: "multiple-select",
        question: "Which factors affect stock prices? (Select all that apply)",
        options: ["Company earnings", "Market sentiment", "Interest rates", "Weather"],
        correct: [0, 1, 2],
      },
    ],
  },
  {
    id: 2,
    title: "Options Trading Quiz",
    category: "Options",
    questions: [
      {
        type: "multiple-choice",
        question: "What happens to option value as expiration approaches?",
        options: ["Increases", "Decreases", "Stays same", "Becomes negative"],
        correct: 1,
      },
      {
        type: "true-false",
        question: "You can only exercise American options at expiration.",
        correct: false,
      },
    ],
  },
]

const checklists = [
  {
    id: 1,
    title: "Pre-Trade Checklist",
    category: "General",
    items: [
      "Market direction analysis completed",
      "Risk/reward ratio calculated (min 1:2)",
      "Position size determined (max 2% risk)",
      "Entry and exit points identified",
      "Stop loss level set",
      "Market hours and liquidity confirmed",
    ],
  },
  {
    id: 2,
    title: "Options Trade Checklist",
    category: "Options",
    items: [
      "Implied volatility rank checked",
      "Time to expiration optimal (30-45 days)",
      "Strike selection based on delta",
      "Greeks impact understood",
      "Assignment risk evaluated",
      "Exit strategy planned",
    ],
  },
]

export function EducationHub() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [quizAnswers, setQuizAnswers] = useState<any>({})
  const [quizResults, setQuizResults] = useState<any>(null)
  const [aiQuery, setAiQuery] = useState("")

  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter((course) => course.category.toLowerCase() === selectedCategory)

  const handleQuizAnswer = (questionIndex: number, answer: any) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const submitQuiz = () => {
    if (!selectedQuiz) return

    let correct = 0
    selectedQuiz.questions.forEach((question: any, index: number) => {
      const userAnswer = quizAnswers[index]
      if (question.type === "multiple-choice" || question.type === "true-false") {
        if (userAnswer === question.correct) correct++
      } else if (question.type === "multiple-select") {
        if (Array.isArray(userAnswer) && Array.isArray(question.correct)) {
          if (
            userAnswer.length === question.correct.length &&
            userAnswer.every((ans) => question.correct.includes(ans))
          ) {
            correct++
          }
        }
      }
    })

    setQuizResults({
      score: correct,
      total: selectedQuiz.questions.length,
      percentage: Math.round((correct / selectedQuiz.questions.length) * 100),
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Education Hub</h1>
          <p className="text-muted-foreground">Master trading with interactive courses, playbooks, and AI guidance</p>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          Start Learning
        </Button>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
          <TabsTrigger value="ai-explainer">AI Explainer</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Course Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Courses
            </Button>
            {["stocks", "options", "crypto", "analysis", "forex"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const IconComponent = course.icon
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-8 h-8 text-primary" />
                      <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{course.modules} modules</span>
                      <span>{course.duration}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    <Button className="w-full" variant={course.progress > 0 ? "default" : "outline"}>
                      {course.progress > 0 ? "Continue" : "Start Course"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Playbooks Section */}
        <TabsContent value="playbooks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playbooks.map((playbook) => {
              const IconComponent = playbook.icon
              return (
                <Card key={playbook.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-8 h-8 text-primary" />
                      <Badge variant="outline">{playbook.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{playbook.title}</CardTitle>
                    <CardDescription>{playbook.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Sections Included:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {playbook.sections.map((section, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {section}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Open Playbook
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Checklists Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Trading Checklists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {checklists.map((checklist) => (
                <Card key={checklist.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {checklist.title}
                    </CardTitle>
                    <Badge variant="secondary">{checklist.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {checklist.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox id={`${checklist.id}-${index}`} />
                          <Label htmlFor={`${checklist.id}-${index}`} className="text-sm">
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* AI Explainer Section */}
        <TabsContent value="ai-explainer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Trading Explainer
              </CardTitle>
              <CardDescription>Ask any trading question and get AI-powered explanations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a trading question... (e.g., How to trade EUR/USD safely?)"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="flex-1"
                />
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Popular Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiExplainers.map((explainer, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{explainer.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{explainer.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{explainer.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Quizzes Section */}
        <TabsContent value="quizzes" className="space-y-6">
          {!selectedQuiz ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      {quiz.title}
                    </CardTitle>
                    <Badge variant="outline">{quiz.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{quiz.questions.length} questions</p>
                    <Button className="w-full">Start Quiz</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedQuiz.title}</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedQuiz(null)
                      setQuizAnswers({})
                      setQuizResults(null)
                    }}
                  >
                    Back to Quizzes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!quizResults ? (
                  <>
                    {selectedQuiz.questions.map((question: any, index: number) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-medium">
                          Question {index + 1}: {question.question}
                        </h3>

                        {question.type === "multiple-choice" && (
                          <RadioGroup
                            value={quizAnswers[index]?.toString()}
                            onValueChange={(value) => handleQuizAnswer(index, Number.parseInt(value))}
                          >
                            {question.options.map((option: string, optIndex: number) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={optIndex.toString()} id={`q${index}-${optIndex}`} />
                                <Label htmlFor={`q${index}-${optIndex}`}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}

                        {question.type === "true-false" && (
                          <RadioGroup
                            value={quizAnswers[index]?.toString()}
                            onValueChange={(value) => handleQuizAnswer(index, value === "true")}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id={`q${index}-true`} />
                              <Label htmlFor={`q${index}-true`}>True</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id={`q${index}-false`} />
                              <Label htmlFor={`q${index}-false`}>False</Label>
                            </div>
                          </RadioGroup>
                        )}

                        {question.type === "multiple-select" && (
                          <div className="space-y-2">
                            {question.options.map((option: string, optIndex: number) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`q${index}-${optIndex}`}
                                  checked={quizAnswers[index]?.includes(optIndex) || false}
                                  onCheckedChange={(checked) => {
                                    const current = quizAnswers[index] || []
                                    if (checked) {
                                      handleQuizAnswer(index, [...current, optIndex])
                                    } else {
                                      handleQuizAnswer(
                                        index,
                                        current.filter((i: number) => i !== optIndex),
                                      )
                                    }
                                  }}
                                />
                                <Label htmlFor={`q${index}-${optIndex}`}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <Button onClick={submitQuiz} className="w-full" size="lg">
                      Submit Quiz
                    </Button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className={`text-6xl ${quizResults.percentage >= 70 ? "text-green-500" : "text-red-500"}`}>
                      {quizResults.percentage >= 70 ? <CheckCircle /> : <XCircle />}
                    </div>
                    <h2 className="text-2xl font-bold">
                      {quizResults.percentage >= 70 ? "Great Job!" : "Keep Learning!"}
                    </h2>
                    <p className="text-lg">
                      You scored {quizResults.score} out of {quizResults.total} ({quizResults.percentage}%)
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => {
                          setQuizAnswers({})
                          setQuizResults(null)
                        }}
                      >
                        Retake Quiz
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedQuiz(null)
                          setQuizAnswers({})
                          setQuizResults(null)
                        }}
                      >
                        Try Another Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="simulator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Paper Trading Simulator
              </CardTitle>
              <CardDescription>Practice trading with virtual money across all asset classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simulator Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$125,430</div>
                  <div className="text-sm text-muted-foreground">Portfolio Value</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+25.43%</div>
                  <div className="text-sm text-muted-foreground">Total Return</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">247</div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">68%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex-col">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  Trade Stocks
                </Button>
                <Button className="h-20 flex-col bg-transparent" variant="outline">
                  <Target className="w-6 h-6 mb-2" />
                  Options
                </Button>
                <Button className="h-20 flex-col bg-transparent" variant="outline">
                  <DollarSign className="w-6 h-6 mb-2" />
                  Crypto
                </Button>
                <Button className="h-20 flex-col bg-transparent" variant="outline">
                  <Zap className="w-6 h-6 mb-2" />
                  Forex
                </Button>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Start Trading Session
                </Button>
                <Button size="lg" variant="outline">
                  View Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.earned ? "border-primary" : "opacity-60"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Trophy className={`w-6 h-6 ${achievement.earned ? "text-yellow-500" : "text-muted-foreground"}`} />
                    {achievement.earned && <Badge variant="secondary">Earned</Badge>}
                  </div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
