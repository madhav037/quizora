import { Trophy, Users, Brain, TrendingUp, Plus, Play, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatsCard } from "@/components/dashboard/stats-card"
import Link from "next/link"
import { formatDate } from "@/app/lib/utils"

// Mock data - in real app this would come from props or API
const mockUser = {
  name: "Alice Johnson",
  role: "creator" as const,
  stats: {
    totalQuizzes: 15,
    totalParticipants: 1250,
    averageScore: 83.3,
    totalSessions: 45
  }
}

const recentQuizzes = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    participants: 45,
    averageScore: 78,
    createdAt: "2024-01-20T10:00:00Z",
    status: "active"
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    participants: 32,
    averageScore: 85,
    createdAt: "2024-01-18T14:30:00Z",
    status: "completed"
  },
  {
    id: "3",
    title: "TypeScript Best Practices",
    participants: 28,
    averageScore: 92,
    createdAt: "2024-01-15T09:15:00Z",
    status: "draft"
  }
]

const recentActivity = [
  {
    id: "1",
    type: "session_completed",
    description: "JavaScript Fundamentals session completed",
    timestamp: "2024-01-25T15:30:00Z",
    participants: 12
  },
  {
    id: "2",
    type: "quiz_created",
    description: "New quiz 'React Patterns' created",
    timestamp: "2024-01-25T10:00:00Z"
  },
  {
    id: "3",
    type: "high_score",
    description: "New high score achieved in TypeScript quiz",
    timestamp: "2024-01-24T16:45:00Z",
    score: 98
  }
]

export default function DashboardPage() {
  const isCreator = mockUser.role === 'creator'
  const isParticipant = mockUser.role === 'participant'
  const isAdmin = mockUser.role === 'admin'

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {mockUser.name}!
        </h2>
        <div className="flex items-center space-x-2">
          {isCreator && (
            <>
              <Button asChild>
                <Link href="/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Quiz
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/ai-generator">
                  <Brain className="mr-2 h-4 w-4" />
                  AI Generator
                </Link>
              </Button>
            </>
          )}
          {isParticipant && (
            <Button asChild>
              <Link href="/join">
                <Play className="mr-2 h-4 w-4" />
                Join Quiz
              </Link>
            </Button>
          )}
          {isAdmin && (
            <Button asChild>
              <Link href="/admin">
                <Eye className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isCreator && (
          <>
            <StatsCard
              title="Total Quizzes"
              value={mockUser.stats.totalQuizzes}
              description="Quizzes created"
              icon={Brain}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Total Participants"
              value={mockUser.stats.totalParticipants.toLocaleString()}
              description="Across all quizzes"
              icon={Users}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Average Score"
              value={`${mockUser.stats.averageScore}%`}
              description="Participant performance"
              icon={Trophy}
              trend={{ value: 3, isPositive: true }}
            />
            <StatsCard
              title="Total Sessions"
              value={mockUser.stats.totalSessions}
              description="Live sessions hosted"
              icon={TrendingUp}
              trend={{ value: 15, isPositive: true }}
            />
          </>
        )}
        
        {isParticipant && (
          <>
            <StatsCard
              title="Quizzes Taken"
              value={25}
              description="Total completed"
              icon={Brain}
              trend={{ value: 20, isPositive: true }}
            />
            <StatsCard
              title="Average Score"
              value="85%"
              description="Your performance"
              icon={Trophy}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Global Rank"
              value="#42"
              description="Out of 1,250 users"
              icon={TrendingUp}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Badges Earned"
              value={7}
              description="Achievement unlocked"
              icon={Trophy}
              trend={{ value: 2, isPositive: true }}
            />
          </>
        )}
        
        {isAdmin && (
          <>
            <StatsCard
              title="Total Users"
              value="1,250"
              description="Platform users"
              icon={Users}
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard
              title="Total Quizzes"
              value="450"
              description="Created by users"
              icon={Brain}
              trend={{ value: 22, isPositive: true }}
            />
            <StatsCard
              title="Active Sessions"
              value="23"
              description="Currently running"
              icon={Play}
            />
            <StatsCard
              title="Reports"
              value="3"
              description="Pending review"
              icon={Eye}
              trend={{ value: -2, isPositive: false }}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Quizzes / Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              {isCreator ? "Recent Quizzes" : "Recent Activity"}
            </CardTitle>
            <CardDescription>
              {isCreator 
                ? "Your latest quiz creations and their performance"
                : "Your recent quiz activity and achievements"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isCreator ? (
                recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{quiz.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {quiz.participants} participants • {quiz.averageScore}% avg score
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(quiz.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        quiz.status === 'active' ? 'default' :
                        quiz.status === 'completed' ? 'secondary' : 'outline'
                      }>
                        {quiz.status}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/quiz/${quiz.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    {activity.participants && (
                      <Badge variant="secondary">{activity.participants} participants</Badge>
                    )}
                    {activity.score && (
                      <Badge variant="default">{activity.score}% score</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCreator && (
              <>
                <Button className="w-full justify-start" asChild>
                  <Link href="/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Quiz
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/ai-generator">
                    <Brain className="mr-2 h-4 w-4" />
                    Generate with AI
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/quizzes">
                    <Eye className="mr-2 h-4 w-4" />
                    Manage Quizzes
                  </Link>
                </Button>
              </>
            )}
            
            {isParticipant && (
              <>
                <Button className="w-full justify-start" asChild>
                  <Link href="/join">
                    <Play className="mr-2 h-4 w-4" />
                    Join Quiz
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/leaderboard">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Leaderboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/badges">
                    <Trophy className="mr-2 h-4 w-4" />
                    My Badges
                  </Link>
                </Button>
              </>
            )}
            
            {isAdmin && (
              <>
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin">
                    <Eye className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/reports">
                    <Eye className="mr-2 h-4 w-4" />
                    Review Reports
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/analytics">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}