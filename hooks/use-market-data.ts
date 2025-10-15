"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiClient } from "@/lib/api-client";

interface ScreenerHook {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useScreener(
  type: "stocks" | "crypto" | "forex" | "options" | "commodities",
  plan: "free" | "pro" | "elite",
  filters: Record<string, any> = {}
): ScreenerHook {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a stable string representation of filters for dependency comparison
  const filtersString = useMemo(() => {
    return JSON.stringify(filters);
  }, [filters]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      // Call backend directly using apiClient
      const response = await apiClient.get(
        `/api/v1/screener/${type}?${params.toString()}`
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.detail || "Failed to fetch screener data");
      }

      const result = await response.json();
      console.log("result", result);
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [type, plan, filtersString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
