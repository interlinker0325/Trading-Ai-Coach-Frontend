"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface Alert {
  id: string
  type: string
  symbol: string
  message: string
  timestamp: Date
  severity: "low" | "medium" | "high"
}

interface UseAlertsOptions {
  plan: "free" | "pro" | "elite"
  enableRealTime?: boolean
}

export function useAlerts({ plan, enableRealTime = true }: UseAlertsOptions) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const addAlert = useCallback(
    (alert: Omit<Alert, "id" | "timestamp">) => {
      const newAlert: Alert = {
        ...alert,
        id: Date.now().toString(),
        timestamp: new Date(),
      }

      setAlerts((prev) => [newAlert, ...prev].slice(0, 50)) // Keep last 50 alerts

      // Show toast notification
      toast({
        title: `${alert.symbol} Alert`,
        description: alert.message,
        variant: alert.severity === "high" ? "destructive" : "default",
      })
    },
    [toast],
  )

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  // Simulate real-time alerts for Pro/Elite users
  useEffect(() => {
    if (!enableRealTime || plan === "free") return

    const interval = setInterval(() => {
      // Simulate random market events
      const symbols = ["AAPL", "TSLA", "BTC", "ETH", "EUR/USD", "Gold"]
      const types = ["price_alert", "volume_spike", "technical_signal", "news"]
      const severities: Array<"low" | "medium" | "high"> = ["low", "medium", "high"]

      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
      const randomType = types[Math.floor(Math.random() * types.length)]
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)]

      if (Math.random() > 0.7) {
        // 30% chance of alert
        addAlert({
          type: randomType,
          symbol: randomSymbol,
          message: `${randomType.replace("_", " ")} detected for ${randomSymbol}`,
          severity: randomSeverity,
        })
      }
    }, 15000) // Every 15 seconds

    return () => clearInterval(interval)
  }, [plan, enableRealTime, addAlert])

  useEffect(() => {
    setLoading(false)
  }, [])

  return {
    alerts,
    loading,
    addAlert,
    clearAlerts,
    removeAlert,
  }
}
