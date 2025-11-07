import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Play,
  Brain,
  BarChart3,
  Shield,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
  Clock,
  Award,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms analyze market patterns and provide personalized insights across all asset classes.",
    },
    {
      icon: BarChart3,
      title: "Multi-Asset Trading",
      description:
        "Trade stocks, options, ETFs, crypto, forex, and commodities all from one unified platform with real-time data.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption and SOC 2 compliance ensure your data and investments are always protected.",
    },
    {
      icon: Zap,
      title: "Real-Time Alerts",
      description:
        "Get instant notifications for market opportunities, portfolio changes, and AI-generated trading signals.",
    },
    {
      icon: Globe,
      title: "Global Markets",
      description:
        "Access markets worldwide with support for major exchanges and international trading hours.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Trade on the go with our responsive design and dedicated mobile apps for iOS and Android.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Portfolio Manager",
      company: "Hedge Fund Alpha",
      avatar: "/professional-avatar.png",
      content:
        "Furu's AI insights have transformed how I analyze market opportunities. The multi-asset approach is game-changing.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Day Trader",
      company: "Independent",
      avatar: "/placeholder-user.jpg",
      content:
        "The real-time alerts and AI coaching have improved my win rate by 40%. Best investment I've made.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Investment Advisor",
      company: "Wealth Management Co",
      avatar: "/placeholder-user.jpg",
      content:
        "My clients love the portfolio analytics. The AI explanations make complex strategies easy to understand.",
      rating: 5,
    },
  ];

  const stats = [
    { value: "$2.4T+", label: "Assets Analyzed" },
    { value: "99.9%", label: "Uptime" },
    { value: "50K+", label: "Active Traders" },
    { value: "24/7", label: "AI Support" },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background dark:from-black dark:via-gray-900/30 dark:to-black">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative py-12 sm:py-16 lg:py-24 xl:py-32 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered Trading
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-balance leading-tight">
                  Transform Your
                  <span className="text-primary block">Trading Experience</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground text-pretty leading-relaxed max-w-lg">
                  Master the markets with intelligent insights across stocks,
                  options, ETFs, crypto, forex, and commodities. Get
                  personalized guidance from your AI financial coach.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="animate-pulse-glow w-full sm:w-auto"
                  asChild
                >
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href="/pricing">
                    <Play className="mr-2 h-4 w-4" />
                    View Pricing
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-6 lg:p-8 animate-float">
                <div className="aspect-video rounded-lg flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/trading-dashboard.jpg"
                    alt="Furu Trading Dashboard"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative text-white text-center space-y-4 z-10">
                    <div className="h-16 w-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="h-8 w-8 ml-1" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">
                        See Furu in Action
                      </h3>
                      <p className="text-sm text-white/90">
                        Watch how AI transforms trading
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-secondary/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-primary/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 sm:py-16 lg:py-24 bg-muted/30 dark:bg-black relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-4 mb-12 sm:mb-16 max-w-4xl mx-auto">
            <Badge variant="outline">Features</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
              Everything you need to trade smarter
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Powerful tools and AI-driven insights designed for both beginners
              and professional traders.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 bg-background/60 backdrop-blur hover:bg-background/80 transition-colors"
              >
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Coach Section */}
      <section id="ai-coach" className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Coach
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
                  Your personal AI financial coach
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                  Get personalized guidance, market analysis, and trading
                  strategies tailored to your goals and risk tolerance.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[
                  "Natural language queries across all asset classes",
                  "Real-time market analysis and insights",
                  "Personalized trading strategies and risk management",
                  "24/7 availability with instant responses",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/ai-coach">
                  Try AI Coach
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="relative">
                <img
                  src="/ai-coach-interface.jpg"
                  alt="AI Coach Interface"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                <Card className="absolute bottom-4 left-4 right-4 p-4 bg-background/95 backdrop-blur-sm border-0 shadow-lg">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Brain className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="font-medium text-sm">AI Coach</span>
                      <Badge variant="secondary" className="text-xs">
                        Online
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-muted p-2 rounded-lg text-xs">
                        "Show me the best forex pairs to trade this week with
                        technical analysis"
                      </div>
                      <div className="bg-primary/10 p-2 rounded-lg text-xs">
                        Based on current market conditions, I recommend EUR/USD,
                        GBP/JPY, and USD/CAD. Here's the technical analysis for
                        each pair...
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12 sm:mb-16 max-w-4xl mx-auto">
            <Badge variant="outline">Testimonials</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
              Trusted by thousands of traders
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 bg-background/60 backdrop-blur"
              >
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 sm:h-4 sm:w-4 fill-secondary text-secondary"
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="space-y-1">
                      <div className="font-medium text-xs sm:text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground max-w-4xl mx-auto">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
                  Ready to transform your trading?
                </h2>
                <p className="text-base sm:text-lg opacity-90 text-pretty max-w-2xl mx-auto">
                  Join thousands of traders who are already using AI to make
                  smarter investment decisions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 bg-transparent"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm opacity-75">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
