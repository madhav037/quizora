// lib/geminiAgent.ts

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function callGeminiForQuiz(content: string, memory: string | null) {
  const prompt = `
You are a quiz generator agent. Based on the following input, generate a quiz.

Context: ${memory || 'No previous context.'}
Input: ${content}

Respond in JSON format like:
{
  "topic": ["javascript", "programming", "web-development"],
  "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "question": "What is the correct way to declare a variable in JavaScript?",
        "options": ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
        "correctAnswer": 0,
        "points": 10,
        "aiGenerated": true
      },
      {
        "id": "q2",
        "type": "true-false",
        "question": "JavaScript is a statically typed language.",
        "correctAnswer": false,
        "points": 10,
        "aiGenerated": true
      }
    ],
  "memory": "This quiz is about JavaScript basics."
}`

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = await response.text()

  return JSON.parse(text)
}
