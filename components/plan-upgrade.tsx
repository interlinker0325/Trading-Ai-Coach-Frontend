import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, X } from "lucide-react"
import Link from "next/link"

export function PlanUpgrade() {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Unlock Real-Time Data & Unlimited AI Queries</h3>
            <p className="text-sm text-muted-foreground">
              Upgrade to Pro for advanced screeners, portfolio analysis, and instant alerts
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/plans">
            <Button>Upgrade Now</Button>
          </Link>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
