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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  Target,
  DollarSign,
  Zap,
  BarChart3,
  BookOpen,
  Loader2,
  Search,
  Play,
} from "lucide-react";
import { EducationNavigation } from "@/components/education-navigation";

export default function PlaybooksPage() {
  const router = useRouter();
  const [selectedPlaybook, setSelectedPlaybook] = useState<any>(null);
  const [playbookSearchQuery, setPlaybookSearchQuery] = useState("");
  const [playbookCategory, setPlaybookCategory] = useState("all");
  const [playbooksData, setPlaybooksData] = useState<any[]>([]);
  const [isLoadingPlaybooks, setIsLoadingPlaybooks] = useState(true);

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

  useEffect(() => {
    let isMounted = true;
    const CACHE_KEY = "education_playbooks_cache_v1";
    const CACHE_TTL_MS = 86_400_000; // 1 day
    const fetchPlaybooks = async () => {
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw) as { ts: number; data: any[] };
            const fresh = Date.now() - cached.ts < CACHE_TTL_MS;
            if (fresh && Array.isArray(cached.data)) {
              setPlaybooksData(cached.data);
              setIsLoadingPlaybooks(false);
              return;
            }
          } catch {}
        }

        setIsLoadingPlaybooks(true);
        const res = await apiClient.get("/api/v1/education/playbooks");
        if (!res.ok) throw new Error("Failed to load playbooks");
        const data = await res.json();
        if (!isMounted) return;
        setPlaybooksData(Array.isArray(data) ? data : []);
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            ts: Date.now(),
            data: Array.isArray(data) ? data : [],
          })
        );
      } catch (e) {
      } finally {
        if (isMounted) setIsLoadingPlaybooks(false);
      }
    };
    fetchPlaybooks();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPlaybooks = (() => {
    let filtered = playbooksData;

    if (playbookCategory !== "all") {
      filtered = filtered.filter(
        (playbook) =>
          playbook.category.toLowerCase() === playbookCategory.toLowerCase()
      );
    }

    if (playbookSearchQuery) {
      filtered = filtered.filter(
        (playbook) =>
          playbook.title
            .toLowerCase()
            .includes(playbookSearchQuery.toLowerCase()) ||
          playbook.description
            .toLowerCase()
            .includes(playbookSearchQuery.toLowerCase())
      );
    }

    return filtered;
  })();

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

        {/* Playbooks Content */}
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search playbooks by title or description..."
                value={playbookSearchQuery}
                onChange={(e) => setPlaybookSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Playbook Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={playbookCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlaybookCategory("all")}
            >
              All Playbooks
            </Button>
            {["Stocks", "Options", "Crypto", "Forex"].map((category) => (
              <Button
                key={category}
                variant={
                  playbookCategory === category.toLowerCase()
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setPlaybookCategory(category.toLowerCase())}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {isLoadingPlaybooks ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading playbooks...
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Playbooks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaybooks.map((playbook) => {
                  const IconComponent = resolveIcon(playbook.icon);
                  return (
                    <Card
                      key={playbook.id}
                      className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50 flex flex-col h-full"
                      onClick={() => setSelectedPlaybook(playbook)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getLevelColor(
                                playbook.level
                              )}`}
                            >
                              {playbook.level}
                            </Badge>
                            {playbook.completed && (
                              <Badge className="text-xs bg-green-500 hover:bg-green-600">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {playbook.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {playbook.title}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {playbook.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1 space-y-4">
                        {/* Steps Count */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="w-4 h-4" />
                          <span>{playbook.steps?.length || 0} Steps</span>
                        </div>

                        {/* Spacer to push button to bottom */}
                        <div className="flex-1" />

                        {/* Button always at bottom */}
                        <Button className="w-full mt-auto group-hover:shadow-md transition-shadow">
                          View Playbook
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredPlaybooks.length === 0 && (
                  <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground font-medium">
                      No playbooks found
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Playbook Details Modal */}
        <Dialog
          open={!!selectedPlaybook}
          onOpenChange={() => setSelectedPlaybook(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPlaybook &&
              (() => {
                const IconComponent = resolveIcon(selectedPlaybook.icon);
                return (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <IconComponent className="w-8 h-8 text-primary" />
                        <div className="flex-1">
                          <div className="text-2xl">
                            {selectedPlaybook.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getLevelColor(selectedPlaybook.level)}
                            >
                              {selectedPlaybook.level}
                            </Badge>
                            <Badge variant="outline">
                              {selectedPlaybook.category}
                            </Badge>
                            {selectedPlaybook.completed && (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DialogTitle>
                      <DialogDescription>
                        {selectedPlaybook.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Playbook Steps */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Strategy Steps
                        </h3>
                        <div className="space-y-4">
                          {selectedPlaybook.steps?.map(
                            (step: any, index: number) => (
                              <Card
                                key={step.step}
                                className="border-l-4 border-l-primary"
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                                      {step.step}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <h4 className="text-lg font-semibold">
                                        {step.title}
                                      </h4>
                                      <p className="text-muted-foreground">
                                        {step.description}
                                      </p>
                                      {step.details && (
                                        <div className="mt-3 p-4 bg-muted rounded-lg">
                                          <p className="text-sm text-muted-foreground">
                                            💡{" "}
                                            <span className="font-medium">
                                              Details:
                                            </span>{" "}
                                            {step.details}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t flex gap-4">
                        <Button
                          size="lg"
                          className="flex-1"
                          onClick={() => {
                            router.push(
                              `/education/playbooks/${selectedPlaybook.id}`
                            );
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Practice This Strategy
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => setSelectedPlaybook(null)}
                        >
                          Close
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
