import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function summarizeFeedback(feedbacks: string[]): Promise<string> {
  if (!feedbacks || feedbacks.length === 0) return "No feedback available.";

  const combined = feedbacks.join("\n");
  const prompt = `
You are summarizing user feedback for a quiz. Identify common suggestions or complaints.
Only return helpful insights. Ignore toxic, sarcastic, or meaningless feedback.
Feedback:
${combined}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
