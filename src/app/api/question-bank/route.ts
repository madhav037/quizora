// CREATE TABLE public.question_bank (
//   id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
//   uuid uuid DEFAULT uuid_generate_v4() UNIQUE,
//   creator_id bigint NOT NULL,
//   question_text text NOT NULL,
//   type text NOT NULL CHECK (type = ANY (ARRAY['mcq'::text, 'true_false'::text, 'open_ended'::text])),
//   options jsonb,
//   correct_answer jsonb NOT NULL,
//   media_url text,
//   hint text,
//   explanation text,
//   points integer DEFAULT 1 CHECK (points > 0),
//   difficulty text CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])),
//   tags ARRAY,
//   created_at timestamp with time zone DEFAULT now(),
//   CONSTRAINT question_bank_pkey PRIMARY KEY (id),
//   CONSTRAINT question_bank_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id)
// );

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '@/app/lib/dbConnect';

// Fetch all questions from the question bank
export const GET = async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Get_question_bank',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };

    const { data, error } = await supabase
      .from('question_bank')
      .select('*')
      .eq('creator_id', decoded.id);

    if (error) {
      return NextResponse.json({
        status: 500,
        message: 'Error fetching questions',
        error,
        function_name: 'Get_question_bank',
      });
    }

    return NextResponse.json({
      status: 200,
      questions: data,
      function_name: 'Get_question_bank',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Get_question_bank',
    });
  }
};

// Add a new question to the question bank
export const POST = async (req: Request) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
        return NextResponse.json({
        status: 401,
        message: 'Unauthorized: No token',
        function_name: 'Add_question_to_bank',
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };
        const body = await req.json();
    
        const { data, error } = await supabase
        .from('question_bank')
        .insert({
            ...body,
            creator_id: decoded.id,
        })
        .select('*')
        .single();
    
        if (error) {
        return NextResponse.json({
            status: 500,
            message: 'Error adding question',
            error,
            function_name: 'Add_question_to_bank',
        });
        }
    
        return NextResponse.json({
        status: 201,
        question: data,
        function_name: 'Add_question_to_bank',
        });
    } catch (err) {
        return NextResponse.json({
        status: 401,
        message: 'Invalid token',
        function_name: 'Add_question_to_bank',
        });
    }
    }

// Delete a question from the question bank
export const DELETE = async (req: Request, { params }: { params: { questionId
: string } }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Delete_question_from_bank',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };

    const { error } = await supabase
      .from('question_bank')
      .delete()
      .eq('uuid', params.questionId)
      .eq('creator_id', decoded.id);

    if (error) {
      return NextResponse.json({
        status: 500,
        message: 'Error deleting question',
        error,
        function_name: 'Delete_question_from_bank',
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Question deleted successfully',
      function_name: 'Delete_question_from_bank',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Delete_question_from_bank',
    });
  }
}

// Update a question in the question bank
export const PUT = async (req: Request, { params }: { params: { questionId
: string } }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({
      status: 401,
      message: 'Unauthorized: No token',
      function_name: 'Update_question_in_bank',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };
    const body = await req.json();

    const { data, error } = await supabase
      .from('question_bank')
      .update(body)
      .eq('uuid', params.questionId)
      .eq('creator_id', decoded.id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({
        status: 500,
        message: 'Error updating question',
        error,
        function_name: 'Update_question_in_bank',
      });
    }

    return NextResponse.json({
      status: 200,
      question: data,
      function_name: 'Update_question_in_bank',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Update_question_in_bank',
    });
  }
}