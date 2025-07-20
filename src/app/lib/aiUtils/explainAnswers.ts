import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ExplainAnswerInput = {
  user_id: number;
  quiz_id: number;
  answers: {
    question_id: number;
    user_answer: string[]; // support multi-answer questions
  }[];
};

type ExplainAnswerOutput = {
  results: {
    question_id: number;
    is_correct: boolean;
    correct_answer: string[];
    explanation: string;
    feedback_message: string;
  }[];
};

export type { ExplainAnswerInput, ExplainAnswerOutput };

export async function explainAnswer(
  input: ExplainAnswerInput
): Promise<ExplainAnswerOutput> {
  const { user_id, quiz_id, answers } = input;

  try {
    // Get all relevant questions from the quiz
    const { data: questions, error } = await supabase
      .from("quiz_questions")
      .select("id, correct_answer, explanation")
      .eq("quiz_id", quiz_id);

    if (error || !questions) throw error;

    const results = answers.map(({ question_id, user_answer }) => {
      const question = questions.find((q) => q.id === question_id);

      if (!question) {
        return {
          question_id,
          is_correct: false,
          correct_answer: [],
          explanation: "Question not found.",
          feedback_message: "Error: Question not found.",
        };
      }

      const correct = question.correct_answer;
      const explanation = question.explanation || "";

      const is_correct =
        Array.isArray(correct) &&
        correct.length === user_answer.length &&
        correct.every((ans) => user_answer.includes(ans));

      const feedback_message = is_correct
        ? `✅ Correct! ${explanation}`
        : `❌ Incorrect. The correct answer is: ${correct.join(
            ", "
          )}. ${explanation}`;

      return {
        question_id,
        is_correct,
        correct_answer: correct,
        explanation,
        feedback_message,
      };
    });

    return { results };
  } catch (err) {
    console.error("Error explaining answers:", err);
    throw new Error("Failed to explain answers");
  }
}
