"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Clock,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Loader2,
  X,
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
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Check if this lesson is the first incomplete lesson
  const isFirstIncompleteLesson = (() => {
    if (!parentCourse || !currentLesson || lessonCompleted) return false;
    const lessons = parentCourse.lessons || [];
    const sortedLessons = [...lessons].sort(
      (a: any, b: any) => (a.order || 0) - (b.order || 0)
    );
    const firstIncomplete = sortedLessons.find((l: any) => !l.completed);
    return firstIncomplete?.id === currentLesson.id;
  })();

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
        console.log("lesson", lesson);
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
          <BookOpen className="w-8 h-8 text-primary" />
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

      {/* Content Preview */}
      {currentLesson.content && currentLesson.content.trim() && (
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {(() => {
                  const lines = currentLesson.content.split("\n");
                  const previewLines: string[] = [];
                  let charCount = 0;
                  const maxChars = 500; // Show first ~500 characters as preview

                  for (const line of lines) {
                    if (charCount + line.length > maxChars) {
                      break;
                    }
                    previewLines.push(line);
                    charCount += line.length;
                  }

                  return (
                    <div className="space-y-4">
                      {previewLines.map((line, index) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <br key={index} />;

                        // Check if it's a heading
                        const isHeading =
                          trimmed.length < 60 &&
                          /^[A-Z]/.test(trimmed) &&
                          (!trimmed.includes(".") || trimmed.endsWith(":"));

                        // Check if it's a bullet point
                        const isBullet = trimmed.startsWith("- ");

                        if (isHeading) {
                          return (
                            <h3
                              key={index}
                              className="text-xl font-bold mt-4 mb-2 first:mt-0 text-foreground"
                            >
                              {trimmed.replace(/:\s*$/, "")}
                            </h3>
                          );
                        }

                        if (isBullet) {
                          return (
                            <ul
                              key={index}
                              className="list-disc list-inside ml-4"
                            >
                              <li className="text-foreground">
                                {trimmed.substring(2)}
                              </li>
                            </ul>
                          );
                        }

                        return (
                          <p
                            key={index}
                            className="text-foreground leading-relaxed"
                          >
                            {trimmed}
                          </p>
                        );
                      })}
                      {charCount < currentLesson.content.length && (
                        <p className="text-muted-foreground italic mt-4">
                          ... (Click "Read Lesson" to view full content)
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-6">
        <div className="flex gap-3 pt-4">
          {!lessonCompleted && (
            <div className="flex-1">
              <Button
                size="lg"
                className="w-full"
                disabled={isSaving || !isFirstIncompleteLesson}
                onClick={async () => {
                  try {
                    setIsSaving(true);
                    const res = await apiClient.post(
                      `/api/v1/education/lessons/${lessonId}/complete`
                    );
                    if (!res.ok) throw new Error("Failed to save");
                    setLessonCompleted(true);
                    setCurrentLesson({ ...currentLesson, completed: true });

                    // Update sessionStorage cache
                    try {
                      const CACHE_KEY = "education_courses_cache_v1";
                      const cachedRaw = sessionStorage.getItem(CACHE_KEY);
                      if (cachedRaw) {
                        const cached = JSON.parse(cachedRaw) as {
                          ts: number;
                          data: any[];
                        };
                        const updatedCoursesData = cached.data.map((course) => {
                          if (course.id === parentCourse.id) {
                            const updatedLessons = course.lessons.map(
                              (l: any) =>
                                l.id === lessonId
                                  ? { ...l, completed: true }
                                  : l
                            );
                            const completedLessons = updatedLessons.filter(
                              (l: any) => l.completed
                            ).length;
                            const totalLessons = updatedLessons.length;
                            const newProgress = Math.round(
                              (completedLessons / totalLessons) * 100
                            );
                            return {
                              ...course,
                              lessons: updatedLessons,
                              progress: newProgress,
                            };
                          }
                          return course;
                        });
                        sessionStorage.setItem(
                          CACHE_KEY,
                          JSON.stringify({
                            ts: Date.now(),
                            data: updatedCoursesData,
                          })
                        );
                      }
                    } catch (e) {
                      // If cache update fails, it's not critical
                      console.warn("Failed to update cache:", e);
                    }

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
              {!isFirstIncompleteLesson && !isSaving && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Complete previous lessons first to unlock this lesson
                </p>
              )}
            </div>
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
            Read Lesson
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
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        No content available for this lesson.
                      </p>
                    </div>
                  )}
                </div>
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
                    disabled={isSaving || !isFirstIncompleteLesson}
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

                        // Update sessionStorage cache
                        try {
                          const CACHE_KEY = "education_courses_cache_v1";
                          const cachedRaw = sessionStorage.getItem(CACHE_KEY);
                          if (cachedRaw) {
                            const cached = JSON.parse(cachedRaw) as {
                              ts: number;
                              data: any[];
                            };
                            const updatedCoursesData = cached.data.map(
                              (course) => {
                                if (course.id === parentCourse.id) {
                                  const updatedLessons = course.lessons.map(
                                    (l: any) =>
                                      l.id === lessonId
                                        ? { ...l, completed: true }
                                        : l
                                  );
                                  const completedLessons =
                                    updatedLessons.filter(
                                      (l: any) => l.completed
                                    ).length;
                                  const totalLessons = updatedLessons.length;
                                  const newProgress = Math.round(
                                    (completedLessons / totalLessons) * 100
                                  );
                                  return {
                                    ...course,
                                    lessons: updatedLessons,
                                    progress: newProgress,
                                  };
                                }
                                return course;
                              }
                            );
                            sessionStorage.setItem(
                              CACHE_KEY,
                              JSON.stringify({
                                ts: Date.now(),
                                data: updatedCoursesData,
                              })
                            );
                          }
                        } catch (e) {
                          // If cache update fails, it's not critical
                          console.warn("Failed to update cache:", e);
                        }

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
