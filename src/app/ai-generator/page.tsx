"use client"
import { useEffect, useState } from "react"
import { Brain, Wand2, RefreshCw, Plus, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { generateAgentQuiz } from "../lib/aiUtils/generateQuiz"
import { validatePrompt } from "../lib/aiUtils/testing"
const { useRouter } = await import('next/navigation')

import { Input_Generative } from "../lib/aiUtils/generateQuiz"
interface GeneratedQuestion {
  id: string
  type: 'mcq' | 'true-false' | 'open'
  question: string
  options?: string[]
  correctAnswer: string | number | boolean
  explanation: string
}

// const mockGeneratedQuestions: GeneratedQuestion[] = [
//   {
//     id: "1",
//     type: "mcq",
//     question: "What is the primary purpose of React hooks?",
//     options: [
//       "To replace class components entirely",
//       "To allow state and lifecycle features in functional components",
//       "To improve performance of React applications",
//       "To handle routing in React applications"
//     ],
//     correctAnswer: 1,
//     explanation: "React hooks allow functional components to use state and other React features that were previously only available in class components."
//   },
//   {
//     id: "2",
//     type: "true-false",
//     question: "JavaScript is a statically typed programming language.",
//     correctAnswer: false,
//     explanation: "JavaScript is a dynamically typed language, meaning variable types are determined at runtime rather than compile time."
//   },
//   {
//     id: "3",
//     type: "open",
//     question: "Explain the concept of closure in JavaScript and provide a practical example.",
//     correctAnswer: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Example: function outer() { let count = 0; return function inner() { count++; return count; }; }",
//     explanation: "Closures are fundamental to JavaScript and enable powerful patterns like data privacy and function factories."
//   }
// ]

export default function AIGeneratorPage() {
  const router = useRouter()


  const [prompt, setPrompt] = useState("")
  const [difficulty, setDifficulty] = useState("medium") // Default to medium
  const [questionType, setQuestionType] = useState("mcq") // Default to MCQ
  const [questionCount, setQuestionCount] = useState("5")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [copiedQuestions, setCopiedQuestions] = useState<Set<string>>(new Set())
  const [quizDatabaseDetails, setQuizDatabaseDetails] = useState<Input_Generative | undefined>(undefined)
  
  // Quiz database details fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [creatorId, setCreatorId] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private" | "password">("public")
  const [passwordHash, setPasswordHash] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft")
  const [estimatedTime, setEstimatedTime] = useState("")
  
  // Settings fields with defaults
  const [questionTypes, setQuestionTypes] = useState<string[]>(["mcq"])
  const [includeExplanations, setIncludeExplanations] = useState(true) // Default to true
  const [includeMemory, setIncludeMemory] = useState(true)
  const [customInstructions, setCustomInstructions] = useState("")
  const [language, setLanguage] = useState("en")
  
  // Multimedia fields
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [audio, setAudio] = useState<string[]>([])
  
  // PDF file
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  async function getUser() {
    const res = await fetch('/api/admin')
    if (!res.ok) {
      throw new Error('Failed to fetch user')
    }

    const data = await res.json();
    setCreatorId(data.user.id);
    // setCreatorId(data.user.id);
    
    return data;
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Validate only compulsory/required fields
    if (!title.trim()) {
      alert("Please enter a quiz title")
      setIsGenerating(false)
      return
    }
    
    if (!category.trim()) {
      alert("Please enter a category")
      setIsGenerating(false)
      return
    }
    
    // At least one content source is required (prompt or PDF)
    if (!prompt.trim() && !pdfFile) {
      alert("Please provide either a prompt or upload a PDF file")
      setIsGenerating(false)
      return
    }
    
    // Remove the validatePrompt check to simplify validation
    // const isValid = await validatePrompt(prompt)
    // if (!isValid && prompt.trim()) {
    //   setIsGenerating(false)
    //   return
    // }

    // Construct the Input_Generative object with defaults for optional fields
    const inputGenerative: Input_Generative = {
      prompt: prompt.trim() || undefined,
      pdfFile : null,
      quiz_database_details: {
        title: title.trim(),
        description: description.trim() || undefined,
        creator_id: creatorId, // Fallback if not set
        visibility,
        password_hash: visibility === "password" ? passwordHash : undefined,
        type: "ai_generated",
        category: category.trim(),
        difficulty: (difficulty as "easy" | "medium" | "hard") || "medium", // Default to medium
        settings: {
          questionTypes: questionTypes.length > 0 ? questionTypes : ["mcq"], // Default to MCQ
          includeExplanations,
          includeMemory,
          customInstructions: customInstructions.trim() || undefined,
          language: language || "en", // Default to English
        },
        multimedia: {
          images: images.length > 0 ? images : undefined,
          videos: videos.length > 0 ? videos : undefined,
          audio: audio.length > 0 ? audio : undefined,
        },
        status: status as "draft" | "published" | "archived",
        totalQuestions: parseInt(questionCount) || 5, // Default to 5 questions
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }

    setQuizDatabaseDetails(inputGenerative)
    
    try {
      const generatedRes = await generateAgentQuiz(inputGenerative)
      if (generatedRes && generatedRes.quizId) {
        console.log("Quiz generated successfully:", generatedRes)
        // Use next/navigation's useRouter for client-side navigation
        router.push(`/quiz/${generatedRes.quizId}`)
        return
      }
      // Otherwise, set generated questions if available
      if (generatedRes && generatedRes.questions) {
        setGeneratedQuestions(generatedRes.questions)
      }
      // setGeneratedQuestions(questions)
    } catch (error) {
      console.log(error)
      alert("Failed to generate quiz. Please try again.")
    }
    
    setIsGenerating(false)
  }

  const handleRegenerate = async (questionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const copyQuestion = (questionId: string) => {
    setCopiedQuestions(prev => new Set(prev).add(questionId))
    setTimeout(() => {
      setCopiedQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto p-10 space-y-8 animate-fadeIn text-white">
      <div className="flex justify-between items-start flex-col md:flex-row">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center">
             AI Question Generator
          </h1>
          <p className="text-muted-foreground">Generate intelligent questions using AI technology</p>
        </div>
        <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-white" asChild>
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" /> Create Quiz Manually
          </Link>
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Generate Questions</CardTitle>
          <CardDescription>Configure your quiz settings and let AI create intelligent questions. Only Title, Category, and Topic/Prompt are required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Quiz Title *</Label>
            <Input
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Quiz Description</Label>
            <Textarea
              placeholder="Enter quiz description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          
          {/* <div className="space-y-2">
            <Label>Creator ID *</Label>
            <Input
              placeholder="Enter creator ID"
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div> */}
          
          <div className="space-y-2">
            <Label>Category *</Label>
            <Input
              placeholder="e.g., Programming, Science, History"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Topic or Prompt *</Label>
            <Textarea
              placeholder="e.g., 'Create questions about React hooks and state management'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          
          {/* <div className="space-y-2">
            <Label>PDF File</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div> */}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(value: "public" | "private" | "password") => setVisibility(value)}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="password">Password Protected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value: "draft" | "published" | "archived") => setStatus(value)}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {visibility === "password" && (
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password for quiz"
                value={passwordHash}
                onChange={(e) => setPasswordHash(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select value={questionType} onValueChange={(value) => {
                setQuestionType(value)
                if (value === "mixed") {
                  setQuestionTypes(["mcq", "true-false", "open"])
                } else {
                  setQuestionTypes([value])
                }
              }}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="open">Open Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated Time (minutes)</Label>
              <Input
                type="number"
                min="1"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., 15"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Custom Instructions</Label>
            <Textarea
              placeholder="Any specific instructions for question generation"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Settings</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeExplanations"
                  checked={includeExplanations}
                  onCheckedChange={setIncludeExplanations}
                />
                <Label htmlFor="includeExplanations">Include Explanations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeMemory"
                  checked={includeMemory}
                  onCheckedChange={setIncludeMemory}
                />
                <Label htmlFor="includeMemory">Include Memory</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label>Multimedia (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Image URLs</Label>
                <Textarea
                  placeholder="Enter image URLs (one per line)"
                  value={images.join('\n')}
                  onChange={(e) => setImages(e.target.value.split('\n').filter(url => url.trim()))}
                  className="bg-zinc-800 border-zinc-700 text-white h-20"
                />
              </div>
              <div className="space-y-2">
                <Label>Video URLs</Label>
                <Textarea
                  placeholder="Enter video URLs (one per line)"
                  value={videos.join('\n')}
                  onChange={(e) => setVideos(e.target.value.split('\n').filter(url => url.trim()))}
                  className="bg-zinc-800 border-zinc-700 text-white h-20"
                />
              </div>
              <div className="space-y-2">
                <Label>Audio URLs</Label>
                <Textarea
                  placeholder="Enter audio URLs (one per line)"
                  value={audio.join('\n')}
                  onChange={(e) => setAudio(e.target.value.split('\n').filter(url => url.trim()))}
                  className="bg-zinc-800 border-zinc-700 text-white h-20"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!title.trim() || !category.trim() || (!prompt.trim() && !pdfFile) || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white"
          >
            {isGenerating ? (
              <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Wand2 className="mr-2 h-4 w-4" /> Generate Questions</>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedQuestions.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Generated Questions</h2>
            <Badge variant="secondary">{generatedQuestions.length} questions</Badge>
          </div>
          <div className="space-y-4">
            {generatedQuestions.map((q) => {
              const isCopied = copiedQuestions.has(q.id)
              return (
                <Card key={q.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-purple-400 border-purple-500">
                          <Brain className="mr-1 h-3 w-3" /> AI Generated
                        </Badge>
                        <Badge variant="secondary">
                          {q.type === 'mcq' ? 'MCQ' : q.type === 'true-false' ? 'True/False' : 'Open'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleRegenerate(q.id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => copyQuestion(q.id)}>
                          {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Question:</h4>
                      <p>{q.question}</p>
                    </div>
                    {q.type === 'mcq' && q.options && (
                      <div>
                        <h4 className="font-semibold">Options:</h4>
                        <div className="space-y-1">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded text-sm ${q.correctAnswer === i ? 'bg-green-800 text-green-200' : 'bg-zinc-800 text-white'}`}
                            >
                              {i + 1}. {opt} {q.correctAnswer === i && <Badge variant="outline" className="ml-2 text-green-300 border-green-400">Correct</Badge>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {q.type === 'true-false' && (
                      <div>
                        <h4 className="font-semibold">Correct Answer:</h4>
                        <Badge variant="outline" className="text-blue-300 border-blue-500">
                          {q.correctAnswer ? 'True' : 'False'}
                        </Badge>
                      </div>
                    )}
                    {q.type === 'open' && (
                      <div>
                        <h4 className="font-semibold">Sample Answer:</h4>
                        <p className="bg-zinc-800 p-3 rounded text-sm">{q.correctAnswer}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">Explanation:</h4>
                      <p className="text-muted-foreground text-sm">{q.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
