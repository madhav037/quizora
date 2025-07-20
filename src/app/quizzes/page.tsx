"use client";
import { Search, Filter, Brain, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { formatDate, getDifficultyColor } from "../lib/utils";
import quizzesData from "@/data/quizzes.json";
import { use, useEffect, useState } from "react";

// Type definition for quiz from API
interface ApiQuiz {
  id: number;
  uuid: string;
  title: string;
  description: string;
  creator_id: number;
  category: string | null;
  difficulty: "easy" | "medium" | "hard";
  total_questions: number;
  estimated_time: number;
  type: "manual" | "ai_generated";
  visibility: "public" | "private" | "password";
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  settings: {
    questionTypes?: string[];
    includeExplanations?: boolean;
    includeMemory?: boolean;
    customInstructions?: string;
    language?: string;
  };
  multimedia?: any;
  password_hash?: string | null;
  embeddings?: any;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes");
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        
        const data = await response.json();
        if (data.status !== 200) throw new Error(data.message);
        
        // Transform API data to match component expectations
        const transformedQuizzes = data.quizzes.map((quiz: ApiQuiz) => ({
          id: quiz.uuid, // Use UUID as the ID for routing
          title: quiz.title,
          description: quiz.description,
          difficulty: quiz.difficulty,
          estimatedTime: quiz.estimated_time,
          aiGenerated: quiz.type === "ai_generated",
          createdAt: quiz.created_at,
          creatorName: `User ${quiz.creator_id}`, // You might want to fetch actual user names
          tags: quiz.category ? [quiz.category] : [], // Convert category to tags array
          questions: Array(quiz.total_questions).fill({}).map((_, index) => ({ id: index + 1 })), // Mock questions for count
        }));
        
        setQuizzes(transformedQuizzes);
        console.log("Fetched and transformed quizzes:", transformedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        // Fallback to static data on error
        setQuizzes(quizzesData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([]);
  
  useEffect(() => {
    // Filter quizzes based on search, category, and difficulty
    const filtered = quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(search.toLowerCase()) ||
        quiz.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || quiz.tags.includes(category);
      const matchesDifficulty =
        difficulty === "all" || quiz.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
    setFilteredQuizzes(filtered);
  }, [search, category, difficulty, quizzes]);
  const handleOnSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleOnCategoryChange = (value: string) => {
    setCategory(value);
  };
  const handleOnDifficultyChange = (value: string) => {
    setDifficulty(value);
  };

  const loadMoreQuizzes = () => {
    // Since we're fetching all quizzes at once, this could be modified to implement pagination
    // For now, we'll show more from the filtered results
    const currentLength = filteredQuizzes.length;
    const nextQuizzes = quizzes.slice(currentLength, currentLength + 6);
    if (nextQuizzes.length > 0) {
      setFilteredQuizzes((prev) => [...prev, ...nextQuizzes]);
    }
  };
  return (
    <div className="container mx-auto p-10 space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Browse Quizzes
          </h1>
          <p className="text-muted-foreground text-sm">
            Discover and participate in interactive quizzes
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white"
        >
          <Link href="/create">
            <Brain className="mr-2 h-4 w-4" />
            Create Quiz
          </Link>
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => handleOnSearchChange(e)}
                className="pl-10 bg-zinc-800 text-white border-zinc-700"
              />
            </div>
            <Select
              defaultValue="all"
              onValueChange={(value) => handleOnCategoryChange(value)}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="geography">Geography</SelectItem>
                <SelectItem value="literature">Literature</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="general">General Knowledge</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue="all"
              onValueChange={(value) => handleOnDifficultyChange(value)}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="hover:shadow-xl transition-shadow bg-zinc-900 border-zinc-800 text-white"
          >
            {loading ? (
              <Skeleton className="h-60 w-full" />
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight text-white">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-zinc-400">
                        {quiz.description}
                      </CardDescription>
                    </div>
                    {quiz.aiGenerated && (
                      <Badge
                        variant="outline"
                        className="text-purple-400 border-purple-500"
                      >
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
                        <AvatarImage
                          src={`https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`}
                          alt={quiz.creatorName}
                        />
                        <AvatarFallback className="text-xs bg-zinc-700 text-white">
                          {quiz.creatorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-zinc-400">
                        {quiz.creatorName}
                      </span>
                    </div>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {quiz.tags.slice(0, 3).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-zinc-800 text-white border-zinc-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {quiz.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-zinc-800 text-white border-zinc-700"
                      >
                        +{quiz.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-zinc-500">
                      Created {formatDate(quiz.createdAt)}
                    </span>
                    <Button
                      size="sm"
                      asChild
                      className="bg-gradient-to-br from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 text-white"
                    >
                      <Link href={`/quiz/${quiz.id}`}>Start Quiz</Link>
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button
          variant="outline"
          onClick={loadMoreQuizzes}
          disabled={filteredQuizzes.length >= quizzes.length}
          className="border-zinc-700 text-white hover:border-pink-500 hover:cursor-pointer"
        >
          Load More Quizzes
        </Button>
      </div>
    </div>
  );
}
