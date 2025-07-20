// scripts/test_generate_simple.ts
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testGenerateQuiz() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'test-key');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert quiz generator.
Generate a easy quiz in en with 5 questions based on the following content:

"Geography topics including continents, countries, capitals, and physical features"

Topics: geography
Question types: mcq
Include explanations: Yes

Return result as JSON in this format:
{
  title: "Geography Quiz",
  description: "Test your geography knowledge",
  questions: [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
      explanation: "Paris is the capital and largest city of France."
    }
  ]
}
`;

    console.log('Testing quiz generation...');
    console.log('Environment check:');
    console.log('GEMINI_API_KEY available:', !!process.env.GEMINI_API_KEY);
    
    if (!process.env.GEMINI_API_KEY) {
      console.log('Warning: GEMINI_API_KEY not found in environment variables');
      return;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Generated quiz:');
    console.log(text);
    
  } catch (error) {
    console.error('Error generating quiz:', error);
  }
}

testGenerateQuiz();
