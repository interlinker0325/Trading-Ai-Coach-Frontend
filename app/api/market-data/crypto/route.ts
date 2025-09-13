import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock crypto data - in production, integrate with CoinGecko, CoinMarketCap, or Binance API
const mockCryptoData = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    price: 67420.5,
    change: 2140.25,
    changePercent: 3.28,
    volume24h: 28500000000,
    marketCap: 1320000000000,
    circulatingSupply: 19580000,
    totalSupply: 21000000,
    high24h: 68200.0,
    low24h: 65100.0,
    lastUpdated: new Date().toISOString(),
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    price: 3240.75,
    change: 89.25,
    changePercent: 2.83,
    volume24h: 15200000000,
    marketCap: 389000000000,
    circulatingSupply: 120280000,
    totalSupply: 120280000,
    high24h: 3285.5,
    low24h: 3180.2,
    lastUpdated: new Date().toISOString(),
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    price: 142.35,
    change: 6.92,
    changePercent: 5.11,
    volume24h: 2800000000,
    marketCap: 63500000000,
    circulatingSupply: 446000000,
    totalSupply: 580000000,
    high24h: 145.8,
    low24h: 135.2,
    lastUpdated: new Date().toISOString(),
  },
  ADA: {
    symbol: "ADA",
    name: "Cardano",
    price: 0.485,
    change: 0.023,
    changePercent: 4.98,
    volume24h: 890000000,
    marketCap: 17200000000,
    circulatingSupply: 35450000000,
    totalSupply: 45000000000,
    high24h: 0.492,
    low24h: 0.461,
    lastUpdated: new Date().toISOString(),
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get("symbols")?.split(",") || [];
    const plan = searchParams.get("plan") || "free";

    // Free users can't access crypto data
    if (plan === "free") {
      return NextResponse.json(
        { error: "Crypto data requires Pro or Elite plan" },
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
      const cryptoData =
        mockCryptoData[symbol.toUpperCase() as keyof typeof mockCryptoData];
      if (!cryptoData) {
        return { symbol, error: "Symbol not found" };
      }
      return cryptoData;
    });

    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return NextResponse.json(
      { error: "Failed to fetch crypto data" },
      { status: 500 }
    );
  }
}
