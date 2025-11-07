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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Play,
  TrendingUp,
  Target,
  DollarSign,
  Zap,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EducationNavigation } from "@/components/education-navigation";

export default function CoursesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    BookOpen,
  };

  const resolveIcon = (icon: any) => {
    if (!icon) return TrendingUp;
    if (typeof icon === "string") {
      return iconMap[icon] || TrendingUp;
    }
    return icon;
  };

  // Fetch courses from backend API
  useEffect(() => {
    let isMounted = true;
    const CACHE_KEY = "education_courses_cache_v1";
    const CACHE_TTL_MS = 86_400_000; // 1 day
    const fetchCourses = async () => {
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw) as { ts: number; data: any[] };
            const fresh = Date.now() - cached.ts < CACHE_TTL_MS;
            if (fresh && Array.isArray(cached.data)) {
              setCoursesData(cached.data);
              setIsLoading(false);
              return;
            }
          } catch {}
        }

        setIsLoading(true);
        const res = await apiClient.get("/api/v1/education/courses");
        if (!res.ok) throw new Error("Failed to load courses");
        const data = await res.json();
        if (!isMounted) return;
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
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ ts: Date.now(), data: normalized })
        );
      } catch (e) {
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

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category.toLowerCase() === selectedCategory
      );
    }

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

  const handleOpenLesson = (lessonId: number) => {
    router.push(`/education/courses/${lessonId}`);
  };

  const handleStartContinueCourse = () => {
    if (!selectedCourse) return;

    const nextIncompleteLesson = selectedCourse.lessons.find(
      (lesson: any) => !lesson.completed
    );

    if (nextIncompleteLesson) {
      router.push(`/education/courses/${nextIncompleteLesson.id}`);
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
      await apiClient.post(`/api/v1/education/lessons/${lessonId}/complete`);

      const updatedLessons = selectedCourse.lessons.map((lesson: any) =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      );

      // Recalculate progress
      const completedLessons = updatedLessons.filter(
        (l: any) => l.completed
      ).length;
      const totalLessons = updatedLessons.length;
      const newProgress = Math.round((completedLessons / totalLessons) * 100);

      const updatedCourse = {
        ...selectedCourse,
        lessons: updatedLessons,
        progress: newProgress,
      };
      setSelectedCourse(updatedCourse);

      const updatedCoursesData = coursesData.map((course) =>
        course.id === selectedCourse.id ? updatedCourse : course
      );
      setCoursesData(updatedCoursesData);

      // Update sessionStorage cache
      const CACHE_KEY = "education_courses_cache_v1";
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ ts: Date.now(), data: updatedCoursesData })
      );
    } catch (err) {
      toast({
        title: "Failed to save",
        description: "Could not mark lesson as complete.",
      });
    } finally {
      setCompletingLessonId(null);
    }
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

        {/* Courses Content */}
        <div className="space-y-6">
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
        </div>

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
    </div>
  );
}
