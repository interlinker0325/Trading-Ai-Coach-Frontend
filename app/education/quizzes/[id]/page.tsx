"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  CheckCircle,
  XCircle,
  Target,
  Trophy,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<any>({});
  const [quizResults, setQuizResults] = useState<any>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [isRetakingQuiz, setIsRetakingQuiz] = useState(false);
  const isResettingQuizRef = useRef(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(`/api/v1/education/quizzes/${quizId}`);
        if (!res.ok) throw new Error("Failed to load quiz");
        const quizData = await res.json();
        setSelectedQuiz(quizData);
      } catch (err) {
        toast({
          title: "Failed to load quiz",
          description: "Could not load quiz details.",
          variant: "destructive",
        });
        router.push("/education");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [quizId, router, toast]);

  const handleQuizAnswer = (questionId: number, answer: any) => {
    setQuizAnswers((prev: any) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      setIsSubmittingQuiz(true);
      const answersForSubmission: any = {};
      Object.keys(quizAnswers).forEach((key) => {
        const questionId = parseInt(key);
        if (!isNaN(questionId)) {
          answersForSubmission[questionId] = quizAnswers[key];
        }
      });

      const res = await apiClient.post(
        `/api/v1/education/quizzes/${selectedQuiz.id}/submit`,
        { answers: answersForSubmission }
      );
      if (!res.ok) throw new Error("Failed to submit quiz");
      const result = await res.json();

      setQuizResults({
        score: result.score,
        total: result.total_questions,
        percentage: result.percentage,
        question_results: result.question_results || {},
        answers: result.answers || {},
      });

      // Fetch quiz again to get questions with correct answers for display
      const quizRes = await apiClient.get(
        `/api/v1/education/quizzes/${selectedQuiz.id}`
      );
      if (quizRes.ok) {
        const updatedQuiz = await quizRes.json();
        if (result.correct_answers) {
          updatedQuiz.questions = updatedQuiz.questions?.map((q: any) => ({
            ...q,
            correct_answer: result.correct_answers[q.id],
          }));
        }
        setSelectedQuiz(updatedQuiz);

        // Update sessionStorage cache with new quiz data (best_score, attempts_count)
        try {
          const CACHE_KEY = "education_quizzes_cache_v1";
          const cachedRaw = sessionStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as { ts: number; data: any[] };
            const updatedQuizzesData = cached.data.map((quiz) => {
              if (quiz.id === selectedQuiz.id) {
                return {
                  ...quiz,
                  best_score: updatedQuiz.best_score,
                  attempts_count: updatedQuiz.attempts_count,
                };
              }
              return quiz;
            });
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ ts: Date.now(), data: updatedQuizzesData })
            );
          }
        } catch (e) {
          // If cache update fails, it's not critical
          console.warn("Failed to update quiz cache:", e);
        }
      }
    } catch (err) {
      toast({
        title: "Failed to submit quiz",
        description: "Could not submit quiz answers.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const retakeQuiz = async () => {
    try {
      setIsRetakingQuiz(true);
      setQuizAnswers({});
      setQuizResults(null);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsRetakingQuiz(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading quiz...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedQuiz) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Quiz not found</p>
            <Button
              onClick={() => router.push("/education/quizzes")}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/education/quizzes")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedQuiz.title}</h1>
            {selectedQuiz.description && (
              <p className="text-muted-foreground">
                {selectedQuiz.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {!quizResults ? (
        /* Quiz Taking View */
        <div className="space-y-6">
          {/* Progress Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-2xl">
                    {selectedQuiz.title}
                  </CardTitle>
                  {selectedQuiz.description && (
                    <CardDescription className="mt-1">
                      {selectedQuiz.description}
                    </CardDescription>
                  )}
                </div>
              </div>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    Progress: {Object.keys(quizAnswers).length} /{" "}
                    {selectedQuiz.questions?.length || 0} answered
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(
                      (Object.keys(quizAnswers).length /
                        (selectedQuiz.questions?.length || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (Object.keys(quizAnswers).length /
                      (selectedQuiz.questions?.length || 1)) *
                    100
                  }
                  className="h-3"
                />
              </div>
            </CardHeader>
          </Card>

          {/* Quiz Questions */}
          <div className="space-y-6">
            {selectedQuiz.questions
              ?.sort((a: any, b: any) => a.order - b.order)
              .map((question: any, index: number) => {
                const totalQuestions = selectedQuiz.questions?.length || 0;
                const isAnswered = quizAnswers[question.id] !== undefined;
                return (
                  <Card
                    key={question.id}
                    className={`transition-all ${
                      isAnswered
                        ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
                        : "border-border"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground mb-1">
                                Question {index + 1} of {totalQuestions}
                              </div>
                              <h3 className="text-lg font-semibold leading-relaxed">
                                {question.question}
                              </h3>
                            </div>
                          </div>
                        </div>
                        {isAnswered && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-xs font-medium">
                              Answered
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {question.question_type === "multiple-choice" && (
                        <RadioGroup
                          value={quizAnswers[question.id]?.toString()}
                          onValueChange={(value) =>
                            handleQuizAnswer(
                              question.id,
                              Number.parseInt(value)
                            )
                          }
                        >
                          <div className="space-y-3 mt-4">
                            {question.options?.map(
                              (option: string, optIndex: number) => (
                                <div
                                  key={optIndex}
                                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    quizAnswers[question.id] === optIndex
                                      ? "border-primary bg-primary/5 shadow-sm"
                                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                                  }`}
                                  onClick={() =>
                                    handleQuizAnswer(question.id, optIndex)
                                  }
                                >
                                  <RadioGroupItem
                                    value={optIndex.toString()}
                                    id={`q${question.id}-${optIndex}`}
                                    className="cursor-pointer border-2 h-6 w-6 border-foreground/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                  />
                                  <Label
                                    htmlFor={`q${question.id}-${optIndex}`}
                                    className="flex-1 cursor-pointer font-normal text-base"
                                  >
                                    <span className="font-medium mr-2 text-primary">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    {option}
                                  </Label>
                                </div>
                              )
                            )}
                          </div>
                        </RadioGroup>
                      )}

                      {question.question_type === "true-false" && (
                        <RadioGroup
                          value={quizAnswers[question.id]?.toString()}
                          onValueChange={(value) =>
                            handleQuizAnswer(question.id, value === "true")
                          }
                        >
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div
                              className={`p-6 rounded-lg border-2 cursor-pointer transition-all text-center ${
                                quizAnswers[question.id] === true
                                  ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-sm"
                                  : "border-border hover:border-green-500/50 hover:bg-muted/50"
                              }`}
                              onClick={() =>
                                handleQuizAnswer(question.id, true)
                              }
                            >
                              <RadioGroupItem
                                value="true"
                                id={`q${question.id}-true`}
                                className="sr-only border-2"
                              />
                              <Label
                                htmlFor={`q${question.id}-true`}
                                className="cursor-pointer flex flex-col items-center gap-2"
                              >
                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                <span className="font-semibold text-lg">
                                  True
                                </span>
                              </Label>
                            </div>
                            <div
                              className={`p-6 rounded-lg border-2 cursor-pointer transition-all text-center ${
                                quizAnswers[question.id] === false
                                  ? "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-sm"
                                  : "border-border hover:border-red-500/50 hover:bg-muted/50"
                              }`}
                              onClick={() =>
                                handleQuizAnswer(question.id, false)
                              }
                            >
                              <RadioGroupItem
                                value="false"
                                id={`q${question.id}-false`}
                                className="sr-only border-2"
                              />
                              <Label
                                htmlFor={`q${question.id}-false`}
                                className="cursor-pointer flex flex-col items-center gap-2"
                              >
                                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                <span className="font-semibold text-lg">
                                  False
                                </span>
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      )}

                      {question.question_type === "multiple-select" && (
                        <div className="space-y-3 mt-4">
                          {question.options?.map(
                            (option: string, optIndex: number) => {
                              const isChecked =
                                quizAnswers[question.id]?.includes(optIndex) ||
                                false;
                              return (
                                <div
                                  key={optIndex}
                                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    isChecked
                                      ? "border-primary bg-primary/5 shadow-sm"
                                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                                  }`}
                                  onClick={() => {
                                    const current =
                                      quizAnswers[question.id] || [];
                                    if (isChecked) {
                                      handleQuizAnswer(
                                        question.id,
                                        current.filter(
                                          (i: number) => i !== optIndex
                                        )
                                      );
                                    } else {
                                      handleQuizAnswer(question.id, [
                                        ...current,
                                        optIndex,
                                      ]);
                                    }
                                  }}
                                >
                                  <Checkbox
                                    id={`q${question.id}-${optIndex}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        quizAnswers[question.id] || [];
                                      if (checked) {
                                        handleQuizAnswer(question.id, [
                                          ...current,
                                          optIndex,
                                        ]);
                                      } else {
                                        handleQuizAnswer(
                                          question.id,
                                          current.filter(
                                            (i: number) => i !== optIndex
                                          )
                                        );
                                      }
                                    }}
                                    className="cursor-pointer border-2 h-6 w-6 border-foreground/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                  />
                                  <Label
                                    htmlFor={`q${question.id}-${optIndex}`}
                                    className="flex-1 cursor-pointer font-normal text-base"
                                  >
                                    <span className="font-medium mr-2 text-primary">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    {option}
                                  </Label>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

            {/* Submit Button */}
            <Card className="sticky bottom-0 border-t-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {Object.keys(quizAnswers).length} of{" "}
                      {selectedQuiz.questions?.length || 0} questions answered
                    </p>
                    {Object.keys(quizAnswers).length <
                      (selectedQuiz.questions?.length || 0) && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                        Please answer all questions before submitting
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={submitQuiz}
                    size="lg"
                    className="min-w-[140px]"
                    disabled={
                      isSubmittingQuiz ||
                      Object.keys(quizAnswers).length === 0 ||
                      Object.keys(quizAnswers).length <
                        (selectedQuiz.questions?.length || 0)
                    }
                  >
                    {isSubmittingQuiz ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Quiz
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Score Card */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Circular Score Indicator */}
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={
                        quizResults.percentage >= 70
                          ? "rgb(34, 197, 94)"
                          : quizResults.percentage >= 50
                          ? "rgb(234, 179, 8)"
                          : "rgb(239, 68, 68)"
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${
                        (quizResults.percentage / 100) * 351.86
                      } 351.86`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${
                          quizResults.percentage >= 70
                            ? "text-green-600 dark:text-green-400"
                            : quizResults.percentage >= 50
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {quizResults.percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  </div>
                </div>

                {/* Result Icon and Message */}
                <div className="space-y-2">
                  <div className="text-6xl">
                    {quizResults.percentage >= 70 ? (
                      <CheckCircle className="text-green-600 dark:text-green-400" />
                    ) : quizResults.percentage >= 50 ? (
                      <Target className="text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <XCircle className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <h2 className="text-3xl font-bold">
                    {quizResults.percentage >= 90
                      ? "Excellent Work! 🎉"
                      : quizResults.percentage >= 70
                      ? "Great Job! 👍"
                      : quizResults.percentage >= 50
                      ? "Good Effort! 💪"
                      : "Keep Learning! 📚"}
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md">
                    You answered{" "}
                    <span className="font-bold text-foreground">
                      {quizResults.score}
                    </span>{" "}
                    out of{" "}
                    <span className="font-bold text-foreground">
                      {quizResults.total}
                    </span>{" "}
                    questions correctly
                  </p>
                </div>

                {/* Performance Breakdown */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {
                        Object.values(
                          quizResults.question_results || {}
                        ).filter((r) => r === true).length
                      }
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Correct
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {
                        Object.values(
                          quizResults.question_results || {}
                        ).filter((r) => r === false).length
                      }
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Incorrect
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {quizResults.percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Accuracy
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Review */}
          {quizResults.question_results && selectedQuiz.questions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Review Your Answers
                </CardTitle>
                <CardDescription>
                  Review each question to understand what went right or wrong
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedQuiz.questions
                    ?.sort((a: any, b: any) => a.order - b.order)
                    .map((question: any, index: number) => {
                      const isCorrect =
                        quizResults.question_results?.[question.id] ?? false;
                      const userAnswer = quizResults.answers?.[question.id];
                      return (
                        <Card
                          key={question.id}
                          className={`border-2 ${
                            isCorrect
                              ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
                              : "border-red-500/50 bg-red-50/50 dark:bg-red-950/20"
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                  isCorrect
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <p className="font-semibold text-base leading-relaxed">
                                    {question.question}
                                  </p>
                                  {isCorrect ? (
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                  )}
                                </div>

                                {/* Show user's answer and correct answer for multiple-choice */}
                                {question.question_type === "multiple-choice" &&
                                  question.options && (
                                    <div className="mt-3 space-y-3">
                                      {/* User's Answer */}
                                      {userAnswer !== undefined ? (
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground mb-2">
                                            Your Answer:
                                          </p>
                                          <div
                                            className={`p-3 rounded-lg ${
                                              isCorrect
                                                ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                                                : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                                            }`}
                                          >
                                            <span
                                              className={`font-medium mr-2 ${
                                                isCorrect
                                                  ? "text-green-700 dark:text-green-400"
                                                  : "text-red-700 dark:text-red-400"
                                              }`}
                                            >
                                              {String.fromCharCode(
                                                65 +
                                                  (typeof userAnswer ===
                                                  "number"
                                                    ? userAnswer
                                                    : 0)
                                              )}
                                              .
                                            </span>
                                            {
                                              question.options[
                                                typeof userAnswer === "number"
                                                  ? userAnswer
                                                  : 0
                                              ]
                                            }
                                          </div>
                                        </div>
                                      ) : (
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground mb-2">
                                            Your Answer:
                                          </p>
                                          <div className="p-3 rounded-lg bg-muted">
                                            <span className="text-muted-foreground italic">
                                              No answer provided
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {/* Correct Answer */}
                                      {question.correct_answer !== undefined &&
                                        question.correct_answer !== null && (
                                          <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-2">
                                              Correct Answer:
                                            </p>
                                            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                                              <span className="font-medium text-green-700 dark:text-green-400 mr-2">
                                                {String.fromCharCode(
                                                  65 +
                                                    (typeof question.correct_answer ===
                                                    "number"
                                                      ? question.correct_answer
                                                      : 0)
                                                )}
                                                .
                                              </span>
                                              {
                                                question.options[
                                                  typeof question.correct_answer ===
                                                  "number"
                                                    ? question.correct_answer
                                                    : 0
                                                ]
                                              }
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  )}

                                {/* Show user's answer and correct answer for true-false */}
                                {question.question_type === "true-false" && (
                                  <div className="mt-3 space-y-3">
                                    {/* User's Answer */}
                                    {userAnswer !== undefined ? (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">
                                          Your Answer:
                                        </p>
                                        <div
                                          className={`p-3 rounded-lg ${
                                            isCorrect
                                              ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                                              : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                                          }`}
                                        >
                                          <span
                                            className={`font-medium ${
                                              isCorrect
                                                ? "text-green-700 dark:text-green-400"
                                                : "text-red-700 dark:text-red-400"
                                            }`}
                                          >
                                            {userAnswer ? "True" : "False"}
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">
                                          Your Answer:
                                        </p>
                                        <div className="p-3 rounded-lg bg-muted">
                                          <span className="text-muted-foreground italic">
                                            No answer provided
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Correct Answer */}
                                    {question.correct_answer !== undefined &&
                                      question.correct_answer !== null && (
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground mb-2">
                                            Correct Answer:
                                          </p>
                                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                                            <span className="font-medium text-green-700 dark:text-green-400">
                                              {question.correct_answer
                                                ? "True"
                                                : "False"}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                )}

                                {/* Show user's answer and correct answer for multiple-select */}
                                {question.question_type === "multiple-select" &&
                                  question.options && (
                                    <div className="mt-3 space-y-3">
                                      {/* User's Answer */}
                                      {userAnswer !== undefined &&
                                      Array.isArray(userAnswer) ? (
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground mb-2">
                                            Your Answer:
                                          </p>
                                          <div
                                            className={`p-3 rounded-lg space-y-1 ${
                                              isCorrect
                                                ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                                                : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                                            }`}
                                          >
                                            {userAnswer.length > 0 ? (
                                              userAnswer.map(
                                                (optIndex: number) => (
                                                  <div key={optIndex}>
                                                    <span
                                                      className={`font-medium mr-2 ${
                                                        isCorrect
                                                          ? "text-green-700 dark:text-green-400"
                                                          : "text-red-700 dark:text-red-400"
                                                      }`}
                                                    >
                                                      {String.fromCharCode(
                                                        65 + optIndex
                                                      )}
                                                      .
                                                    </span>
                                                    {question.options[optIndex]}
                                                  </div>
                                                )
                                              )
                                            ) : (
                                              <span className="text-muted-foreground">
                                                No options selected
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground mb-2">
                                            Your Answer:
                                          </p>
                                          <div className="p-3 rounded-lg bg-muted">
                                            <span className="text-muted-foreground italic">
                                              No answer provided
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {/* Correct Answer */}
                                      {question.correct_answer !== undefined &&
                                        question.correct_answer !== null &&
                                        Array.isArray(
                                          question.correct_answer
                                        ) && (
                                          <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-2">
                                              Correct Answer:
                                            </p>
                                            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 space-y-1">
                                              {question.correct_answer.map(
                                                (optIndex: number) => (
                                                  <div key={optIndex}>
                                                    <span className="font-medium text-green-700 dark:text-green-400 mr-2">
                                                      {String.fromCharCode(
                                                        65 + optIndex
                                                      )}
                                                      .
                                                    </span>
                                                    {question.options[optIndex]}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  )}

                                {question.explanation && (
                                  <div
                                    className={`mt-4 p-4 rounded-lg border ${
                                      isCorrect
                                        ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                        : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                                    }`}
                                  >
                                    <p className="text-sm font-medium mb-1">
                                      💡 Explanation:
                                    </p>
                                    <p className="text-sm">
                                      {question.explanation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={retakeQuiz}
              size="lg"
              className="flex-1"
              disabled={isRetakingQuiz}
            >
              {isRetakingQuiz ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting Quiz...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Retake Quiz
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => router.push("/education/quizzes")}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Try Another Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
