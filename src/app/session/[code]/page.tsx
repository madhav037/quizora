"use client";

import { useState, useEffect } from "react";
import { Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/app/lib/utils";
import { useParams } from "next/navigation";

const mockSession = {
  id: "session-1",
  quiz_id: "quiz-1",
  host_id: "user-123",
  started_at: new Date().toISOString(),
  ended_at: null,
  status: "active",
  code: "ABC123",
  currentQuestionIndex: 0,
  participants: [
    {
      id: "1",
      name: "You",
      score: 0,
      rank: 1,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      id: "2",
      name: "Alice",
      score: 20,
      rank: 1,
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      id: "3",
      name: "Bob",
      score: 10,
      rank: 2,
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
  ],
};

export default function QuizSessionPage({
  params,
}: {
  params: { code: string };
}) {
  const p = useParams()
  const param = p.code || params.code;
  console.log(param);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !hasAnswered) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !hasAnswered) {
      setHasAnswered(true);
      setShowResults(true);
    }
  }, [timeLeft, hasAnswered]);

  const fetchQuestions = async () => {
    const response = await fetch(`/api/quiz-questions/${param}`);
    const data = await response.json();
    setQuestions(data);
    setTimeLeft(30);
  };

  const handleAnswerSelect = (index: number) => {
    if (!hasAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      setHasAnswered(true);
      setShowResults(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setShowResults(false);
      setTimeLeft(30);
    } else {
      setShowLeaderboard(true); // End of quiz
    }
  };

  if (!currentQuestion) {
    return <div className="p-4">Loading question...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-secondary px-4 py-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leaderboard</h2>
          <Badge variant="secondary">
            <Users className="mr-1 h-3 w-3" />
            {mockSession.participants.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {mockSession.participants
            .sort((a, b) => b.score - a.score)
            .map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center justify-between bg-card p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-bold w-6 text-center">
                    {index + 1}
                  </div>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={participant.avatar}
                      alt={participant.name}
                    />
                    <AvatarFallback>
                      {participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate max-w-[100px]">
                    {participant.name}
                  </span>
                </div>
                <p className="text-sm font-bold">{participant.score}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Main quiz area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Live Quiz</h1>
            <p className="text-muted-foreground">Code: {mockSession.code}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <Badge variant="secondary">
              <Clock className="mr-1 h-3 w-3" />
              {formatTime(timeLeft)}
            </Badge>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question_text}</CardTitle>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {currentQuestion.options?.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto p-4 ${hasAnswered && showResults
                    ? option === currentQuestion.answer[0]
                      ? "bg-green-100 border-green-500 text-green-800"
                      : selectedAnswer === index &&
                        option !== currentQuestion.answer[0]
                        ? "bg-red-100 border-red-500 text-red-800"
                        : ""
                    : ""
                    }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={hasAnswered}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option}</span>
                    {hasAnswered && showResults && (
                      <>
                        {option === currentQuestion.answer[0] && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {selectedAnswer === index &&
                          option !== currentQuestion.answer[0] && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                      </>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {!hasAnswered && selectedAnswer !== null && (
              <Button
                onClick={handleSubmitAnswer}
                className="w-full mt-4"
                size="lg"
              >
                Submit Answer
              </Button>
            )}

            {showResults && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">
                  {currentQuestion.answer.includes(
                    currentQuestion.options[selectedAnswer!]
                  )
                    ? "Correct! 🎉"
                    : "Incorrect 😔"}
                </p>
                <p className="text-sm text-muted-foreground">
                  The correct answer is:{" "}
                  <strong>{currentQuestion.answer[0]}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Points earned:{" "}
                  {currentQuestion.answer.includes(
                    currentQuestion.options[selectedAnswer!]
                  )
                    ? currentQuestion.points
                    : 0}
                </p>
                <Button
                  onClick={handleNextQuestion}
                  className="w-full mt-4"
                  size="lg"
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}