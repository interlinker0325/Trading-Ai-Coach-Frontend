import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Twitter,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export function SiteFooter() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "AI Coach", href: "#ai-coach" },
      { name: "Analytics", href: "#analytics" },
      { name: "Pricing", href: "/plans" },
      { name: "API", href: "/api" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Partners", href: "/partners" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
      { name: "Changelog", href: "/changelog" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
      { name: "Compliance", href: "/compliance" },
      { name: "Cookies", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "GitHub", href: "#", icon: Github },
    { name: "LinkedIn", href: "#", icon: Linkedin },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold">Furu</span>
              <Badge variant="secondary" className="text-xs">
                AI
              </Badge>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Your AI-powered financial coach for smarter trading across all
              markets. Join thousands of traders making data-driven decisions.
            </p>
            <div className="flex space-x-2 sm:space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  asChild
                >
                  <Link href={social.href}>
                    <social.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold">Product</h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold">Company</h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold">Resources</h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold">Legal</h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-start sm:items-center">
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-semibold">
                Stay updated
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get the latest market insights and product updates delivered to
                your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1 text-sm bg-background border-muted-foreground/20 focus:border-primary focus:ring-primary/20"
              />
              <Button className="w-full sm:w-auto">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
            <span>© 2024 Furu AI. All rights reserved.</span>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>San Francisco, CA</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>24/7 Support</span>
            </div>
            <Badge variant="outline" className="text-xs">
              SOC 2 Compliant
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
