// scripts/test_generate_no_db.ts
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

type Input = {
  userId: string;
  prompt?: string;
  pdfFile?: File | Buffer | null;
  quiz_details?: {
    title?: string;
    description?: string;
    topics?: string[];
    difficulty?: "easy" | "medium" | "hard";
    totalQuestions?: number;
    questionTypes?: string[];
    includeExplanations?: boolean;
    includeMemory?: boolean;
    customInstructions?: string;
    language?: string;
  };
};

async function generateQuizWithoutDB(input: Input) {
  const {
    userId,
    prompt,
    pdfFile,
    quiz_details = {},
  } = input;

  const {
    title = "Untitled Quiz",
    description = "",
    topics = [],
    difficulty = "medium",
    totalQuestions = 10,
    questionTypes = ["mcq"],
    includeExplanations = false,
    includeMemory = true,
    customInstructions = "",
    language = "en",
  } = quiz_details;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 1. Get final prompt
  let content = prompt || "";
  if (pdfFile) {
    // Skip PDF processing for this test
    content += "\n\nPDF content would be extracted here";
  }

  const finalPrompt = `
You are an expert quiz generator.
Generate a ${difficulty} quiz in ${language} with ${totalQuestions} questions based on the following content:

"${content || 'General knowledge topics including geography, science, history, and culture'}"

Topics: ${topics.join(", ") || "any relevant"}
Question types: ${questionTypes.join(", ")}
Include explanations: ${includeExplanations ? "Yes" : "No"}

${customInstructions ? `Instructions: ${customInstructions}` : ""}

Return result as JSON in this exact format:
{
  "title": "Quiz Title",
  "description": "Quiz description",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation text"
    }
  ]
}

Make sure the JSON is valid and properly formatted.
`;

  console.log('Sending prompt to AI...');
  const result = await model.generateContent(finalPrompt);
  const text = await result.response.text();

  console.log('Raw AI response:');
  console.log(text);
  console.log('\\n---\\n');

  let quizJson;
  try {
    // Clean the text to remove markdown code blocks if present
    let cleanText = text.trim();
    console.log('Original text length:', cleanText.length);
    
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.slice(7); // Remove ```json
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.slice(3); // Remove ```
    }
    
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.slice(0, -3); // Remove trailing ```
    }
    
    cleanText = cleanText.trim();
    
    console.log('Cleaned text for parsing:');
    console.log(cleanText);
    console.log('\\n---\\n');
    
    quizJson = JSON.parse(cleanText);
    console.log('Successfully parsed JSON:');
    console.log(JSON.stringify(quizJson, null, 2));
    
  } catch (e) {
    console.error("Failed to parse Gemini output:", e);
    console.error("Raw output:", text);
    throw new Error("Invalid response from AI");
  }

  // Return without database operations
  const quizId = uuidv4();
  return {
    quizId,
    quiz: {
      id: quizId,
      user_id: userId,
      title: title || quizJson.title,
      description: description || quizJson.description,
      difficulty,
      total_questions: quizJson.questions.length,
    },
    questions: quizJson.questions.map((q: any) => ({
      id: uuidv4(),
      quiz_id: quizId,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation || null,
    }))
  };
}

async function main() {
  const input: Input = {
    userId: 'b11413ca-d282-40f1-884f-c63d571d0b3e',
    pdfFile: null,
    quiz_details: {
      title: 'Geography Quiz',
      totalQuestions: 5,
      difficulty: 'easy',
      includeExplanations: true,
      language: 'en',
    },
  };

  try {
    console.log('Generating quiz without database...');
    console.log('Input:', JSON.stringify(input, null, 2));
    console.log('\\n---\\n');
    
    const result = await generateQuizWithoutDB(input);
    console.log('\\n\\nFinal result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error generating quiz:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

main();
