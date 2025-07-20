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

// fetch quizzes from the database
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { supabase } from '@/app/lib/dbConnect';

export const GET = async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Get_quizzes',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASEKEY!) as { id: number };

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('creator_id', decoded.id);

    if (error) {
      return NextResponse.json({
        status: 500,
        message: 'Error fetching quizzes',
        error,
        function_name: 'Get_quizzes',
      });
    }

    return NextResponse.json({
      status: 200,
      quizzes: data,
      function_name: 'Get_quizzes',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Get_quizzes',
    });
  }
};

// first check user role is creator then post new quiz
export const POST = async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  console.log(token);
  
  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Create_quiz',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };
    const { quiz, questions } = await req.json();

    // console.log(quiz);
    console.log(questions);
    

    // check user role is creator
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', decoded.id)
      .single();

    if (userError || !user || user.role !== 'creator') {
      return NextResponse.json({
        status: 403,
        message: 'Forbidden: User is not a creator',
        function_name: 'Create_quiz',
      });
      return NextResponse.json({
        status: 403,
        message: 'Forbidden: User is not a creator',
        function_name: 'Create_quiz',
      });
    }


    const { data: quizData, error: quizError } = await supabase

    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        ...quiz,
        ...quiz,
        creator_id: decoded.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (quizError) {
    if (quizError) {
      return NextResponse.json({
        status: 500,
        message: 'Error creating quiz',
        error: quizError,
        function_name: 'Create_quiz',
      });
    }

    // remove id from questions
    questions.forEach((q: any) => {
      delete q.id;
      q.quiz_id = quizData.id; // associate question with the created quiz
    });

    const { data: questionsData, error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questions.map((q:any) => ({
        ...q,
        quiz_id: quizData.id,
      })))
      .select();

    if (questionsError) {
      console.log(questionsError);
      
      return NextResponse.json({
        status: 500,
        message: 'Error creating questions',
        error: questionsError,
        function_name: 'Create_quiz',
      });
    }

    return NextResponse.json({
      status: 201,
      quiz: questionsData,
      quiz: questionsData,
      function_name: 'Create_quiz',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Create_quiz',
    });
  }
};



export const PUT = async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Update_quiz',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASEKEY!) as { id: number };
    const body = await req.json();

    const { data, error } = await supabase
      .from('quizzes')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        status: 500,
        message: 'Error updating quiz',
        error,
        function_name: 'Update_quiz',
      });
    }

    return NextResponse.json({
      status: 200,
      quiz: data,
      function_name: 'Update_quiz',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Update_quiz',
    });
  }
};

export const DELETE = async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Delete_quiz',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASEKEY!) as { id: number };
    const body = await req.json();

    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', body.id)
      .eq('creator_id', decoded.id);

    if (error) {
      return NextResponse.json({
        status: 500,
        message: 'Error deleting quiz',
        error,
        function_name: 'Delete_quiz',
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Quiz deleted successfully',
      function_name: 'Delete_quiz',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Delete_quiz',
    });
  }
};
