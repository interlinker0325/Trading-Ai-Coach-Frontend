import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Lock } from "lucide-react";
import Link from "next/link";

interface AIInsightsProps {
  plan: "free" | "pro" | "elite";
}

export function AIInsights({ plan }: AIInsightsProps) {
  const insights = [
    {
      type: "Market Alert",
      message:
        "NVDA showing strong momentum with 15% institutional buying increase",
      confidence: 87,
      timeAgo: "2 hours ago",
    },
    {
      type: "Portfolio Recommendation",
      message:
        "Consider reducing tech exposure by 5% and increasing defensive positions",
      confidence: 73,
      timeAgo: "4 hours ago",
    },
    {
      type: "Risk Warning",
      message: "High correlation detected between your top 3 holdings",
      confidence: 91,
      timeAgo: "6 hours ago",
    },
  ];

  const freeInsights = insights.slice(0, 1);
  const displayInsights = plan === "free" ? freeInsights : insights;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Insights</span>
            </CardTitle>
            <CardDescription>
              Personalized recommendations from your AI coach
            </CardDescription>
          </div>
          <Badge variant={plan === "free" ? "outline" : "default"}>
            {plan === "free" ? "1/5 Daily" : "Unlimited"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayInsights.map((insight, index) => (
          <div key={index} className="space-y-2 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {insight.type}
              </Badge>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {insight.confidence}% confidence
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {insight.timeAgo}
                </span>
              </div>
            </div>
            <p className="text-sm">{insight.message}</p>
          </div>
        ))}

        {plan === "free" && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-dashed">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                4 more insights available
              </span>
            </div>
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </div>
        )}

        <div className="flex space-x-2">
          <Link href="/ai-coach" className="flex-1">
            <Button className="w-full" disabled={plan === "free"}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI Coach
            </Button>
          </Link>
          {plan === "free" && (
            <Badge variant="outline" className="text-xs self-center">
              Pro Feature
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
