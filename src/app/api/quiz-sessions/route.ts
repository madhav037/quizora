// CREATE TABLE public.quiz_sessions (
//   id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
//   uuid uuid DEFAULT uuid_generate_v4() UNIQUE,
//   quiz_id bigint NOT NULL,
//   host_id bigint NOT NULL,
//   started_at timestamp with time zone,
//   ended_at timestamp with time zone,
//   duration integer,
//   status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'cancelled'::text])),
//   session_settings jsonb DEFAULT '{}'::jsonb,
//   created_at timestamp with time zone DEFAULT now(),
//   CONSTRAINT quiz_sessions_pkey PRIMARY KEY (id),
//   CONSTRAINT quiz_sessions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id),
//   CONSTRAINT quiz_sessions_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.users(id)
// );

// fetch quiz sessions from the database for all sessions
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '@/app/lib/dbConnect';
const secretKey = process.env.SECRET_KEY as string;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('host_id', decoded.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error fetching quiz sessions', error });
    }

    return NextResponse.json({ status: 200, sessions: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

// post new quiz session
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
        .from('quiz_sessions')
        .insert({
            quiz_id: body.quiz_id,
            host_id: decoded.id,
            session_settings: body.session_settings || {},
        })
        .select('*')
        .single();
    
        if (error) {
        return NextResponse.json({ status: 500, message: 'Error creating quiz session', error });
        }
    
        return NextResponse.json({ status: 201, session: data });
    } catch (err) {
        return NextResponse.json({ status: 401, message: 'Invalid token' });
    }
    }


