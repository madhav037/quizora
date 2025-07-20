import { Users, Brain, Play, AlertTriangle, TrendingUp, Eye, Settings, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatsCard } from "@/components/dashboard/stats-card"
import Link from "next/link"
import { formatDateTime } from "@/app/lib/utils"

// Mock admin data
const platformStats = {
  totalUsers: 1247,
  totalQuizzes: 456,
  activeSessions: 23,
  pendingReports: 3
}

const recentActivity = [
  {
    id: "1",
    type: "user_joined",
    description: "New user registration: john.doe@example.com",
    timestamp: "2024-01-25T15:30:00Z",
    userId: "user-123",
    userName: "John Doe"
  },
  {
    id: "2", 
    type: "quiz_created",
    description: "Quiz 'Advanced React Patterns' created",
    timestamp: "2024-01-25T14:15:00Z",
    userId: "user-456",
    userName: "Alice Johnson"
  },
  {
    id: "3",
    type: "session_completed",
    description: "Quiz session completed with 25 participants",
    timestamp: "2024-01-25T13:45:00Z",
    userId: "user-789",
    userName: "Bob Smith"
  }
]

const reportedQuizzes = [
  {
    id: "report-1",
    quizId: "quiz-123",
    quizTitle: "Inappropriate Content Quiz",
    reportedBy: "user-456",
    reporterName: "Alice Johnson",
    reason: "Contains inappropriate language",
    status: "pending" as const,
    reportedAt: "2024-01-25T10:00:00Z"
  },
  {
    id: "report-2",
    quizId: "quiz-456", 
    quizTitle: "Misleading Science Quiz",
    reportedBy: "user-789",
    reporterName: "Carol Davis",
    reason: "Contains factually incorrect information",
    status: "pending" as const,
    reportedAt: "2024-01-24T16:30:00Z"
  },
  {
    id: "report-3",
    quizId: "quiz-789",
    quizTitle: "Spam Quiz",
    reportedBy: "user-123",
    reporterName: "David Wilson",
    reason: "Spam content",
    status: "reviewed" as const,
    reportedAt: "2024-01-24T09:15:00Z"
  }
]

const topCategories = [
  { name: "Programming", count: 145, growth: 12 },
  { name: "Science", count: 98, growth: 8 },
  { name: "History", count: 76, growth: -2 },
  { name: "Mathematics", count: 67, growth: 15 }
]

function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'reviewed': return 'bg-blue-100 text-blue-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function AdminPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/reports">
              <Eye className="mr-2 h-4 w-4" />
              Review Reports
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={platformStats.totalUsers.toLocaleString()}
          description="Registered users"
          icon={Users}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Total Quizzes"
          value={platformStats.totalQuizzes}
          description="Created by users"
          icon={Brain}
          trend={{ value: 22, isPositive: true }}
        />
        <StatsCard
          title="Active Sessions"
          value={platformStats.activeSessions}
          description="Currently running"
          icon={Play}
        />
        <StatsCard
          title="Pending Reports"
          value={platformStats.pendingReports}
          description="Require review"
          icon={AlertTriangle}
          trend={{ value: -2, isPositive: false }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest platform activity and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          by {activity.userName} • {formatDateTime(activity.timestamp)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/reports">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Review Reports ({platformStats.pendingReports})
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/quizzes">
                    <Brain className="mr-2 h-4 w-4" />
                    Manage Quizzes
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/analytics">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Platform Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>
                Quizzes and content reported by users for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedQuizzes.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{report.quizTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        Reported by {report.reporterName} • {formatDateTime(report.reportedAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reason: {report.reason}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>
                  Most active quiz categories this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.count} quizzes
                        </p>
                      </div>
                      <Badge variant={category.growth > 0 ? 'default' : 'secondary'}>
                        {category.growth > 0 ? '+' : ''}{category.growth}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>
                  Key metrics and system status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Status</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Service</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage</span>
                  <Badge className="bg-yellow-100 text-yellow-800">78% Used</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}