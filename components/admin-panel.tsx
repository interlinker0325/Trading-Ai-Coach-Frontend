"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Users,
  CreditCard,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  MoreHorizontal,
  Ban,
  Mail,
  Download,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react"

// Mock data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    plan: "pro",
    status: "active",
    joinDate: "2023-01-15",
    lastActive: "2024-01-15",
    apiCalls: 15420,
    alerts: 23,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    plan: "elite",
    status: "active",
    joinDate: "2023-03-22",
    lastActive: "2024-01-14",
    apiCalls: 45230,
    alerts: 67,
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    plan: "free",
    status: "suspended",
    joinDate: "2023-06-10",
    lastActive: "2024-01-10",
    apiCalls: 2340,
    alerts: 5,
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice@example.com",
    plan: "pro",
    status: "active",
    joinDate: "2023-08-05",
    lastActive: "2024-01-15",
    apiCalls: 28750,
    alerts: 41,
  },
]

const subscriptions = [
  {
    id: "sub_1",
    userId: "1",
    userName: "John Doe",
    plan: "pro",
    status: "active",
    amount: 29.99,
    nextBilling: "2024-02-15",
    paymentMethod: "card_ending_4242",
  },
  {
    id: "sub_2",
    userId: "2",
    userName: "Jane Smith",
    plan: "elite",
    status: "active",
    amount: 99.99,
    nextBilling: "2024-02-22",
    paymentMethod: "card_ending_1234",
  },
  {
    id: "sub_3",
    userId: "4",
    userName: "Alice Johnson",
    plan: "pro",
    status: "past_due",
    amount: 29.99,
    nextBilling: "2024-01-05",
    paymentMethod: "card_ending_5678",
  },
]

const dataIngestionJobs = [
  {
    id: "job_1",
    name: "Stock Price Feed",
    type: "real-time",
    status: "running",
    lastRun: "2024-01-15 14:30:00",
    recordsProcessed: 1250000,
    errorRate: 0.02,
    avgLatency: 45,
  },
  {
    id: "job_2",
    name: "Crypto Market Data",
    type: "real-time",
    status: "running",
    lastRun: "2024-01-15 14:29:45",
    recordsProcessed: 890000,
    errorRate: 0.01,
    avgLatency: 32,
  },
  {
    id: "job_3",
    name: "Options Chain Data",
    type: "batch",
    status: "completed",
    lastRun: "2024-01-15 14:00:00",
    recordsProcessed: 450000,
    errorRate: 0.05,
    avgLatency: 120,
  },
  {
    id: "job_4",
    name: "Forex Rates",
    type: "real-time",
    status: "error",
    lastRun: "2024-01-15 14:25:00",
    recordsProcessed: 0,
    errorRate: 100,
    avgLatency: 0,
  },
]

const systemMetrics = {
  uptime: 99.97,
  totalUsers: 12450,
  activeUsers: 8920,
  apiCallsToday: 2450000,
  alertsSent: 15670,
  revenue: 145230,
  errorRate: 0.03,
  avgResponseTime: 85,
}

const apiUsageData = [
  { date: "Jan 1", calls: 1200000 },
  { date: "Jan 2", calls: 1350000 },
  { date: "Jan 3", calls: 1180000 },
  { date: "Jan 4", calls: 1420000 },
  { date: "Jan 5", calls: 1650000 },
  { date: "Jan 6", calls: 1580000 },
  { date: "Jan 7", calls: 1720000 },
]

const planDistribution = [
  { name: "Free", value: 7200, color: "#94a3b8" },
  { name: "Pro", value: 3800, color: "#3b82f6" },
  { name: "Elite", value: 1450, color: "#f59e0b" },
]

