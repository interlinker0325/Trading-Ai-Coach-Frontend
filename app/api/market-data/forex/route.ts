import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock forex data - in production, integrate with OANDA, FXCM, or Alpha Vantage
const mockForexData = {
  "EUR/USD": {
    pair: "EUR/USD",
    name: "Euro / US Dollar",
    price: 1.0842,
    change: -0.0021,
    changePercent: -0.19,
    bid: 1.0841,
    ask: 1.0843,
    high24h: 1.0865,
    low24h: 1.0835,
    volume24h: 0, // Forex doesn't have traditional volume
    lastUpdated: new Date().toISOString(),
  },
  "GBP/USD": {
    pair: "GBP/USD",
    name: "British Pound / US Dollar",
    price: 1.2654,
    change: 0.0012,
    changePercent: 0.09,
    bid: 1.2653,
    ask: 1.2655,
    high24h: 1.2678,
    low24h: 1.2642,
    volume24h: 0,
    lastUpdated: new Date().toISOString(),
  },
  "USD/JPY": {
    pair: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    price: 149.82,
    change: 0.58,
    changePercent: 0.39,
    bid: 149.81,
    ask: 149.83,
    high24h: 150.15,
    low24h: 149.24,
    volume24h: 0,
    lastUpdated: new Date().toISOString(),
  },
  "USD/CHF": {
    pair: "USD/CHF",
    name: "US Dollar / Swiss Franc",
    price: 0.8756,
    change: 0.0034,
    changePercent: 0.39,
    bid: 0.8755,
    ask: 0.8757,
    high24h: 0.8782,
    low24h: 0.8722,
    volume24h: 0,
    lastUpdated: new Date().toISOString(),
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pairs = searchParams.get("pairs")?.split(",") || [];
    const plan = searchParams.get("plan") || "free";

    // Free users can't access forex data
    if (plan === "free") {
      return NextResponse.json(
        { error: "Forex data requires Pro or Elite plan" },
        { status: 403 }
      );
    }

    if (pairs.length === 0) {
      return NextResponse.json({ error: "No pairs provided" }, { status: 400 });
    }

    const data = pairs.map((pair) => {
      const forexData =
        mockForexData[pair.toUpperCase() as keyof typeof mockForexData];
      if (!forexData) {
        return { pair, error: "Pair not found" };
      }
      return forexData;
    });

    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Error fetching forex data:", error);
    return NextResponse.json(
      { error: "Failed to fetch forex data" },
      { status: 500 }
    );
  }
}
