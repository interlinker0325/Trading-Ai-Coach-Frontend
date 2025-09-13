import { PricingPlans } from "@/components/pricing-plans"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-balance">Choose Your Plan</h1>
          <p className="text-muted-foreground mt-2">Unlock the full power of AI-driven financial insights</p>
        </div>

        <PricingPlans />
      </div>
    </div>
  )
}
