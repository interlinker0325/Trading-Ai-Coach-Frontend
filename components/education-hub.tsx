"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Play,
  Trophy,
  Target,
  TrendingUp,
  DollarSign,
  BarChart3,
  Zap,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Search,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Removed mock courses; data now comes from backend API

const achievements = [
  {
    id: 1,
    title: "First Trade",
    description: "Complete your first simulated trade",
    earned: true,
  },
  {
    id: 2,
    title: "Profit Streak",
    description: "5 consecutive profitable trades",
    earned: true,
  },
  {
    id: 3,
    title: "Risk Manager",
    description: "Never risk more than 2% per trade for 30 days",
    earned: false,
  },
  {
    id: 4,
    title: "Diversified",
    description: "Trade across 5 different asset classes",
    earned: false,
  },
  {
    id: 5,
    title: "Technical Analyst",
    description: "Complete Technical Analysis course",
    earned: true,
  },
  {
    id: 6,
    title: "Options Expert",
    description: "Execute 50 options trades",
    earned: false,
  },
];

const quizzes = [
  {
    id: 1,
    title: "Stock Market Basics Quiz",
    category: "Stocks",
    questions: [
      {
        type: "multiple-choice",
        question: "What is the P/E ratio?",
        options: [
          "Price to Earnings",
          "Profit to Equity",
          "Price to Equity",
          "Profit to Earnings",
        ],
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
        options: [
          "Company earnings",
          "Market sentiment",
          "Interest rates",
          "Weather",
        ],
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
];

export function EducationHub() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<any>({});
  const [quizResults, setQuizResults] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingLessonId, setCompletingLessonId] = useState<number | null>(
    null
  );

  // Map string icon names (from backend) to Lucide components
  const iconMap: Record<string, any> = {
    TrendingUp,
    Target,
    DollarSign,
    Zap,
    BarChart3,
    Trophy,
    BookOpen,
  };

  const resolveIcon = (icon: any) => {
    if (!icon) return TrendingUp;
    if (typeof icon === "string") {
      return iconMap[icon] || TrendingUp;
    }
    return icon; // already a component
  };

  // Fetch courses from backend API
  useEffect(() => {
    let isMounted = true;
    const CACHE_KEY = "education_courses_cache_v1";
    const CACHE_TTL_MS = 3_600_000; // 1 hour
    const fetchCourses = async () => {
      try {
        // Try client-side cache first to avoid visible reloads
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw) as { ts: number; data: any[] };
            const fresh = Date.now() - cached.ts < CACHE_TTL_MS;
            if (fresh && Array.isArray(cached.data)) {
              setCoursesData(cached.data);
              setIsLoading(false);
              // If fresh, skip network fetch entirely
              return;
            }
          } catch {}
        }

        setIsLoading(true);
        const res = await apiClient.get("/api/v1/education/courses");
        if (!res.ok) throw new Error("Failed to load courses");
        const data = await res.json();
        if (!isMounted) return;
        // Ensure minimal shape compatibility
        const normalized = Array.isArray(data)
          ? data.map((c: any) => ({
              ...c,
              lessons: Array.isArray(c.lessons)
                ? c.lessons.map((l: any, idx: number) => ({
                    ...l,
                    completed: !!l.completed,
                    order: l.order ?? idx + 1,
                  }))
                : [],
            }))
          : [];
        setCoursesData(normalized);
        // Save to client-side cache
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ ts: Date.now(), data: normalized })
        );
      } catch (e) {
        // Keep empty or previously loaded data if backend unavailable
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = (() => {
    let filtered = coursesData;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category.toLowerCase() === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  })();

  // Removed mock initialization; progress/completion will sync when selecting a course or on focus

  // Sync completion status when course is selected (no localStorage; rely on in-memory/backend)
  useEffect(() => {
    if (selectedCourse) {
      // Always get the latest from coursesData first
      const currentCourse = coursesData.find((c) => c.id === selectedCourse.id);
      const courseToSync = currentCourse || selectedCourse;

      const updatedLessons = courseToSync.lessons;

      // Recalculate progress immediately
      const completedLessons = updatedLessons.filter(
        (l: any) => l.completed
      ).length;
      const totalLessons = updatedLessons.length;
      const newProgress = Math.round((completedLessons / totalLessons) * 100);

      const updatedCourse = {
        ...courseToSync,
        lessons: updatedLessons,
        progress: newProgress,
      };

      setSelectedCourse(updatedCourse);

      setCoursesData((prev) =>
        prev.map((course) =>
          course.id === selectedCourse.id ? updatedCourse : course
        )
      );
    }
  }, [selectedCourse?.id]);

  // Sync when window regains focus (user returns from lesson page)
  useEffect(() => {
    const handleFocus = () => {
      if (selectedCourse) {
        // Always get the latest from coursesData first
        const currentCourse = coursesData.find(
          (c) => c.id === selectedCourse.id
        );
        const courseToSync = currentCourse || selectedCourse;

        const updatedLessons = courseToSync.lessons;

        // Recalculate progress immediately
        const completedLessons = updatedLessons.filter(
          (l: any) => l.completed
        ).length;
        const totalLessons = updatedLessons.length;
        const newProgress = Math.round((completedLessons / totalLessons) * 100);

        const updatedCourse = {
          ...courseToSync,
          lessons: updatedLessons,
          progress: newProgress,
        };

        setSelectedCourse(updatedCourse);

        setCoursesData((prev) =>
          prev.map((course) =>
            course.id === selectedCourse.id ? updatedCourse : course
          )
        );
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [selectedCourse?.id, coursesData]);

  // Course management functions
  const updateCourseProgress = (courseId: number) => {
    setCoursesData((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          const completedLessons = course.lessons.filter(
            (l: any) => l.completed
          ).length;
          const totalLessons = course.lessons.length;
          const newProgress = Math.round(
            (completedLessons / totalLessons) * 100
          );
          return { ...course, progress: newProgress };
        }
        return course;
      })
    );

    // Update selected course if it's the same
    setSelectedCourse((prev: any) => {
      if (prev && prev.id === courseId) {
        const completedLessons = prev.lessons.filter(
          (l: any) => l.completed
        ).length;
        const totalLessons = prev.lessons.length;
        const newProgress = Math.round((completedLessons / totalLessons) * 100);
        return { ...prev, progress: newProgress };
      }
      return prev;
    });
  };

  const handleOpenLesson = (lessonId: number) => {
    router.push(`/education/lesson/${lessonId}`);
  };

  const handleStartContinueCourse = () => {
    if (!selectedCourse) return;

    const nextIncompleteLesson = selectedCourse.lessons.find(
      (lesson: any) => !lesson.completed
    );

    if (nextIncompleteLesson) {
      router.push(`/education/lesson/${nextIncompleteLesson.id}`);
    } else {
      toast({
        title: "Course completed",
        description: "You have completed all lessons for this course",
      });
    }
  };

  const handleCompleteLesson = async (lessonId: number) => {
    if (!selectedCourse) return;

    try {
      setCompletingLessonId(lessonId);
      // Persist to backend
      await apiClient.post(`/api/v1/education/lessons/${lessonId}/complete`);

      const updatedLessons = selectedCourse.lessons.map((lesson: any) =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      );

      const updatedCourse = { ...selectedCourse, lessons: updatedLessons };
      setSelectedCourse(updatedCourse);

      setCoursesData((prev) =>
        prev.map((course) =>
          course.id === selectedCourse.id ? updatedCourse : course
        )
      );

      // Recalculate progress
      setTimeout(() => updateCourseProgress(selectedCourse.id), 100);
    } catch (err) {
      toast({
        title: "Failed to save",
        description: "Could not mark lesson as complete.",
      });
    } finally {
      setCompletingLessonId(null);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answer: any) => {
    setQuizAnswers((prev: any) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const submitQuiz = () => {
    if (!selectedQuiz) return;

    let correct = 0;
    selectedQuiz.questions.forEach((question: any, index: number) => {
      const userAnswer = quizAnswers[index];
      if (
        question.type === "multiple-choice" ||
        question.type === "true-false"
      ) {
        if (userAnswer === question.correct) correct++;
      } else if (question.type === "multiple-select") {
        if (Array.isArray(userAnswer) && Array.isArray(question.correct)) {
          if (
            userAnswer.length === question.correct.length &&
            userAnswer.every((ans: any) => question.correct.includes(ans))
          ) {
            correct++;
          }
        }
      }
    });

    setQuizResults({
      score: correct,
      total: selectedQuiz.questions.length,
      percentage: Math.round((correct / selectedQuiz.questions.length) * 100),
    });
  };

  const getLevelColor = (level: string) => {
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Education Hub</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Master trading with interactive courses, playbooks, and AI guidance
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Play className="w-4 h-4 mr-2" />
          Start Learning
        </Button>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-full md:grid md:w-full md:grid-cols-4 h-auto min-w-max md:min-w-0">
            <TabsTrigger
              value="courses"
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="quizzes"
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              Quizzes
            </TabsTrigger>
            <TabsTrigger
              value="simulator"
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              Simulator
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              Achievements
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="courses" className="space-y-6">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search courses by title, description, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Course Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Courses
            </Button>
            {["stocks", "options", "crypto", "forex"].map((category) => (
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

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading courses...
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const IconComponent = resolveIcon(course.icon);
                return (
                  <Card
                    key={course.id}
                    className="hover:shadow-lg transition-shadow h-full flex flex-col"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <IconComponent className="w-8 h-8 text-primary" />
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 space-y-4">
                      {/* Duration and Modules */}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <span>{course.modules} modules</span>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Your Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto pt-2">
                        <Button
                          className="flex-1"
                          variant={course.progress > 0 ? "default" : "outline"}
                          onClick={() => {
                            // Get the latest course data from coursesData to ensure we have synced data
                            const latestCourse =
                              coursesData.find((c) => c.id === course.id) ||
                              course;
                            setSelectedCourse(latestCourse);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {course.progress > 0 ? "Continue" : "Start Course"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Get the latest course data from coursesData to ensure we have synced data
                            const latestCourse =
                              coursesData.find((c) => c.id === course.id) ||
                              course;
                            setSelectedCourse(latestCourse);
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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
                    <p className="text-sm text-muted-foreground mb-4">
                      {quiz.questions.length} questions
                    </p>
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
                      setSelectedQuiz(null);
                      setQuizAnswers({});
                      setQuizResults(null);
                    }}
                  >
                    Back to Quizzes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!quizResults ? (
                  <>
                    {selectedQuiz.questions.map(
                      (question: any, index: number) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border rounded-lg"
                        >
                          <h3 className="font-medium">
                            Question {index + 1}: {question.question}
                          </h3>

                          {question.type === "multiple-choice" && (
                            <RadioGroup
                              value={quizAnswers[index]?.toString()}
                              onValueChange={(value) =>
                                handleQuizAnswer(index, Number.parseInt(value))
                              }
                            >
                              {question.options.map(
                                (option: string, optIndex: number) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={optIndex.toString()}
                                      id={`q${index}-${optIndex}`}
                                    />
                                    <Label htmlFor={`q${index}-${optIndex}`}>
                                      {option}
                                    </Label>
                                  </div>
                                )
                              )}
                            </RadioGroup>
                          )}

                          {question.type === "true-false" && (
                            <RadioGroup
                              value={quizAnswers[index]?.toString()}
                              onValueChange={(value) =>
                                handleQuizAnswer(index, value === "true")
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="true"
                                  id={`q${index}-true`}
                                />
                                <Label htmlFor={`q${index}-true`}>True</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="false"
                                  id={`q${index}-false`}
                                />
                                <Label htmlFor={`q${index}-false`}>False</Label>
                              </div>
                            </RadioGroup>
                          )}

                          {question.type === "multiple-select" && (
                            <div className="space-y-2">
                              {question.options.map(
                                (option: string, optIndex: number) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`q${index}-${optIndex}`}
                                      checked={
                                        quizAnswers[index]?.includes(
                                          optIndex
                                        ) || false
                                      }
                                      onCheckedChange={(checked) => {
                                        const current =
                                          quizAnswers[index] || [];
                                        if (checked) {
                                          handleQuizAnswer(index, [
                                            ...current,
                                            optIndex,
                                          ]);
                                        } else {
                                          handleQuizAnswer(
                                            index,
                                            current.filter(
                                              (i: number) => i !== optIndex
                                            )
                                          );
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`q${index}-${optIndex}`}>
                                      {option}
                                    </Label>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )
                    )}

                    <Button onClick={submitQuiz} className="w-full" size="lg">
                      Submit Quiz
                    </Button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div
                      className={`text-6xl ${
                        quizResults.percentage >= 70
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {quizResults.percentage >= 70 ? (
                        <CheckCircle />
                      ) : (
                        <XCircle />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold">
                      {quizResults.percentage >= 70
                        ? "Great Job!"
                        : "Keep Learning!"}
                    </h2>
                    <p className="text-lg">
                      You scored {quizResults.score} out of {quizResults.total}{" "}
                      ({quizResults.percentage}%)
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizResults(null);
                        }}
                      >
                        Retake Quiz
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedQuiz(null);
                          setQuizAnswers({});
                          setQuizResults(null);
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
          {/* Backtester Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Strategy Backtester
              </CardTitle>
              <CardDescription>
                Build and test trading strategies with custom indicators and
                rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-type">Asset Type</Label>
                  <select
                    id="asset-type"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue="stocks"
                  >
                    <option value="stocks">Stocks</option>
                    <option value="crypto">Crypto</option>
                    <option value="forex">Forex</option>
                    <option value="commodities">Commodities</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticker">Ticker/Symbol</Label>
                  <Input
                    id="ticker"
                    placeholder="e.g., AAPL, BTC/USD, EUR/USD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <select
                    id="timeframe"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue="1d"
                  >
                    <option value="1h">1 Hour</option>
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Backtest Period</Label>
                  <select
                    id="period"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue="1y"
                  >
                    <option value="1m">1 Month</option>
                    <option value="6m">6 Months</option>
                    <option value="1y">1 Year</option>
                    <option value="5y">5 Years</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Select Indicators</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "SMA",
                    "EMA",
                    "MACD",
                    "RSI",
                    "Bollinger",
                    "VWAP",
                    "ATR",
                  ].map((indicator) => (
                    <div
                      key={indicator}
                      className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted"
                    >
                      <Checkbox id={indicator} />
                      <Label htmlFor={indicator}>{indicator}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entry Condition</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>RSI &lt; 30 (Oversold)</option>
                    <option>SMA Golden Cross</option>
                    <option>MACD Bullish</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Exit Condition</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>RSI &gt; 70 (Overbought)</option>
                    <option>SMA Death Cross</option>
                    <option>MACD Bearish</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Stop Loss (%)</Label>
                  <Input type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label>Take Profit (%)</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label>Position Size ($)</Label>
                  <Input type="number" placeholder="1000" />
                </div>
              </div>

              <Button size="lg" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Run Backtest
              </Button>
            </CardContent>
          </Card>

          {/* Paper Trading Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Paper Trading Simulator
              </CardTitle>
              <CardDescription>
                Practice trading with virtual money across all asset classes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simulator Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    $125,430
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Portfolio Value
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    +25.43%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Return
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">247</div>
                  <div className="text-sm text-muted-foreground">
                    Total Trades
                  </div>
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
                <Button
                  className="h-20 flex-col bg-transparent"
                  variant="outline"
                >
                  <Target className="w-6 h-6 mb-2" />
                  Options
                </Button>
                <Button
                  className="h-20 flex-col bg-transparent"
                  variant="outline"
                >
                  <DollarSign className="w-6 h-6 mb-2" />
                  Crypto
                </Button>
                <Button
                  className="h-20 flex-col bg-transparent"
                  variant="outline"
                >
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
              <Card
                key={achievement.id}
                className={`${
                  achievement.earned ? "border-primary" : "opacity-60"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Trophy
                      className={`w-6 h-6 ${
                        achievement.earned
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    {achievement.earned && (
                      <Badge variant="secondary">Earned</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Course Details Modal */}
      <Dialog
        open={!!selectedCourse}
        onOpenChange={() => setSelectedCourse(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCourse &&
            (() => {
              const IconComponent = resolveIcon(selectedCourse.icon);
              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <IconComponent className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <div className="text-2xl">{selectedCourse.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getLevelColor(selectedCourse.level)}
                          >
                            {selectedCourse.level}
                          </Badge>
                        </div>
                      </div>
                    </DialogTitle>
                    <DialogDescription>
                      {selectedCourse.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold mb-1">
                          <Clock className="w-5 h-5 inline mr-1" />
                          {selectedCourse.duration}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Duration
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold mb-1">
                          {selectedCourse.modules}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Modules
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Progress</span>
                        <span>{selectedCourse.progress}%</span>
                      </div>
                      <Progress
                        value={selectedCourse.progress}
                        className="h-3"
                      />
                    </div>

                    {/* Lessons List */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Course Lessons
                      </h3>
                      <div className="space-y-3">
                        {selectedCourse.lessons.map(
                          (lesson: any, index: number) => {
                            const firstIncompleteIndex =
                              selectedCourse.lessons.findIndex(
                                (l: any) => !l.completed
                              );
                            const isFirstIncomplete =
                              index === firstIncompleteIndex;

                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                onClick={() => handleOpenLesson(lesson.id)}
                              >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium">
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {lesson.title}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                </div>
                                {lesson.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={
                                      !isFirstIncomplete ||
                                      completingLessonId === lesson.id
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCompleteLesson(lesson.id);
                                    }}
                                  >
                                    {completingLessonId === lesson.id ? (
                                      <span className="inline-flex items-center">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                      </span>
                                    ) : (
                                      "Mark Complete"
                                    )}
                                  </Button>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t">
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handleStartContinueCourse}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {selectedCourse.progress > 0
                          ? "Continue Learning"
                          : "Start Course"}
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
