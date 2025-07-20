'use server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
// import { extractTextFromPDF } from "./pdfUtils"; // custom util to extract text
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { getFeedbackSummaryByTopic } from "./feedback/feedbackTool";
import { cosineSimilarity, embedText } from "./feedback/embeddingUtils";
import { getMemory, Memory, updateMemory } from "./memory";
import * as fs from 'fs';
dotenv.config();

type Input_Generative = {
  prompt?: string;
  pdfFile?: File | Buffer | null | string;
  quiz_database_details: {
    title: string;
    description?: string;
    creator_id: string;
    visibility?: "public" | "private" | "password";
    password_hash?: string;
    type: "manual" | "ai_generated";
    category: string;
    difficulty?: "easy" | "medium" | "hard";
    settings?: {
      questionTypes?: string[];
      includeExplanations?: boolean;
      includeMemory?: boolean;
      customInstructions?: string;
      language?: string;
    };
    multimedia?: {
      images?: string[];
      videos?: string[];
      audio?: string[];
    };
    status?: "draft" | "published" | "archived";
    totalQuestions?: number;
    estimatedTime?: number;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type { Input_Generative };

export async function generateAgentQuiz(input: Input_Generative) {
  const { prompt, pdfFile, quiz_database_details } = input;

  const {
    title,
    description,
    creator_id,
    difficulty = "medium",
    totalQuestions = 5,
    settings = {},
    category,
    type,
    visibility = "public",
    status = "draft",
    estimatedTime,
  } = quiz_database_details;

  const {
    questionTypes = ["mcq"],
    includeExplanations = false,
    includeMemory = true,
    customInstructions = "",
    language = "en",
  } = settings;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  console.log(process.env.GEMINI_API_KEY, process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || "not set" );
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log("reached 1");
  // 1. Get final prompt
  let content = prompt || "";
  // if (false && pdfFile) {
  //   const extractedText = await extractTextFromPDF(pdfFile as string);
  //   content += "\n\n" + extractedText + "HE:::O";
  // }
  if (!content) {
    throw new Error("No content provided for quiz generation");
  }else {
    console.log("Content extracted for quiz generation:", content + "...");
  }
  

  let feedbackSummary = "";
  if (includeMemory && category) {
    try {
      feedbackSummary = await getFeedbackSummaryByTopic(category);
    } catch (e) {
      console.warn("Failed to fetch feedback summary:", e);
    }
  }
  let memory: Memory | null = await getMemory(creator_id, supabase);
  let similarity = 0;
  
  if (memory?.topic && category) {
    const prevTopic = await embedText(memory.topic);
    const currentTopic = await embedText(category);
    similarity = cosineSimilarity(prevTopic, currentTopic);
  }
  
  if (similarity > 0.8 && memory) {
    feedbackSummary += `\n\nPreviously, asked about a similar topic: ${
      memory?.topic
    }\n
    and ${
      memory?.last_prompt
        ? `Previously the user asked:\n"${memory.last_prompt}"\n`
        : ""
    }
${
  memory?.last_response
    ? `Your last response was:\n${memory.last_response}\n`
    : ""
}`;
  } else if (similarity < 0.2) {
    feedbackSummary += `No feedback available for this topic.`;
  }

  const finalPrompt = `
You are an expert quiz generator.
Generate a ${difficulty} quiz in ${language} with ${totalQuestions} questions based on the following content:

"${content}"

also, ${

  feedbackSummary
    ? `Use the following summarized feedback to improve question quality:\n\n${feedbackSummary}\n\n`
    : ""
}

Category: ${category}
Type: ${type}
Question types: ${questionTypes.join(", ")}
Include explanations: ${includeExplanations ? "Yes" : "No"}

${customInstructions ? `Instructions: ${customInstructions}` : ""}

Return result as JSON in this EXACT format - do not deviate:
{
  "title": "Quiz Title Here",
  "questions": [
    {
      "question": "Sample multiple choice question?",
      "options": ["option1", "option2", "option3", "option4"],
      "explanation": "Explanation text here",
      "correct_answer": ["option2"],
      "type": "mcq",
      "media_url": null,
      "hint": "Helpful hint here",
      "points": 1,
      "difficulty": "easy"
    },
    {
      "question": "Sample true/false question?",
      "options": ["True", "False"],
      "explanation": "Explanation text here",
      "correct_answer": ["True"],
      "type": "true_false",
      "media_url": null,
      "hint": "Helpful hint here",
      "points": 1,
      "difficulty": "easy"
    },
    {
      "question": "Sample open-ended question?",
      "explanation": "Explanation text here",
      "correct_answer": ["answer1", "answer2", "answer3"],
      "type": "open_ended",
      "media_url": null,
      "hint": "Helpful hint here",
      "points": 1,
      "difficulty": "easy"
    }
  ]
}

IMPORTANT: 
- Generate exactly ${totalQuestions} questions
- Use only the question types: ${questionTypes.join(", ")}
- Ensure valid JSON with no syntax errors
- Do not include any text outside the JSON
- For MCQ: include 4 options, correct_answer should be one of the options
- For true_false: options should be ["True", "False"], correct_answer should be ["True"] or ["False"]
- For open_ended: no options needed, correct_answer should be array of acceptable answers
`;
  console.log("Sending prompt to AI...");
  const result = await model.generateContent(finalPrompt);
  const text = await result.response.text();

  let quizJson;
  try {
    // Clean the text to remove markdown code blocks if present
    let cleanText = text.trim();

    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.slice(7); // Remove ```json
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.slice(3); // Remove ```
    }

    if (cleanText.endsWith("```")) {
      cleanText = cleanText.slice(0, -3); // Remove trailing ```
    }

    cleanText = cleanText.trim();

    // Additional cleaning - remove any text before first { or after last }
    const firstBrace = cleanText.indexOf("{");
    const lastBrace = cleanText.lastIndexOf("}");
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }

    console.log("Cleaned JSON for parsing:", cleanText.substring(0, 200) + "...");
    
    quizJson = JSON.parse(cleanText);
    
    // Validate the structure
    if (!quizJson.title || !Array.isArray(quizJson.questions)) {
      throw new Error("Invalid quiz structure - missing title or questions array");
    }
    
    if (quizJson.questions.length === 0) {
      throw new Error("No questions generated");
    }
    
  } catch (e) {
    console.error("Failed to parse Gemini output:", e);
    console.error("Raw output:", text);
    throw new Error("Invalid response from AI");
  }

  // console.log('Parsed quiz JSON:', quizJson);

  // 2. Insert quiz into Supabase
  const quizId = uuidv4();
  const { data: quizInsertData, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      title: title || quizJson.title,
      description: description || quizJson.description,
      creator_id: creator_id,
      visibility,
      password_hash: quiz_database_details.password_hash || null,
      type: type,
      category: category,
      difficulty,
      settings: settings,
      multimedia: quiz_database_details.multimedia || {},
      status,
      created_at: new Date().toISOString(),
      total_questions: quizJson.questions.length,
      estimated_time: estimatedTime,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  console.error("Error inserting quiz:", quizError);
  if (quizError) {
    throw quizError;
  }
  console.log("Inserted quiz");

  // 3. Insert questions
  const questionInserts = quizJson.questions.map((q: any) => ({
    quiz_id: quizInsertData.id,
    type: q.type,
    question_text: q.question,
    options: q.options,
    explanation: q.explanation || null,
    correct_answer: q.correct_answer,
    media_url: q.media_url || null,
    hint: q.hint || null,
    points: q.points || 1,
    difficulty: q.difficulty || "medium",
    order_index: q.quiz_id || 0,
    created_at: new Date().toISOString(),
  }));

  const { error: questionError } = await supabase
    .from("quiz_questions")
    .insert(questionInserts);

  if (questionError) {
    console.error("Error inserting questions:", questionError);
    throw questionError;
  }

  console.log("Inserted questions 2");

  if (category) {
    try {
      const embedding = await embedText(category);
      await supabase.from("quiz_embeddings").insert({
        quiz_id: quizInsertData.id,
        topic: category,
        embedding,
      });
    } catch (e) {
      console.warn("Failed to store embedding:", e);
    }
  }
  // 4. Save memory (optional)
  if (includeMemory) {
    const { error: memoryError } = await supabase
      .from("user_quiz_memory")
      .upsert({
        user_id: creator_id,
        topic: quiz_database_details.category,
        last_prompt: finalPrompt,
        last_response: JSON.stringify(quizJson),
        last_used_at: new Date().toISOString(),
      });
    if (memoryError) {
      console.warn("Failed to save memory:", memoryError);
    }
  }

//   if (fs.existsSync(pdfFile as string)) {
//   fs.unlink(pdfFile as string, (err) => {
//     if (err) {
//       console.error('An error occurred while deleting the file:', err);
//       return;
//     }
//     console.log('File has been successfully deleted.');
//   });
// } else {
//   console.log('File not found, nothing to delete.');
// }


  console.log("Memory saved if applicable");
  return {
    quizId,
    quiz: quizInsertData,
    questions: questionInserts,
  };
}
