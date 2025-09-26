import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/portfolio",
  "/screener",
  "/ai-coach",
  "/alerts",
  "/charts",
  "/liquidity",
  "/backtester",
  "/education",
  "/admin",
  "/profile",
];

// Define public routes that should redirect if authenticated
const authRoutes = ["/signin", "/signup"];

// Define public routes that don't require authentication
const publicRoutes = ["/subscription-success", "/pricing"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies (localStorage is not available in middleware)
  const token = request.cookies.get("access_token")?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth route (signin/signup)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if route is public (no auth required)
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If accessing protected route without token, redirect to signin
  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If accessing auth routes with token, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow public routes to pass through without auth checks
  if (isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
