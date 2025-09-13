"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Bell, Plus, Trash2, Settings, Lock, TrendingUp, DollarSign, Zap, BarChart3 } from "lucide-react"

interface AlertSettingsProps {
  plan: "free" | "pro" | "elite"
}

interface AlertRule {
  id: string
  name: string
  assetType: "stocks" | "crypto" | "forex" | "commodities" | "options"
  symbol: string
  condition: string
  value: string
  enabled: boolean
  premium: boolean
  description?: string
}

export function AlertSettings({ plan }: AlertSettingsProps) {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "1",
      name: "AAPL Price Alert",
      assetType: "stocks",
      symbol: "AAPL",
      condition: "price_above",
      value: "190",
      enabled: true,
      premium: false,
      description: "Alert when AAPL price goes above $190",
    },
    {
      id: "2",
      name: "BTC Whale Alert",
      assetType: "crypto",
      symbol: "BTC",
      condition: "whale_inflow",
      value: "1000",
      enabled: true,
      premium: true,
      description: "Alert when whale moves >1000 BTC to exchanges",
    },
    {
      id: "3",
      name: "EUR/USD Volatility",
      assetType: "forex",
      symbol: "EUR/USD",
      condition: "daily_volatility",
      value: "2",
      enabled: false,
      premium: true,
      description: "Alert when daily volatility exceeds 2%",
    },
    {
      id: "4",
      name: "TSLA Covered Call Yield",
      assetType: "options",
      symbol: "TSLA",
      condition: "cc_yield",
      value: "5",
      enabled: true,
      premium: true,
      description: "Alert when TSLA covered call yield >5%",
    },
    {
      id: "5",
      name: "Oil Inventory Report",
      assetType: "commodities",
      symbol: "CL",
      condition: "inventory_surprise",
      value: "5",
      enabled: true,
      premium: true,
      description: "Alert on oil inventory surprises >5M barrels",
    },
  ])

  const [newAlert, setNewAlert] = useState({
    name: "",
    assetType: "stocks" as const,
    symbol: "",
    condition: "price_above",
    value: "",
  })

  const [globalSettings, setGlobalSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    telegramBot: false,
    soundAlerts: true,
    discordWebhook: false,
    slackIntegration: false,
  })

  const { toast } = useToast()

  const conditionOptions = {
    stocks: [
      { value: "price_above", label: "Price Above", description: "Alert when price crosses above threshold" },
      { value: "price_below", label: "Price Below", description: "Alert when price crosses below threshold" },
      { value: "volume_spike", label: "Volume Spike", description: "Alert on unusual volume (% above average)" },
      { value: "insider_buy", label: "Insider Buy", description: "Alert on insider purchase activity" },
      { value: "insider_sell", label: "Insider Sell", description: "Alert on insider selling activity" },
      { value: "unusual_options", label: "Unusual Options Activity", description: "Alert on high options volume" },
      { value: "analyst_upgrade", label: "Analyst Upgrade", description: "Alert on analyst rating upgrades" },
      { value: "analyst_downgrade", label: "Analyst Downgrade", description: "Alert on analyst rating downgrades" },
      { value: "earnings_beat", label: "Earnings Beat", description: "Alert when earnings beat estimates" },
      { value: "earnings_miss", label: "Earnings Miss", description: "Alert when earnings miss estimates" },
      { value: "dividend_increase", label: "Dividend Increase", description: "Alert on dividend increases" },
      {
        value: "short_squeeze",
        label: "Short Squeeze Signal",
        description: "Alert on potential short squeeze conditions",
      },
    ],
    options: [
      {
        value: "cc_yield",
        label: "Covered Call Yield >",
        description: "Alert when covered call yield exceeds threshold",
      },
      { value: "csp_yield", label: "Cash-Secured Put Yield >", description: "Alert when CSP yield exceeds threshold" },
      { value: "iv_spike", label: "Implied Volatility Spike", description: "Alert on IV increases" },
      { value: "iv_crush", label: "Implied Volatility Crush", description: "Alert on IV decreases" },
      { value: "gamma_squeeze", label: "Gamma Squeeze Signal", description: "Alert on high gamma exposure" },
      { value: "unusual_flow", label: "Unusual Options Flow", description: "Alert on large options trades" },
      { value: "dark_pool", label: "Dark Pool Activity", description: "Alert on significant dark pool prints" },
      { value: "max_pain", label: "Max Pain Deviation", description: "Alert when price deviates from max pain" },
    ],
    crypto: [
      { value: "price_above", label: "Price Above", description: "Alert when price crosses above threshold" },
      { value: "price_below", label: "Price Below", description: "Alert when price crosses below threshold" },
      { value: "whale_inflow", label: "Whale Exchange Inflow", description: "Alert on large exchange deposits" },
      { value: "whale_outflow", label: "Whale Exchange Outflow", description: "Alert on large exchange withdrawals" },
      {
        value: "whale_transaction",
        label: "Large Whale Transaction",
        description: "Alert on large on-chain transfers",
      },
      {
        value: "exchange_reserves",
        label: "Exchange Reserve Change",
        description: "Alert on significant reserve changes",
      },
      { value: "funding_rate", label: "Funding Rate Extreme", description: "Alert on extreme funding rates" },
      { value: "liquidations", label: "Mass Liquidations", description: "Alert on large liquidation events" },
      {
        value: "social_sentiment",
        label: "Social Sentiment Spike",
        description: "Alert on social media sentiment changes",
      },
      { value: "defi_tvl", label: "DeFi TVL Change", description: "Alert on total value locked changes" },
      { value: "stablecoin_flow", label: "Stablecoin Flow", description: "Alert on large stablecoin movements" },
    ],
    forex: [
      { value: "price_above", label: "Price Above", description: "Alert when price crosses above threshold" },
      { value: "price_below", label: "Price Below", description: "Alert when price crosses below threshold" },
      {
        value: "daily_volatility",
        label: "Daily Volatility >",
        description: "Alert when daily volatility exceeds threshold",
      },
      { value: "central_bank_event", label: "Central Bank Event", description: "Alert on central bank announcements" },
      { value: "interest_rate_change", label: "Interest Rate Change", description: "Alert on rate decisions" },
      { value: "economic_data", label: "Economic Data Release", description: "Alert on key economic indicators" },
      { value: "carry_trade_signal", label: "Carry Trade Signal", description: "Alert on carry trade opportunities" },
      { value: "correlation_break", label: "Correlation Breakdown", description: "Alert when correlations break down" },
      {
        value: "intervention_risk",
        label: "Intervention Risk",
        description: "Alert on potential central bank intervention",
      },
      { value: "session_breakout", label: "Session Breakout", description: "Alert on trading session breakouts" },
    ],
    commodities: [
      { value: "price_above", label: "Price Above", description: "Alert when price crosses above threshold" },
      { value: "price_below", label: "Price Below", description: "Alert when price crosses below threshold" },
      { value: "inventory_report", label: "Inventory Report", description: "Alert on weekly inventory data" },
      {
        value: "inventory_surprise",
        label: "Inventory Surprise",
        description: "Alert on unexpected inventory changes",
      },
      { value: "opec_meeting", label: "OPEC+ Meeting", description: "Alert on OPEC+ decisions" },
      { value: "seasonal_pattern", label: "Seasonal Pattern", description: "Alert on seasonal trading opportunities" },
      { value: "weather_event", label: "Weather Event", description: "Alert on weather affecting supply" },
      { value: "geopolitical_risk", label: "Geopolitical Risk", description: "Alert on geopolitical events" },
      { value: "production_cut", label: "Production Cut", description: "Alert on production announcements" },
      { value: "demand_spike", label: "Demand Spike", description: "Alert on unusual demand patterns" },
      {
        value: "contango_backwardation",
        label: "Curve Structure Change",
        description: "Alert on contango/backwardation shifts",
      },
    ],
  }

  const addAlert = () => {
    if (!newAlert.name || !newAlert.symbol || !newAlert.value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const isPremium =
      newAlert.assetType !== "stocks" ||
      ["insider_buy", "insider_sell", "unusual_options", "short_squeeze"].includes(newAlert.condition)

    if (plan === "free" && isPremium) {
      toast({
        title: "Premium Feature",
        description: "This alert type requires a Pro subscription",
        variant: "destructive",
      })
      return
    }

    const selectedCondition = conditionOptions[newAlert.assetType].find((c) => c.value === newAlert.condition)

    const alert: AlertRule = {
      id: Date.now().toString(),
      ...newAlert,
      enabled: true,
      premium: isPremium,
      description: selectedCondition?.description || "",
    }

    setAlertRules((prev) => [...prev, alert])
    setNewAlert({
      name: "",
      assetType: "stocks",
      symbol: "",
      condition: "price_above",
      value: "",
    })

    toast({
      title: "Alert Created",
      description: `Alert for ${alert.symbol} has been created`,
    })
  }

  const toggleAlert = (id: string) => {
    setAlertRules((prev) => prev.map((alert) => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)))
  }

  const deleteAlert = (id: string) => {
    setAlertRules((prev) => prev.filter((alert) => alert.id !== id))
    toast({
      title: "Alert Deleted",
      description: "Alert has been removed",
    })
  }

  const saveGlobalSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated",
    })
  }

  const displayAlerts = plan === "free" ? alertRules.filter((alert) => !alert.premium) : alertRules

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case "stocks":
        return <TrendingUp className="w-4 h-4" />
      case "options":
        return <TrendingUp className="w-4 h-4" />
      case "crypto":
        return <DollarSign className="w-4 h-4" />
      case "forex":
        return <Zap className="w-4 h-4" />
      case "commodities":
        return <BarChart3 className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const alertsByAssetType = displayAlerts.reduce(
    (acc, alert) => {
      if (!acc[alert.assetType]) acc[alert.assetType] = []
      acc[alert.assetType].push(alert)
      return acc
    },
    {} as Record<string, AlertRule[]>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Global Alert Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch
                checked={globalSettings.emailNotifications}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch
                checked={globalSettings.pushNotifications}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, pushNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Telegram Bot</Label>
                <p className="text-sm text-muted-foreground">Telegram notifications</p>
              </div>
              <Switch
                checked={globalSettings.telegramBot}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, telegramBot: checked }))}
                disabled={plan === "free"}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">Audio notifications</p>
              </div>
              <Switch
                checked={globalSettings.soundAlerts}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, soundAlerts: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Discord Webhook</Label>
                <p className="text-sm text-muted-foreground">Discord channel notifications</p>
              </div>
              <Switch
                checked={globalSettings.discordWebhook}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, discordWebhook: checked }))}
                disabled={plan === "free"}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Slack Integration</Label>
                <p className="text-sm text-muted-foreground">Slack workspace notifications</p>
              </div>
              <Switch
                checked={globalSettings.slackIntegration}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, slackIntegration: checked }))}
                disabled={plan !== "elite"}
              />
            </div>
          </div>

          <Button onClick={saveGlobalSettings}>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alertName">Alert Name</Label>
              <Input
                id="alertName"
                placeholder="My Alert"
                value={newAlert.name}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
              <Select
                value={newAlert.assetType}
                onValueChange={(value: any) =>
                  setNewAlert((prev) => ({ ...prev, assetType: value, condition: conditionOptions[value][0].value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="options" disabled={plan === "free"}>
                    Options
                  </SelectItem>
                  <SelectItem value="crypto" disabled={plan === "free"}>
                    Crypto
                  </SelectItem>
                  <SelectItem value="forex" disabled={plan === "free"}>
                    Forex
                  </SelectItem>
                  <SelectItem value="commodities" disabled={plan === "free"}>
                    Commodities
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="AAPL, BTC, EUR/USD, Gold"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={newAlert.condition}
                onValueChange={(value) => setNewAlert((prev) => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions[newAlert.assetType].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                placeholder="190, 1000, 2%"
                value={newAlert.value}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, value: e.target.value }))}
              />
            </div>
          </div>

          {newAlert.condition && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {conditionOptions[newAlert.assetType].find((c) => c.value === newAlert.condition)?.description}
              </p>
            </div>
          )}

          <Button onClick={addAlert} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Active Alerts</span>
            </div>
            <Badge variant="outline">{displayAlerts.filter((alert) => alert.enabled).length} Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="forex">Forex</TabsTrigger>
              <TabsTrigger value="commodities">Commodities</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {displayAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch checked={alert.enabled} onCheckedChange={() => toggleAlert(alert.id)} />
                    <div className="flex items-center space-x-2">{getAssetIcon(alert.assetType)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{alert.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {alert.symbol}
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {alert.assetType}
                        </Badge>
                        {alert.premium && (
                          <Badge variant="secondary" className="text-xs">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>

            {Object.entries(alertsByAssetType).map(([assetType, alerts]) => (
              <TabsContent key={assetType} value={assetType} className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Switch checked={alert.enabled} onCheckedChange={() => toggleAlert(alert.id)} />
                      <div className="flex items-center space-x-2">{getAssetIcon(alert.assetType)}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{alert.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.symbol}
                          </Badge>
                          {alert.premium && (
                            <Badge variant="secondary" className="text-xs">
                              Pro
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>

          {plan === "free" && alertRules.filter((alert) => alert.premium).length > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Premium Alerts Available</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to Pro for advanced alerts including insider trades, whale transactions, options flow, forex
                volatility, and commodity events.
              </p>
              <Button size="sm">Upgrade to Pro</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
