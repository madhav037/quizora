"use client"

import { useState } from "react"
import { Users, Play, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function JoinQuizPage() {
  const [quizCode, setQuizCode] = useState("")
  const [playerName, setPlayerName] = useState("")

  const handleJoin = () => {
    // In a real app, this would validate the code and redirect to the quiz session
    if (quizCode && playerName) {
      // Redirect to quiz session
      window.location.href = `/session/${quizCode}`
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Join Quiz</h1>
          <p className="text-muted-foreground">
            Enter the quiz code to join a live session
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Quiz Details</CardTitle>
            <CardDescription>
              Get the quiz code from your host to join the session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Quiz Code</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                  className="pl-10 text-center text-lg font-mono tracking-wider"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your display name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleJoin}
              disabled={!quizCode || !playerName || quizCode.length !== 6}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Join Quiz
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Don't have a quiz code?
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/quizzes">Browse Public Quizzes</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/create">Create Your Own Quiz</Link>
            </Button>
          </div>
        </div>

        {/* Demo codes for testing */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Demo Codes</CardTitle>
            <CardDescription className="text-xs">
              Try these codes for demonstration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuizCode("ABC123")}
                className="font-mono"
              >
                ABC123
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuizCode("XYZ789")}
                className="font-mono"
              >
                XYZ789
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}