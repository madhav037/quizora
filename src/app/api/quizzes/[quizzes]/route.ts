// CREATE TABLE public.quizzes (
//   id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
//   uuid uuid DEFAULT uuid_generate_v4() UNIQUE,
//   title text NOT NULL,
//   description text,
//   creator_id bigint NOT NULL,
//   visibility text DEFAULT 'public'::text CHECK (visibility = ANY (ARRAY['public'::text, 'private'::text, 'password'::text])),
//   password_hash text,
//   type text NOT NULL CHECK (type = ANY (ARRAY['manual'::text, 'ai_generated'::text])),
//   category text,
//   difficulty text CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])),
//   settings jsonb DEFAULT '{}'::jsonb,
//   multimedia jsonb DEFAULT '{}'::jsonb,
//   status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])),
//   total_questions integer DEFAULT 0,
//   estimated_time integer,
//   created_at timestamp with time zone DEFAULT now(),
//   updated_at timestamp with time zone DEFAULT now(),
//   CONSTRAINT quizzes_pkey PRIMARY KEY (id),
//   CONSTRAINT quizzes_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id)
// );

// fetch by id quizzes from the database
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import { cookies } from 'next/headers';
import { supabase } from '@/app/lib/dbConnect';

export const GET = async (req: Request, { params }: { params: { quizzes: string } }) => {
  console.log("HELLO");
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
console.log(params.quizzes);

  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Get_quiz_by_id',
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('uuid', params.quizzes)
      .eq('creator_id', decoded.id)
      .single();
    if (error || !data) {
      return NextResponse.json({
        status: 404,
        message: 'Quiz not found',
        error,
        function_name: 'Get_quiz_by_id',
      });
    }

    // get user 
    // get all question with quiz id
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', data.id);

    if (questionsError) {
      return NextResponse.json({
        status: 500,
        message: 'Error fetching questions',
        error: questionsError,
        function_name: 'Get_quiz_by_id',
      });
    }

    const quizWithQuestions = {
      ...data,
      questions: questions || [],
    };
    console.log("Quiz with questions:", quizWithQuestions);
    
    return NextResponse.json({
      status: 200,
      quiz: quizWithQuestions,
      function_name: 'Get_quiz_by_id',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Get_quiz_by_id',
    });
    }
}

// delete quiz by id

export const DELETE = async (req: Request, { params }: { params: { quizzes: string } }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Delete_quiz_by_id',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };

    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('uuid', params.quizzes)
      .eq('creator_id', decoded.id);

    if (error) {
      return NextResponse.json({
        status: 500,
        message: 'Error deleting quiz',
        error,
        function_name: 'Delete_quiz_by_id',
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Quiz deleted successfully',
      function_name: 'Delete_quiz_by_id',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Delete_quiz_by_id',
    });
    }
}