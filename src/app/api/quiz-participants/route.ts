// CREATE TABLE public.quiz_participants (
//   session_id bigint NOT NULL,
//   user_id bigint NOT NULL,
//   score integer DEFAULT 0,
//   correct_count integer DEFAULT 0,
//   total_questions integer DEFAULT 0,
//   average_time real,
//   completed boolean DEFAULT false,
//   started_at timestamp with time zone DEFAULT now(),
//   completed_at timestamp with time zone,
//   CONSTRAINT quiz_participants_pkey PRIMARY KEY (session_id, user_id),
//   CONSTRAINT quiz_participants_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.quiz_sessions(id),
//   CONSTRAINT quiz_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
// );

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '@/app/lib/dbConnect';
const secretKey = process.env.SECRET_KEY as string;

// Fetch quiz participants for a specific session
export async function GET(req: Request, { params }: { params: { sessionId: string
} }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const { data, error } = await supabase
      .from('quiz_participants')
      .select('*')
      .eq('session_id', params.sessionId);

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error fetching participants', error });
    }

    return NextResponse.json({ status: 200, participants: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}