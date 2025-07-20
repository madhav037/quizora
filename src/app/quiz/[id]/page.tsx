"use client";
import { Clock, Users, Brain, Play, Share, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { formatDate, getDifficultyColor } from "@/app/lib/utils";
import quizzesData from "@/data/quizzes.json";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Database } from "@/types/database";
import { vi } from "zod/v4/locales";
import { format } from 'date-fns';


export default function QuizDetailPage({ params }: { params: { id: string } }) {
  const id = useParams().id as string;
  const [quiz, setQuiz] = useState<{
    id: string;
    title: string;
    description: string;
    creator_id: number;
    creatorName: string;
    visibility: string;
    password_hash: string;
    type: string;
    category: string;
    difficulty: string;
    settings: {
      shuffle: boolean;
      language: string;
      showResults: boolean;
      allowRetakes: boolean;
      passingScore: number;
      includeMemory: boolean;
      quesionTypes: string[];
      includeExplanations: boolean;
    };
    multimedia: object;
    status: string;
    total_questions: number;
    estimated_time: number;
    created_at: Date;
    updated_at: Date;
    embedding: string;
    questions: Database['public']['Tables']['quiz_questions']['Row'][];
    tags?: string[];
    estimatedTime?: number;
    isPublic?: boolean;
  }>(
    {
      id:"",
      title: "",
      description: "",
      creator_id:0,
      creatorName: "",
      visibility: "public",
      password_hash: "",
      type: "manual",
      category: "",
      difficulty: "easy",
      settings: {
        shuffle: false,
        language: "en",
        showResults: true,
        allowRetakes: false,
        passingScore: 70,
        includeMemory: false,
        quesionTypes: ["mcq", "true-false", "open"],
        includeExplanations: false,
      },
      multimedia: {},
      status: "draft",
      total_questions: 0,
      estimated_time: 0,
      created_at: new Date(),
      updated_at: new Date(),
      embedding: "",
      questions: [],
      tags: [],
      estimatedTime: 0,
      isPublic: true,
    }
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/quizzes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setQuiz(data.quiz);
        } else {
          console.error("Error fetching quiz:", data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      });
      
  }, [id]);

  const connectSocket = () => {
    const socket = new WebSocket("ws://localhost:3000");
    socket.onopen = () => {
      console.log("Connected to quiz socket server");
      socket.send(JSON.stringify({ action: "joinRoom", room: quiz.id, userId: "user-123" }));
    };
  };

  return (
    <div className="bg-gradient-to-b min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#0c0a09] text-white shadow-xl border border-indigo-800 rounded-2xl overflow-hidden">
          {/* 🖼️ Quiz image banner */}
          {/* {quiz.image && (
            <img
              src={quiz.image}
              alt={`${quiz.title} banner`}
              className="w-full h-56 object-cover"
            />
          )} */}

          <CardHeader className="space-y-3 px-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-extrabold text-pink-400 drop-shadow-md">
                    {quiz.title}
                  </h1>
                  {quiz.type=='manual' && (
                    <Badge
                      variant="outline"
                      className="text-purple-400 border-purple-300 bg-purple-900/30"
                    >
                      <Brain className="mr-1 h-3 w-3" />
                      AI Generated
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center space-x-2 text-sm text-slate-400 font-medium">
                  <span className="text-cyan-300">Assessment</span>
                  <span>•</span>
                  <span className="text-red-400 font-bold">
                    {quiz.difficulty}
                  </span>
                </div>

                <p className="text-lg text-slate-300 italic">
                  {quiz.description}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-pink-400 text-pink-300 hover:bg-pink-800/30"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 hover:brightness-125 text-white shadow-lg shadow-pink-500/30"
                  asChild
                >
                  <Link href={`/session/${quiz.id}`}>
                    <Play className="mr-2 h-4 w-4" />
                    Start Quiz
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <Separator className="my-6 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 h-0.5 opacity-60" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-emerald-400">
                  {quiz.questions.length? quiz.questions.length : 0}
                </div>
                <div className="text-sm text-slate-400">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-sky-400">
                  {quiz.estimated_time || 0}
                </div>
                <div className="text-sm text-slate-400">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-yellow-400">
                  {156}
                </div>
                <div className="text-sm text-slate-400">Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-rose-400">4.8</div>
                <div className="text-sm text-slate-400">Rating</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                    alt={quiz.creatorName}
                  />
                  {/* <AvatarFallback>{quiz.creatorName.charAt(0)}</AvatarFallback> */}
                </Avatar>
                <div>
                  <p className="font-semibold text-fuchsia-300">
                    {quiz.creatorName}
                  </p>
                  <p className="text-sm text-slate-400 italic">
                    Created {format(new Date(quiz.created_at), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-teal-700 text-white font-semibold shadow-inner shadow-teal-500/20"
                >
                  {quiz.category}
                </Badge>
                <Badge
                  className={`${getDifficultyColor(
                    quiz.difficulty
                  )} font-semibold hover:scale-105 transition-transform duration-200`}
                >
                  {quiz.difficulty}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* === Questions Preview & Stats Below === */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1c2028] text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-sky-400" />
                  Questions Preview
                </CardTitle>
                <CardDescription>
                  Get a sneak peek at a few questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quiz.questions.slice(0, 3).map((q, idx) => (
                  <div
                    key={q.id}
                    className="border border-slate-700 rounded-lg p-4 bg-[#1e2230]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-sky-300">
                        Q{idx + 1}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={q.type === "multiple_choice" ? "default" : "secondary"}
                          className="uppercase text-xs"
                        >
                          {q.type === "multiple_choice"
                            ? "Multiple Choice"
                            : q.type === "true_false"
                            ? "True/False"
                            : "Open"}
                        </Badge>
                        {/* {q.aiGenerated && (
                          <Badge
                            variant="outline"
                            className="text-purple-400 border-purple-300"
                          >
                            <Brain className="mr-1 h-3 w-3" />
                            AI
                          </Badge>
                        )} */}
                      </div>
                    </div>
                    <p className="font-medium line-clamp-2">{q.question}</p>
                    <div className="flex items-center justify-between mt-2 text-sm text-slate-400">
                      <span>{q.points} pts</span>
                      
                    </div>
                  </div>
                ))}
                {quiz.questions.length > 3 && (
                  <div className="text-center py-4 text-slate-400">
                    + {quiz.questions.length - 3} more questions
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1c2028] text-white">
              <CardHeader>
                <CardTitle>Topics Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {quiz.category}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quiz Stats */}
            <Card className="bg-[#1c2028] text-white">
              <CardHeader>
                <CardTitle>Quiz Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["Total Questions", quiz.questions.length],
                  ["Estimated Time", `${quiz.estimatedTime} min`],
                  ["Difficulty", quiz.difficulty],
                  ["Category", quiz.category],
                  ["Public", quiz.isPublic ? "Yes" : "No"],
                ].map(([label, value], i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-400">{label}</span>
                    {label === "Difficulty" ? (
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {value}
                      </Badge>
                    ) : (
                      <span className="font-medium">{value}</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Start / Join */}
            <Card className="bg-[#1c2028] text-white">
              <CardHeader>
                <CardTitle>Ready to Start?</CardTitle>
                <CardDescription>Test your knowledge now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:brightness-110 text-white"
                  size="lg"
                  asChild
                >
                  <Link href={`/session/${quiz.id}`} onClick={connectSocket}>
                    <Play className="mr-2 h-4 w-4" />
                    Start Live Now
                  </Link>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:brightness-110 text-white"
                  size="lg"
                  asChild
                >
                  <Link href={`/session/${quiz.id}`}>
                    <Play className="mr-2 h-4 w-4" />
                    Start Quiz Now
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-sky-500 text-sky-300 hover:bg-sky-800/20"
                  asChild
                >
                  <Link href="/join">
                    <Users className="mr-2 h-4 w-4" />
                    Join Live Session
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Similar Quizzes */}
            <Card className="bg-[#1c2028] text-white">
              <CardHeader>
                <CardTitle>Similar Quizzes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quizzesData
                  .filter(
                    (q) => q.id !== quiz.id && q.category === quiz.category
                  )
                  .slice(0, 2)
                  .map((sq) => (
                    <div
                      key={sq.id}
                      className="border border-slate-700 rounded-lg p-3 bg-[#212630]"
                    >
                      <h4 className="font-medium text-sm text-slate-100 mb-1">
                        {sq.title}
                      </h4>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                        {sq.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-sky-300 text-xs"
                        >
                          {sq.questions.length} Qs
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/quiz/${sq.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
