// CREATE TABLE public.analytics_quiz (
//   quiz_id bigint NOT NULL,
//   total_attempts integer DEFAULT 0,
//   unique_participants integer DEFAULT 0,
//   avg_score real,
//   avg_completion_time real,
//   highest_score integer,
//   lowest_score integer,
//   engagement jsonb DEFAULT '{}'::jsonb,
//   last_analyzed timestamp with time zone DEFAULT now(),
//   CONSTRAINT analytics_quiz_pkey PRIMARY KEY (quiz_id),
//   CONSTRAINT analytics_quiz_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
// );

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '@/app/lib/dbConnect';
const secretKey = process.env.SECRET_KEY as string;

// Fetch analytics for a specific quiz
export async function GET(req: Request, { params }: { params: { quizId: string
} }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const { data, error } = await supabase
      .from('analytics_quiz')
      .select('*')
      .eq('quiz_id', params.quizId)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: 404, message: 'Analytics not found', error });
    }

    return NextResponse.json({ status: 200, analytics: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };
    const body = await req.json();

    const { data, error } = await supabase
      .from('analytics_quiz')
      .insert({
        quiz_id: body.quiz_id,
        total_attempts: body.total_attempts || 0,
        unique_participants: body.unique_participants || 0,
        avg_score: body.avg_score || null,
        avg_completion_time: body.avg_completion_time || null,
        highest_score: body.highest_score || null,
        lowest_score: body.lowest_score || null,
        engagement: body.engagement || {},
      });

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error creating analytics', error });
    }

    return NextResponse.json({ status: 201, analytics: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

