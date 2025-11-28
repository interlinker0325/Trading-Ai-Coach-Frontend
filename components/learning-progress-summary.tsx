"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Target, Trophy, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LearningProgressSummaryProps {
  plan: "free" | "pro" | "elite";
}

interface LearningStats {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  inProgressCourses: number;
  overallProgress: number;
}

export function LearningProgressSummary({ plan }: LearningProgressSummaryProps) {
  const [stats, setStats] = useState<LearningStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    inProgressCourses: 0,
    overallProgress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get("/api/v1/education/courses");
        if (!res.ok) {
          throw new Error("Failed to load courses");
        }
        const courses = await res.json();

        let totalLessons = 0;
        let completedLessons = 0;
        let completedCourses = 0;
        let inProgressCourses = 0;

        courses.forEach((course: any) => {
          const lessons = course.lessons || [];
          totalLessons += lessons.length;
          
          const completedInCourse = lessons.filter((l: any) => l.completed).length;
          completedLessons += completedInCourse;

          if (course.progress === 100) {
            completedCourses++;
          } else if (course.progress > 0) {
            inProgressCourses++;
          }
        });

        const overallProgress = totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100) 
          : 0;

        setStats({
          totalCourses: courses.length,
          completedCourses,
          totalLessons,
          completedLessons,
          inProgressCourses,
          overallProgress,
        });
      } catch (error) {
        console.error("Error fetching learning stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Learning Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const statsCards = [
    {
      title: "Overall Progress",
      value: `${stats.overallProgress}%`,
      description: `${stats.completedLessons} of ${stats.totalLessons} lessons`,
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Courses Completed",
      value: `${stats.completedCourses}`,
      description: `out of ${stats.totalCourses} courses`,
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      title: "In Progress",
      value: `${stats.inProgressCourses}`,
      description: "courses you're learning",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Lessons Learned",
      value: `${stats.completedLessons}`,
      description: `total lessons completed`,
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Learning Progress</span>
            </CardTitle>
            <CardDescription>Your educational journey overview</CardDescription>
          </div>
          <Link href="/education">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Learning Progress</span>
            <span className="text-sm font-bold">{stats.overallProgress}%</span>
          </div>
          <Progress value={stats.overallProgress} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.title}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
              </div>
            );
          })}
        </div>

        {plan === "free" && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            Upgrade to Pro or Elite for advanced courses, practice sessions, and personalized learning paths
          </div>
        )}
      </CardContent>
    </Card>
  );
}

