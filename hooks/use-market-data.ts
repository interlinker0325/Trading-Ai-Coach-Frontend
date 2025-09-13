"use client"

import { useState, useEffect, useCallback } from "react"

interface MarketDataHook {
  data: any[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMarketData(
  type: "stocks" | "crypto" | "forex" | "commodities",
  symbols: string[],
  plan: "free" | "pro" | "elite",
  refreshInterval = 30000, // 30 seconds
): MarketDataHook {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (symbols.length === 0) {
      setData([])
      setLoading(false)
      return
    }

    try {
      setError(null)
      const symbolParam = type === "forex" ? "pairs" : "symbols"
      const symbolsQuery = symbols.join(",")

      const response = await fetch(`/api/market-data/${type}?${symbolParam}=${symbolsQuery}&plan=${plan}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch market data")
      }

      setData(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [type, symbols, plan])

  useEffect(() => {
    fetchData()

    // Set up polling for real-time updates (only for Pro/Elite users)
    if (plan !== "free") {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, plan, refreshInterval])

  const refetch = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

export function useScreener(
  type: "stocks" | "crypto" | "forex",
  plan: "free" | "pro" | "elite",
  filters: Record<string, any> = {},
): MarketDataHook {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const params = new URLSearchParams({
        type,
        plan,
        ...filters,
      })

      const response = await fetch(`/api/market-data/screener?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch screener data")
      }

      setData(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [type, plan, filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}
