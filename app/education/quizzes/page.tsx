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
import { Trophy, BookOpen, Loader2, Play } from "lucide-react";
import { EducationNavigation } from "@/components/education-navigation";

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzesData, setQuizzesData] = useState<any[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const CACHE_KEY = "education_quizzes_cache_v1";
    const CACHE_TTL_MS = 86_400_000; // 1 day
    const fetchQuizzes = async () => {
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw) as { ts: number; data: any[] };
            const fresh = Date.now() - cached.ts < CACHE_TTL_MS;
            if (fresh && Array.isArray(cached.data)) {
              setQuizzesData(cached.data);
              setIsLoadingQuizzes(false);
              return;
            }
          } catch {}
        }

        setIsLoadingQuizzes(true);
        const res = await apiClient.get("/api/v1/education/quizzes");
        if (!res.ok) throw new Error("Failed to load quizzes");
        const data = await res.json();
        if (!isMounted) return;
        setQuizzesData(Array.isArray(data) ? data : []);
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            ts: Date.now(),
            data: Array.isArray(data) ? data : [],
          })
        );
      } catch (e) {
      } finally {
        if (isMounted) setIsLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Education Hub</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Master trading with interactive courses, playbooks, and quizzes
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Play className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </div>

        {/* Navigation */}
        <EducationNavigation />

        {/* Quizzes Content */}
        <div className="space-y-6">
          {isLoadingQuizzes ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading quizzes...
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Quiz List Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Test Your Knowledge</h2>
                  <p className="text-muted-foreground">
                    Take quizzes to assess your understanding
                  </p>
                </div>
              </div>

              {/* Quiz Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzesData.map((quiz) => {
                  const hasBestScore =
                    quiz.best_score !== null && quiz.best_score !== undefined;
                  return (
                    <Card
                      key={quiz.id}
                      className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50 flex flex-col h-full"
                      onClick={() => {
                        router.push(`/education/quizzes/${quiz.id}`);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Trophy className="w-5 h-5 text-primary" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {quiz.category}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {quiz.title}
                        </CardTitle>
                        {quiz.description && (
                          <CardDescription className="mt-2 line-clamp-2">
                            {quiz.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1 space-y-4">
                        {/* Quiz Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            <span>{quiz.questions?.length || 0} Questions</span>
                          </div>
                          {hasBestScore && (
                            <div className="flex items-center gap-1 text-primary font-medium">
                              <Trophy className="w-4 h-4" />
                              <span>{quiz.best_score}% Best</span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar if attempted */}
                        {hasBestScore && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Your Best Score</span>
                              <span>{quiz.best_score}%</span>
                            </div>
                            <Progress value={quiz.best_score} className="h-2" />
                          </div>
                        )}

                        {/* Attempts Badge */}
                        {quiz.attempts_count > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {quiz.attempts_count} attempt
                            {quiz.attempts_count > 1 ? "s" : ""} completed
                          </div>
                        )}

                        {/* Spacer to push button to bottom */}
                        <div className="flex-1" />

                        {/* Button always at bottom */}
                        <Button
                          className="w-full mt-auto group-hover:shadow-md transition-shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/education/quizzes/${quiz.id}`);
                          }}
                        >
                          {hasBestScore ? "Retake Quiz" : "Start Quiz"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
                {quizzesData.length === 0 && (
                  <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground font-medium">
                      No quizzes available
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Check back later for new quizzes
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
