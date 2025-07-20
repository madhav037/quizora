import { createClient } from '@supabase/supabase-js';
import { cosineSimilarity, embedText } from './embeddingUtils';
import { summarizeFeedback } from './summarizer';
import dotenv from 'dotenv';

console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getFeedbackSummaryByTopic(topic: string): Promise<string> {
  const topicEmbedding = await embedText(topic);

  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('quiz_id, topic, embedding')
    .not('embedding', 'is', null);

  if (error || !quizzes) return "Failed to fetch quizzes.";

  const ranked = quizzes.map(q => ({
    quiz_id: q.quiz_id,
    similarity: cosineSimilarity(topicEmbedding, q.embedding),
  }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  const topQuizIds = ranked.map(q => q.quiz_id);

  const { data: feedbacks, error: fbError } = await supabase
    .from('feedback')
    .select('rating, text_feedback')
    .in('quiz_id', topQuizIds);

  if (fbError || !feedbacks || feedbacks.length === 0) {
    return "No relevant feedback found.";
  }

  const validTexts = feedbacks.map(f => f.text_feedback).filter(Boolean);
  const summary = await summarizeFeedback(validTexts);

  const avgRating = feedbacks
    .map(f => f.rating)
    .filter(r => typeof r === 'number')
    .reduce((a, b) => a + b, 0) / feedbacks.length;

  return `Feedback Summary (Avg Rating: ${avgRating.toFixed(1)}): ${summary}`;
}
