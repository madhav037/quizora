// CREATE TABLE public.quiz_answers (
//   session_id bigint NOT NULL,
//   user_id bigint NOT NULL,
//   question_id bigint NOT NULL,
//   selected_answer jsonb,
//   is_correct boolean,
//   response_time real,
//   answered_at timestamp with time zone DEFAULT now(),
//   CONSTRAINT quiz_answers_pkey PRIMARY KEY (session_id, user_id, question_id),
//   CONSTRAINT quiz_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id),
//   CONSTRAINT quiz_answers_session_id_user_id_fkey FOREIGN KEY (session_id) REFERENCES public.quiz_participants(session_id),
//   CONSTRAINT quiz_answers_session_id_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.quiz_participants(session_id),
//   CONSTRAINT quiz_answers_session_id_user_id_fkey FOREIGN KEY (session_id) REFERENCES public.quiz_participants(user_id),
//   CONSTRAINT quiz_answers_session_id_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.quiz_participants(user_id)
// );

// fetch quiz answers from the database for a specific session and user
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '@/app/lib/dbConnect';

export const GET = async (req: Request, { params }: { params: { sessionId: string, userId: string } }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };

    const { data, error } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('session_id', params.sessionId)
      .eq('user_id', params.userId);

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error fetching quiz answers', error });
    }

    return NextResponse.json({ status: 200, answers: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
};

// delete quiz answers by session and user
export const DELETE = async (req: Request, { params }: { params: { sessionId
: string, userId: string } }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };

    const { error } = await supabase
      .from('quiz_answers')
      .delete()
      .eq('session_id', params.sessionId)
      .eq('user_id', params.userId);

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error deleting quiz answers', error });
    }

    return NextResponse.json({ status: 200, message: 'Quiz answers deleted successfully' });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

// upate quiz answers for a specific session and user
export const PUT = async (req: Request, { params }: { params: { sessionId
: string, userId: string } }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };
    const body = await req.json();

    const { data, error } = await supabase
      .from('quiz_answers')
      .update(body)
      .eq('session_id', params.sessionId)
      .eq('user_id', params.userId)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error updating quiz answers', error });
    }

    return NextResponse.json({ status: 200, answer: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}