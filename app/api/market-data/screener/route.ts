import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock screener data - in production, implement complex filtering logic
const mockScreenerResults = {
  stocks: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 185.42,
      change: 2.15,
      changePercent: 1.17,
      volume: 45234567,
      marketCap: 2890000000000,
      pe: 28.5,
      sector: "Technology",
      score: 8.5,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 378.85,
      change: 4.23,
      changePercent: 1.13,
      volume: 23456789,
      marketCap: 2810000000000,
      pe: 32.1,
      sector: "Technology",
      score: 8.2,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.56,
      change: 1.85,
      changePercent: 1.31,
      volume: 34567890,
      marketCap: 1780000000000,
      pe: 25.8,
      sector: "Technology",
      score: 7.9,
    },
  ],
  crypto: [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 67420.5,
      change: 2140.25,
      changePercent: 3.28,
      marketCap: 1320000000000,
      volume24h: 28500000000,
      score: 9.1,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 3240.75,
      change: 89.25,
      changePercent: 2.83,
      marketCap: 389000000000,
      volume24h: 15200000000,
      score: 8.7,
    },
  ],
  forex: [
    {
      pair: "EUR/USD",
      name: "Euro / US Dollar",
      price: 1.0842,
      change: -0.0021,
      changePercent: -0.19,
      volatility: 0.65,
      score: 7.3,
    },
    {
      pair: "GBP/USD",
      name: "British Pound / US Dollar",
      price: 1.2654,
      change: 0.0012,
      changePercent: 0.09,
      volatility: 0.78,
      score: 6.9,
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "stocks";
    const plan = searchParams.get("plan") || "free";
    const sortBy = searchParams.get("sortBy") || "score";
    const minScore = Number.parseFloat(searchParams.get("minScore") || "0");
    const maxPE = Number.parseFloat(searchParams.get("maxPE") || "100");

    // Free users can only access basic stock screener
    if (plan === "free" && type !== "stocks") {
      return NextResponse.json(
        { error: `${type} screener requires Pro or Elite plan` },
        { status: 403 }
      );
    }

    let results: any[] =
      mockScreenerResults[type as keyof typeof mockScreenerResults] || [];

    // Apply filters
    if (type === "stocks") {
      results = results.filter((stock: any) => {
        return stock.score >= minScore && (stock.pe || 0) <= maxPE;
      });
    } else {
      results = results.filter((item: any) => item.score >= minScore);
    }

    // Sort results
    results.sort((a: any, b: any) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "change") return b.changePercent - a.changePercent;
      if (sortBy === "volume")
        return (b.volume || b.volume24h || 0) - (a.volume || a.volume24h || 0);
      return 0;
    });

    // Limit results for free users
    if (plan === "free") {
      results = results.slice(0, 5);
    }

    return NextResponse.json({
      data: results,
      type,
      filters: { sortBy, minScore, maxPE },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error running screener:", error);
    return NextResponse.json(
      { error: "Failed to run screener" },
      { status: 500 }
    );
  }
}
