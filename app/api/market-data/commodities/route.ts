import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock commodities data - in production, integrate with commodity APIs
const mockCommoditiesData = {
  GOLD: {
    symbol: "GOLD",
    name: "Gold Spot",
    price: 2034.5,
    change: 16.25,
    changePercent: 0.81,
    unit: "USD/oz",
    high24h: 2042.8,
    low24h: 2018.3,
    volume24h: 0,
    lastUpdated: new Date().toISOString(),
  },
  SILVER: {
    symbol: "SILVER",
    name: "Silver Spot",
    price: 24.12,
    change: 0.28,
    changePercent: 1.17,
    unit: "USD/oz",
    high24h: 24.35,
    low24h: 23.84,
    volume24h: 0,
    lastUpdated: new Date().toISOString(),
  },
  OIL: {
    symbol: "OIL",
    name: "Crude Oil WTI",
    price: 78.45,
    change: -0.85,
    changePercent: -1.07,
    unit: "USD/barrel",
    high24h: 79.8,
    low24h: 78.1,
    volume24h: 0,
    lastUpdated: new Date().toISOString(),
  },
  COPPER: {
    symbol: "COPPER",
    name: "Copper",
    price: 3.82,
    change: 0.05,
    changePercent: 1.33,
    unit: "USD/lb",
    high24h: 3.85,
    low24h: 3.77,
    volume24h: 0,
    lastUpdated: new Date().toISOString(),
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get("symbols")?.split(",") || [];
    const plan = searchParams.get("plan") || "free";

    // Free users can't access commodities data
    if (plan === "free") {
      return NextResponse.json(
        { error: "Commodities data requires Pro or Elite plan" },
        { status: 403 }
      );
    }

    if (symbols.length === 0) {
      return NextResponse.json(
        { error: "No symbols provided" },
        { status: 400 }
      );
    }

    const data = symbols.map((symbol) => {
      const commodityData =
        mockCommoditiesData[
          symbol.toUpperCase() as keyof typeof mockCommoditiesData
        ];
      if (!commodityData) {
        return { symbol, error: "Symbol not found" };
      }
      return commodityData;
    });

    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Error fetching commodities data:", error);
    return NextResponse.json(
      { error: "Failed to fetch commodities data" },
      { status: 500 }
    );
  }
}
