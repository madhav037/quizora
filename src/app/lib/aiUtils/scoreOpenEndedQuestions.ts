import { GoogleGenerativeAI } from "@google/generative-ai";

export async function scoreOpenEndedQuestions(
  question: string,
  user_answer: string,
  expected_answer: string[],
  score: number,
  model: string = "gemini-2.5-pro"
): Promise<number> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const response = await model.generateContent(
      `Score the following answer to the question based on its relevance and correctness:\n\nQuestion: ${question}\nUser Answer: ${user_answer}\nExpected Answer: ${expected_answer.join(", ")}\nTotal Score: ${score}`);

    const generatedText = response.response.text();
    const parsedScore = parseFloat(generatedText);

    if (isNaN(parsedScore)) {
      throw new Error("Failed to parse score from response");
    }

    return parsedScore;
  } catch (error) {
    console.error("Error scoring open-ended question:", error);
    throw error;
  }
}
