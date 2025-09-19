"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Pages where header and footer should be hidden
  const hideHeaderFooter = ["/signin", "/signup"];

  const shouldHideHeaderFooter = hideHeaderFooter.includes(pathname);

  if (shouldHideHeaderFooter) {
    // Return only the children without header and footer
    return <>{children}</>;
  }

  // Return normal layout with header and footer
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
