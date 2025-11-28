"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ContinueLearningProps {
  plan: "free" | "pro" | "elite";
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
  lessons: Array<{ id: number; completed: boolean; order: number }>;
  icon?: string;
}

export function ContinueLearning({ plan }: ContinueLearningProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiClient.get("/api/v1/education/courses");
        if (!res.ok) {
          throw new Error("Failed to load courses");
        }
        const data = await res.json();
        
        // Filter courses that are in progress (progress > 0 but < 100)
        const inProgress = data
          .filter((course: any) => course.progress > 0 && course.progress < 100)
          .sort((a: any, b: any) => b.progress - a.progress) // Sort by progress descending
          .slice(0, 3); // Show top 3

        setCourses(inProgress);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleContinueCourse = (course: Course) => {
    // Find the first incomplete lesson
    const incompleteLesson = course.lessons.find((lesson) => !lesson.completed);
    if (incompleteLesson) {
      router.push(`/education/courses/${incompleteLesson.id}`);
    } else {
      router.push(`/education/courses`);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Continue Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Continue Learning</span>
              </CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-sm font-medium mb-2">No courses in progress</p>
              <p className="text-xs text-muted-foreground mb-4">
                Start a new course to begin your learning journey
              </p>
              <Link href="/education">
                <Button>
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Continue Learning</span>
            </CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </div>
          <Link href="/education">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course) => {
          const completedLessons = course.lessons.filter((l) => l.completed).length;
          const totalLessons = course.lessons.length;

          return (
            <div
              key={course.id}
              className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-sm">{course.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {completedLessons} of {totalLessons} lessons completed
                  </span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <Button
                onClick={() => handleContinueCourse(course)}
                size="sm"
                className="w-full"
                variant="outline"
              >
                <Play className="mr-2 h-3 w-3" />
                Continue Course
              </Button>
            </div>
          );
        })}

        {courses.length < 3 && (
          <Link href="/education">
            <Button variant="outline" className="w-full" size="sm">
              Browse More Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