export function AdminPanel() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "past_due":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "pro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "elite":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, subscriptions, and system health</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{systemMetrics.uptime}%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{systemMetrics.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{systemMetrics.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{(systemMetrics.apiCallsToday / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">API Calls Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{systemMetrics.alertsSent.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Alerts Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">${systemMetrics.revenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{systemMetrics.errorRate}%</div>
            <div className="text-sm text-muted-foreground">Error Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{systemMetrics.avgResponseTime}ms</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="data-jobs">Data Jobs</TabsTrigger>
          <TabsTrigger value="api-usage">API Usage</TabsTrigger>
          <TabsTrigger value="system-health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Plan</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-right p-2">API Calls</th>
                      <th className="text-right p-2">Alerts</th>
                      <th className="text-left p-2">Last Active</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground text-xs">{user.email}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className={getPlanColor(user.plan)}>{user.plan.toUpperCase()}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </td>
                        <td className="p-2 text-right font-mono">{user.apiCalls.toLocaleString()}</td>
                        <td className="p-2 text-right">{user.alerts}</td>
                        <td className="p-2">{user.lastActive}</td>
                        <td className="p-2 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Ban className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* User Plan Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>User Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Plan</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-left p-2">Next Billing</th>
                      <th className="text-left p-2">Payment Method</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{sub.userName}</td>
                        <td className="p-2">
                          <Badge className={getPlanColor(sub.plan)}>{sub.plan.toUpperCase()}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(sub.status)}>{sub.status.replace("_", " ")}</Badge>
                        </td>
                        <td className="p-2 text-right font-mono">${sub.amount}</td>
                        <td className="p-2">{sub.nextBilling}</td>
                        <td className="p-2 text-muted-foreground">{sub.paymentMethod}</td>
                        <td className="p-2 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Ingestion Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Job Name</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Last Run</th>
                      <th className="text-right p-2">Records</th>
                      <th className="text-right p-2">Error Rate</th>
                      <th className="text-right p-2">Latency</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataIngestionJobs.map((job) => (
                      <tr key={job.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{job.name}</td>
                        <td className="p-2">
                          <Badge variant="outline">{job.type}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </td>
                        <td className="p-2 font-mono text-xs">{job.lastRun}</td>
                        <td className="p-2 text-right font-mono">{job.recordsProcessed.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          <span className={job.errorRate > 1 ? "text-red-600" : "text-green-600"}>
                            {job.errorRate}%
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono">{job.avgLatency}ms</td>
                        <td className="p-2 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm">
                              Restart
                            </Button>
                            <Button variant="ghost" size="sm">
                              Logs
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Job Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-muted-foreground">Running Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-muted-foreground">Failed Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">2.59M</div>
                <div className="text-sm text-muted-foreground">Records/Hour</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                API Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* API Endpoint Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { endpoint: "/api/stocks/price", calls: 850000, avgLatency: 45 },
                  { endpoint: "/api/crypto/market", calls: 620000, avgLatency: 32 },
                  { endpoint: "/api/alerts/create", calls: 340000, avgLatency: 78 },
                  { endpoint: "/api/portfolio/sync", calls: 280000, avgLatency: 120 },
                  { endpoint: "/api/options/chain", calls: 190000, avgLatency: 95 },
                ].map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-mono text-sm">{endpoint.endpoint}</div>
                      <div className="text-xs text-muted-foreground">
                        {endpoint.calls.toLocaleString()} calls • {endpoint.avgLatency}ms avg
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={(endpoint.calls / 850000) * 100} className="w-24 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>API Gateway</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Database</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>Cache Layer</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Forex Data Feed</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Error</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Disk Usage</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Network I/O</span>
                    <span>34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    type: "error",
                    message: "Forex data feed connection lost",
                    time: "2 minutes ago",
                    severity: "high",
                  },
                  {
                    type: "warning",
                    message: "Cache hit ratio below threshold (85%)",
                    time: "15 minutes ago",
                    severity: "medium",
                  },
                  {
                    type: "info",
                    message: "Database backup completed successfully",
                    time: "1 hour ago",
                    severity: "low",
                  },
                  {
                    type: "warning",
                    message: "High API usage detected for user john@example.com",
                    time: "2 hours ago",
                    severity: "medium",
                  },
                ].map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {alert.type === "error" && <XCircle className="w-4 h-4 text-red-500" />}
                      {alert.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {alert.type === "info" && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      <div>
                        <div className="text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground">{alert.time}</div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
