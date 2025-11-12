"use client";

import { EducationNavigation } from "@/components/education-navigation";
import { Backtester } from "@/components/backtester";

export default function SimulatorPage() {
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
        </div>

        {/* Navigation */}
        <EducationNavigation />

        {/* Backtester Component - Contains all required features */}
        <Backtester />
      </div>
    </div>
  );
}
