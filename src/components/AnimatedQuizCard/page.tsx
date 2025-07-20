"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import quizzesData from "@/data/quizzes.json"
import { Users, Clock, Brain } from "lucide-react"
import { getDifficultyColor, formatDate } from "@/app/lib/utils"

export default function AnimatedQuizCard({ quiz }: { quiz: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="hover:shadow-xl transition-shadow bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg leading-tight text-white">{quiz.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-zinc-400">{quiz.description}</CardDescription>
            </div>
            {quiz.aiGenerated && (
              <Badge variant="outline" className="text-purple-400 border-purple-500">
                <Brain className="mr-1 h-3 w-3" />
                AI
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {quiz.questions.length} questions
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {quiz.estimatedTime}min
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" alt={quiz.creatorName} />
                <AvatarFallback className="text-xs bg-zinc-700 text-white">{quiz.creatorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-zinc-400">{quiz.creatorName}</span>
            </div>
            <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {quiz.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-zinc-800 text-white border-zinc-700">
                {tag}
              </Badge>
            ))}
            {quiz.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-zinc-800 text-white border-zinc-700">
                +{quiz.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-500">Created {formatDate(quiz.createdAt)}</span>
            <Button size="sm" asChild className="bg-gradient-to-br from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 text-white">
              <Link href={`/quiz/${quiz.id}`}>Start Quiz</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
