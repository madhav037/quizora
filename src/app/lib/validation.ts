import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['participant', 'creator', 'admin']).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional(),
  role: z.enum(['participant', 'creator', 'admin']).optional(),
});

// Quiz schemas
export const createQuizSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['public', 'private', 'password']).default('public'),
  password: z.string().optional(),
  timer_per_question: z.number().min(10).max(300).default(30),
  randomize_questions: z.boolean().default(false),
});

export const updateQuizSchema = createQuizSchema.partial();

// Question schemas
export const createQuestionSchema = z.object({
  quiz_id: z.string().uuid(),
  question: z.string().min(1).max(1000),
  type: z.enum(['multiple_choice', 'true_false', 'short_answer']).default('multiple_choice'),
  options: z.array(z.string()).min(2).max(6),
  correct_answer: z.string().min(1),
  explanation: z.string().max(500).optional(),
  points: z.number().min(1).max(10).default(1),
  order_index: z.number().min(0),
});

export const updateQuestionSchema = createQuestionSchema.partial().omit({ quiz_id: true });

// Session schemas
export const createSessionSchema = z.object({
  quiz_id: z.string().uuid(),
});

export const joinSessionSchema = z.object({
  session_id: z.string().uuid(),
  password: z.string().optional(),
});

// Answer schemas
export const submitAnswerSchema = z.object({
  session_id: z.string().uuid(),
  question_id: z.string().uuid(),
  answer: z.string().min(1),
  response_time: z.number().min(0),
});

// Report schemas
export const reportQuizSchema = z.object({
  quiz_id: z.string().uuid(),
  reason: z.enum(['inappropriate', 'spam', 'copyright', 'other']),
  description: z.string().max(500).optional(),
});

// Validation helper
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation error: ${result.error.message}`);
  }
  return result.data;
}