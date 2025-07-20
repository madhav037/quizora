import { Trophy, Medal, Crown, Star, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock leaderboard data
const globalLeaderboard = [
  {
    rank: 1,
    name: "Alice Johnson",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    totalScore: 2450,
    totalQuizzes: 32,
    averageScore: 89.2,
    badges: [
      { id: "1", title: "Quiz Master", icon: "crown", color: "gold", rarity: "epic" },
      { id: "2", title: "Perfect Score", icon: "target", color: "red", rarity: "rare" }
    ]
  },
  {
    rank: 2,
    name: "Bob Smith",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    totalScore: 2380,
    totalQuizzes: 28,
    averageScore: 85.7,
    badges: [
      { id: "3", title: "Speed Demon", icon: "zap", color: "yellow", rarity: "rare" }
    ]
  },
  {
    rank: 3,
    name: "Carol Davis",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    totalScore: 2290,
    totalQuizzes: 25,
    averageScore: 91.6,
    badges: [
      { id: "4", title: "AI Enthusiast", icon: "brain", color: "purple", rarity: "epic" }
    ]
  },
  {
    rank: 4,
    name: "David Wilson",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    totalScore: 2150,
    totalQuizzes: 30,
    averageScore: 71.7,
    badges: [
      { id: "5", title: "First Steps", icon: "star", color: "green", rarity: "common" }
    ]
  },
  {
    rank: 5,
    name: "Emma Thompson",
    avatar: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    totalScore: 2050,
    totalQuizzes: 22,
    averageScore: 93.2,
    badges: [
      { id: "6", title: "Perfect Score", icon: "target", color: "red", rarity: "rare" }
    ]
  }
]

const weeklyLeaderboard = [
  {
    rank: 1,
    name: "Emma Thompson",
    avatar: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    weeklyScore: 450,
    quizzesThisWeek: 8,
    change: "+2"
  },
  {
    rank: 2,
    name: "Alice Johnson",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    weeklyScore: 420,
    quizzesThisWeek: 6,
    change: "-1"
  },
  {
    rank: 3,
    name: "Bob Smith",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    weeklyScore: 380,
    quizzesThisWeek: 7,
    change: "+1"
  }
]

const categoryLeaders = [
  { category: "Programming", leader: "Alice Johnson", score: 950 },
  { category: "Science", leader: "Carol Davis", score: 890 },
  { category: "History", leader: "Bob Smith", score: 820 },
  { category: "Mathematics", leader: "Emma Thompson", score: 780 }
]

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />
    default:
      return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'common': return 'bg-gray-100 text-gray-600'
    case 'rare': return 'bg-blue-100 text-blue-600'
    case 'epic': return 'bg-purple-100 text-purple-600'
    case 'legendary': return 'bg-yellow-100 text-yellow-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Trophy className="mr-3 h-8 w-8 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">See how you rank against other quiz participants</p>
        </div>
        <Button asChild>
          <Link href="/join">
            <Users className="mr-2 h-4 w-4" />
            Join Quiz
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global Rankings</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,432</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Global Rankings</CardTitle>
              <CardDescription>
                Top performers across all quizzes and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {globalLeaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(entry.rank)}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar} alt={entry.name} />
                        <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.totalQuizzes} quizzes • {entry.averageScore}% avg
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-wrap gap-1">
                        {entry.badges.slice(0, 2).map((badge) => (
                          <Badge key={badge.id} variant="outline" className={getRarityColor(badge.rarity)}>
                            {badge.title}
                          </Badge>
                        ))}
                        {entry.badges.length > 2 && (
                          <Badge variant="outline">+{entry.badges.length - 2}</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{entry.totalScore.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Champions</CardTitle>
              <CardDescription>
                Top performers this week (Jan 22 - Jan 28, 2024)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyLeaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(entry.rank)}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar} alt={entry.name} />
                        <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.quizzesThisWeek} quizzes this week
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge variant={entry.change.startsWith('+') ? 'default' : 'secondary'}>
                        {entry.change}
                      </Badge>
                      <div className="text-right">
                        <p className="font-bold text-lg">{entry.weeklyScore}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {categoryLeaders.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                  <CardDescription>Category leader</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{category.leader}</p>
                      <p className="text-sm text-muted-foreground">Current champion</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{category.score}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}