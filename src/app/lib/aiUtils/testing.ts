import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// dotenv.config();

export async function validatePrompt(prompt: string): Promise<boolean> {
  if (!prompt || prompt.trim().length === 0) {
    console.error("Invalid prompt: Prompt is empty");
    return false;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const response =
    await model.generateContent(`
      You are a quiz generation validation agent. Your task is to determine if the provided prompt is related to creating a quiz.
      If the prompt is related to creating a quiz, respond with "yes". If it is not related to creating a quiz or any random prompt then, respond with "no".
      Prompt: "${prompt}"`);
  const result = response.response.text();

  if (result.trim().toLowerCase() === "yes") {
    return true;
  } else {
    console.error("Invalid prompt: Not related to creating a quiz");
    return false;
  }
}
