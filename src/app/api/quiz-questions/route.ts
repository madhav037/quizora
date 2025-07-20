// CREATE TABLE public.quiz_questions (
//   id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
//   uuid uuid DEFAULT uuid_generate_v4() UNIQUE,
//   quiz_id bigint NOT NULL,
//   type text NOT NULL CHECK (type = ANY (ARRAY['mcq'::text, 'true_false'::text, 'open_ended'::text])),
//   question_text text NOT NULL,
//   options jsonb,
//   correct_answer jsonb NOT NULL,
//   explanation text,
//   media_url text,
//   hint text,
//   points integer DEFAULT 1 CHECK (points > 0),
//   difficulty text CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])),
//   order_index integer,
//   created_at timestamp with time zone DEFAULT now(),
//   CONSTRAINT quiz_questions_pkey PRIMARY KEY (id),
//   CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
// );

// ftech quiz questions from the database for specific quiz

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '@/app/lib/dbConnect';
const secretKey = process.env.SUPABASEKEY as string;

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', params.code)
      .order('order_index', { ascending: true });

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error fetching quiz questions', error });
    }

    return NextResponse.json({ status: 200, questions: data });
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
    const decoded = jwt.verify(token, process.env.SUPABASEKEY!) as { id: number };
    const body = await req.json();
    const { questions } = body;

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ status: 400, message: 'Questions array is required' });
    }

    // Insert all questions
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(questions.map(q => ({
        ...q,
        created_at: new Date().toISOString(),
      })))
      .select();

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error creating quiz questions', error });
    }

    return NextResponse.json({ status: 201, questions: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

export async function DELETE(req: Request, { params }: { params: { questionId: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASEKEY!) as { id: number };

    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('uuid', params.questionId)
      .eq('quiz_id', decoded.id);

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error deleting quiz question', error });
    }

    return NextResponse.json({ status: 200, message: 'Question deleted successfully' });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}