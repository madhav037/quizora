"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Brain, Save, Eye, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  type: 'mcq' | 'true-false' | 'open_ended'
  question_text: string
  options?: string[]
  correct_answer: string | number | boolean
  explanation?: string
  media_url?: string
  hint?: string
  points: number
  difficulty?: 'easy' | 'medium' | 'hard',
  order_index?: number
}

export default function CreateQuizPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [questionIdCounter, setQuestionIdCounter] = useState(1)
  const [questions, setQuestions] = useState<Question[]>([])
  const [quiz, setQuiz] = useState({ title: "", description: "", category: "", difficulty: "", isPublic: true })
  const [settings, setSettings] = useState({ shuffle: false, showResults: false, allowRetakes: false, passingScore: 70 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log(quiz)
    console.log(questions);
    console.log(settings);
  }, [questions, quiz, settings])

  if (!mounted) {
    return (
      <div className="container mx-auto p-10 space-y-10 animate-fadeIn">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-muted-foreground">Loading quiz creator...</p>
          </div>
        </div>
      </div>
    )
  }

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `question-${questionIdCounter}`,
      type,
      question_text: "",
      options: type === 'mcq' ? ["", "", "", ""] : undefined,
      correct_answer: type === 'true-false' ? false : type === 'mcq' ? 0 : "",
      points: 0
    }
    setQuestions([...questions, newQuestion])
    setQuestionIdCounter(prev => prev + 1)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      // TODO: Parse CSV and update `questions`
      console.log("CSV Content:", text)
    }
    reader.readAsText(file)
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!quiz.title.trim()) errors.push("Quiz title is required")
    if (!quiz.description.trim()) errors.push("Quiz description is required")
    if (!quiz.category) errors.push("Category is required")
    if (!quiz.difficulty) errors.push("Difficulty is required")
    if (questions.length === 0) errors.push("At least one question is required")
    
    // Validate each question
    questions.forEach((question, index) => {
      if (!question.question_text.trim()) {
        errors.push(`Question ${index + 1}: Question text is required`)
      }
      
      if (question.type === 'mcq') {
        if (!question.options || question.options.some(opt => !opt.trim())) {
          errors.push(`Question ${index + 1}: All MCQ options must be filled`)
        }
        if (typeof question.correct_answer !== 'number' || question.correct_answer < 0) {
          errors.push(`Question ${index + 1}: Correct answer must be selected`)
        }
      }
      
      if (question.type === 'open_ended' && !question.correct_answer) {
        errors.push(`Question ${index + 1}: Sample answer is required`)
      }
      
      if (question.points <= 0) {
        errors.push(`Question ${index + 1}: Points must be greater than 0`)
      }
    })
    
    return errors
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Validate form
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        alert('Please fix the following errors:\n' + validationErrors.join('\n'))
        setIsSubmitting(false)
        return
      }

      // Prepare quiz data
      const quizData = {
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        visibility: quiz.isPublic ? 'public' : 'private',
        type: 'manual',
        settings: {
          questionTypes: [...new Set(questions.map(q => q.type))],
          includeExplanations: false,
          includeMemory: false,
          language: 'en',
          shuffle: settings.shuffle,
          showResults: settings.showResults,
          allowRetakes: settings.allowRetakes,
          passingScore: settings.passingScore
        },
        status: 'draft',
        total_questions: questions.length,
      }

      // Create quiz first
      const quizResponse = await fetch('/api/quizzes/byCreator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({quiz:quizData, questions}),
      })

      const quizResult = await quizResponse.json()

      if (quizResult.status !== 201) {
        throw new Error(quizResult.message || 'Failed to create quiz')
      }

      const createdQuiz = quizResult.quiz

      // Prepare questions data
      // const questionsData = questions.map((question, index) => ({
      //   quiz_id: createdQuiz.id,
      //   type: question.type === 'true-false' ? 'true_false' : question.type === 'open_ended' ? 'open_ended' : 'mcq',
      //   question_text: question.question_text,
      //   options: question.type === 'mcq' ? question.options : 
      //           question.type === 'true-false' ? ['True', 'False'] : null,
      //   correct_answer: question.type === 'mcq' ? [question.options?.[question.correct_answer as number]] :
      //                  question.type === 'true-false' ? [question.correct_answer ? 'True' : 'False'] :
      //                  [question.correct_answer as string],
      //   explanation: null,
      //   media_url: null,
      //   hint: null,
      //   points: question.points,
      //   difficulty: quiz.difficulty,
      //   order_index: index,
      // }))

      // // Create questions
      // const questionsResponse = await fetch('/api/quiz-questions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ questions: questionsData }),
      // })

      // const questionsResult = await questionsResponse.json()

      // if (questionsResult.status !== 201) {
      //   console.error('Failed to create questions:', questionsResult)
      //   throw new Error(questionsResult.message || 'Failed to create questions')
      // }

      // Success
      alert('Quiz created successfully!')
      
      // Redirect to quiz detail page
      router.push(`/quiz/${createdQuiz.uuid}`)

    } catch (error) {
      console.error('Error creating quiz:', error)
      alert(error instanceof Error ? error.message : 'Failed to create quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestionEditor = (question: Question, index: number) => (
    <Card key={question.id} className="relative bg-zinc-900 border-zinc-800 text-white animate-fadeIn">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {question.type === 'mcq' ? 'MCQ' : question.type === 'true-false' ? 'True/False' : 'Open'}
            </Badge>
            {/* {question.aiGenerated && (
              <Badge variant="outline" className="text-purple-400 border-purple-500">
                <Brain className="mr-1 h-3 w-3" /> AI
              </Badge>
            )} */}
          </div>
          <Button variant="ghost" size="sm" onClick={() => deleteQuestion(question.id)} className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Question {questions.length - index}</Label>
          <Textarea
            placeholder="Enter your question here..."
            value={question.question_text}
            onChange={(e) => updateQuestion(question.id, { question_text: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>

        {question.type === 'mcq' && (
          <div className="space-y-2">
            <Label>Answer Options</Label>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])]
                    newOptions[index] = e.target.value
                    updateQuestion(question.id, { options: newOptions })
                  }}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Button
                  variant={question.correct_answer === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateQuestion(question.id, { correct_answer: index })}
                >
                  {question.correct_answer === index ? "Correct" : "Mark Correct"}
                </Button>
              </div>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <div className="flex space-x-2">
              <Button
                variant={question.correct_answer === true ? "outline" : "default"}
                onClick={() => updateQuestion(question.id, { correct_answer: true })}
              >
                True
              </Button>
              <Button
                variant={question.correct_answer === false ? "outline" : "default"}
                onClick={() => updateQuestion(question.id, { correct_answer: false })}
              >
                False
              </Button>
            </div>
          </div>
        )}

        {question.type === 'open_ended' && (
          <div className="space-y-2">
            <Label>Sample Answer</Label>
            <Textarea
              placeholder="Provide a sample answer..."
              value={question.correct_answer as string}
              onChange={(e) => updateQuestion(question.id, { correct_answer: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          
          <div className="space-y-2">
            <Label>Points</Label>
            <Input
              type="number"
              value={question.points}
              onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 10 })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-10 space-y-10 animate-fadeIn">
      <div className="flex items-start justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Create Quiz</h1>
          <p className="text-muted-foreground">Build and customize your quiz easily</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild className="bg-gradient-to-br from-purple-600 to-pink-500 text-white">
            <Link href="/ai-generator"><Brain className="mr-2 h-4 w-4" /> AI Generator</Link>
          </Button>
          <label htmlFor="csv-upload">
            <Input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
            <Button className="bg-zinc-800 border-zinc-700 text-white hover:border-pink-500" type="button">
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>
          </label>
          <Button variant="outline" className="text-white border-zinc-700">
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button 
            className="bg-gradient-to-br from-pink-600 to-purple-500 text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Quiz
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-zinc-900 border-zinc-800 text-white">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="bg-zinc-900 border-zinc-800 text-white animate-fadeIn">
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
              <CardDescription>Provide title, description, and category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} placeholder="Quiz Title" className="bg-zinc-800 border-zinc-700 text-white" />
              <Textarea value={quiz.description} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} placeholder="Quiz Description" className="bg-zinc-800 border-zinc-700 text-white" />
              <div className="grid grid-cols-2 gap-4">
                <Select value={quiz.category} onValueChange={(value) => setQuiz({ ...quiz, category: value })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={quiz.difficulty} onValueChange={(value) => setQuiz({ ...quiz, difficulty: value })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={quiz.isPublic} onCheckedChange={(value) => setQuiz({ ...quiz, isPublic: value })} />
                <Label>Public Quiz</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card className="bg-zinc-900 border-zinc-800 text-white animate-fadeIn">
            <CardHeader>
              <CardTitle>Add Questions</CardTitle>
              <CardDescription>Choose question types to add</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button onClick={() => addQuestion('mcq')}><Plus className="mr-2 h-4 w-4" /> MCQ</Button>
              <Button variant="outline" onClick={() => addQuestion('true-false')}><Plus className="mr-2 h-4 w-4" /> True/False</Button>
              <Button variant="outline" onClick={() => addQuestion('open_ended')}><Plus className="mr-2 h-4 w-4" /> Open</Button>
            </CardContent>
          </Card>
          <div className="space-y-4 mt-4">
            {questions.length === 0 ? (
              <Card className="bg-zinc-800 text-center text-white p-10 animate-fadeIn">
                <Brain className="h-10 w-10 mx-auto mb-4 text-purple-400" />
                <p>No questions added yet. Use AI Generator or Add manually.</p>
              </Card>
            ) : questions.slice().reverse().map((question, index) => renderQuestionEditor(question, index))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-zinc-900 border-zinc-800 text-white animate-fadeIn">
            <CardHeader>
              <CardTitle>Quiz Settings</CardTitle>
              <CardDescription>Configure quiz behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Shuffle Questions</Label>
                <Switch checked={settings.shuffle} onCheckedChange={(value) => setSettings({ ...settings, shuffle: value })} />
              </div>
              <div className="flex justify-between items-center">
                <Label>Show Results Immediately</Label>
                <Switch checked={settings.showResults} onCheckedChange={(value) => setSettings({ ...settings, showResults: value })} />
              </div>
              <div className="flex justify-between items-center">
                <Label>Allow Retakes</Label>
                <Switch checked={settings.allowRetakes} onCheckedChange={(value) => setSettings({ ...settings, allowRetakes: value })} />
              </div>
              <div>
                <Label>Passing Score (%)</Label>
                <Input type="number" placeholder="70" className="bg-zinc-800 border-zinc-700 text-white" value={settings.passingScore} onChange={(e) => setSettings({ ...settings, passingScore: Number(e.target.value) })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}