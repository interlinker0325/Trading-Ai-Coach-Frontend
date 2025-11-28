"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EducationNavigation() {
  const pathname = usePathname();

  const tabs = [
    { value: "courses", label: "Courses", href: "/education/courses" },
    { value: "playbooks", label: "Playbooks", href: "/education/playbooks" },
    { value: "quizzes", label: "Quizzes", href: "/education/quizzes" },
  ];

  const getActiveTab = () => {
    if (pathname === "/education/courses" || pathname === "/education")
      return "courses";
    if (pathname === "/education/playbooks") return "playbooks";
    if (pathname === "/education/quizzes") return "quizzes";
    return null;
  };

  const activeTab = getActiveTab();

  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <div className="inline-flex w-full md:grid md:w-full md:grid-cols-3 h-auto min-w-max md:min-w-0 gap-2 p-1 bg-muted rounded-lg">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.href}
              className="flex-1 md:flex-none"
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "whitespace-nowrap text-xs sm:text-sm w-full",
                  isActive && "shadow-sm"
                )}
              >
                {tab.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
