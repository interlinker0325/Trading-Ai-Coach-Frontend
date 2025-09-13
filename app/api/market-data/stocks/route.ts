import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock stock data - in production, integrate with real APIs like Alpha Vantage, IEX Cloud, or Polygon
const mockStockData = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 185.42,
    change: 2.15,
    changePercent: 1.17,
    volume: 45234567,
    marketCap: 2890000000000,
    pe: 28.5,
    high52w: 199.62,
    low52w: 164.08,
    sector: "Technology",
    lastUpdated: new Date().toISOString(),
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 238.15,
    change: -7.42,
    changePercent: -3.02,
    volume: 89234567,
    marketCap: 756000000000,
    pe: 65.2,
    high52w: 299.29,
    low52w: 138.8,
    sector: "Consumer Discretionary",
    lastUpdated: new Date().toISOString(),
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 445.2,
    change: 12.85,
    changePercent: 2.97,
    volume: 34567890,
    marketCap: 1100000000000,
    pe: 72.8,
    high52w: 502.66,
    low52w: 180.96,
    sector: "Technology",
    lastUpdated: new Date().toISOString(),
  },
  SPY: {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 445.2,
    change: 5.32,
    changePercent: 1.21,
    volume: 67890123,
    marketCap: 0,
    pe: 0,
    high52w: 459.44,
    low52w: 362.23,
    sector: "ETF",
    lastUpdated: new Date().toISOString(),
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get("symbols")?.split(",") || [];
    const plan = searchParams.get("plan") || "free";

    if (symbols.length === 0) {
      return NextResponse.json(
        { error: "No symbols provided" },
        { status: 400 }
      );
    }

    const data = symbols.map((symbol) => {
      const stockData =
        mockStockData[symbol.toUpperCase() as keyof typeof mockStockData];
      if (!stockData) {
        return { symbol, error: "Symbol not found" };
      }

      // Add delay for free users
      if (plan === "free") {
        const delayedTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes delay
        return {
          ...stockData,
          lastUpdated: delayedTime.toISOString(),
          delayed: true,
        };
      }

      return stockData;
    });

    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
