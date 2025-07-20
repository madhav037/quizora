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
const secretKey = process.env.SECRET_KEY as string;

//fetch quiz question by id
export async function GET(req: Request, { params }: { params: { id: string } }) {
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
      .eq('quiz_id', params)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: 404, message: 'Question not found', error });
    }

    return NextResponse.json({ status: 200, question: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

// post new quiz question 
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
      .from('quiz_questions')
      .insert({
        quiz_id: body.quiz_id,
        type: body.type,
        question_text: body.question_text,
        options: body.options,
        correct_answer: body.correct_answer,
        explanation: body.explanation,
        media_url: body.media_url,
        hint: body.hint,
        points: body.points,
        difficulty: body.difficulty,
        order_index: body.order_index,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error creating question', error });
    }

    return NextResponse.json({ status: 201, question: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

// delete quiz question by id
export async function DELETE(req: Request, { params }: { params: { questionId: string
} }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('uuid', params.questionId)
      .eq('quiz_id', decoded.id);

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error deleting question', error });
    }

    return NextResponse.json({ status: 200, message: 'Question deleted successfully' });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

// update quiz question by id
export async function PUT(req: Request, { params }: { params: { questionId: string
} }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };
    const body = await req.json();

    const { data, error } = await supabase
      .from('quiz_questions')
      .update({
        type: body.type,
        question_text: body.question_text,
        options: body.options,
        correct_answer: body.correct_answer,
        explanation: body.explanation,
        media_url: body.media_url,
        hint: body.hint,
        points: body.points,
        difficulty: body.difficulty,
        order_index: body.order_index,
      })
      .eq('uuid', params.questionId)
      .eq('quiz_id', decoded.id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json({ status: 500, message: 'Error updating question', error });
    }

    return NextResponse.json({ status: 200, question: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}