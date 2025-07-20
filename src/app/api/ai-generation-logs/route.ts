//CREATE TABLE public.ai_generation_logs (
//   id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
//   uuid uuid DEFAULT uuid_generate_v4() UNIQUE,
//   user_id bigint NOT NULL,
//   prompt text NOT NULL,
//   model text,
//   tokens_used integer,
//   result jsonb,
//   status text CHECK (status = ANY (ARRAY['success'::text, 'partial'::text, 'failed'::text])),
//   created_at timestamp with time zone DEFAULT now(),
//   CONSTRAINT ai_generation_logs_pkey PRIMARY KEY (id),
//   CONSTRAINT ai_generation_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
// );

//for this schema, we will create a route to fetch AI generation logs

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
      function_name: 'Get_ai_generation_logs',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };

    const { data, error } = await supabase
      .from('ai_generation_logs')
      .select('*')
      .eq('user_id', decoded.id);

    if (error) {
      return NextResponse.json({
        status: 500,
        message: 'Error fetching AI generation logs',
        error,
        function_name: 'Get_ai_generation_logs',
      });
    }

    return NextResponse.json({
      status: 200,
      logs: data,
      function_name: 'Get_ai_generation_logs',
    });
  } catch (err) {
    return NextResponse.json({
      status: 401,
      message: 'Invalid token',
      function_name: 'Get_ai_generation_logs',
    });
  }
};

// post request to create a new AI generation log
export const POST = async (req: Request) => {

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
        return NextResponse.json({
        status: 401,
        message: 'Unauthorized: No token',
        function_name: 'Create_ai_generation_log',
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };
        const { prompt, model, tokens_used, result, status } = await req.json();
    
        if (!prompt || !status) {
        return NextResponse.json({
            status: 400,
            message: 'Missing required fields',
            function_name: 'Create_ai_generation_log',
        });
        }
    
        const { data, error } = await supabase
        .from('ai_generation_logs')
        .insert({
            user_id: decoded.id,
            prompt,
            model,
            tokens_used,
            result,
            status,
        })
        .select()
        .single();
    
        if (error) {
        return NextResponse.json({
            status: 500,
            message: 'Error inserting AI generation log',
            error,
            function_name: 'Create_ai_generation_log',
        });
        }
    
        return NextResponse.json({
        status: 200,
        message: 'AI generation log created successfully',
        log: data,
        function_name: 'Create_ai_generation_log',
        });
    } catch (err) {
        return NextResponse.json({
        status: 401,
        message: 'Invalid token',
        function_name: 'Create_ai_generation_log',
        });
    }
    }

// put request to update an AI generation log
export const PUT = async (req: Request) => {

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({
            status: 401,
            message: 'Unauthorized: No token',
            function_name: 'Update_ai_generation_log',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { id: number };
        const { id, prompt, model, tokens_used, result, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({
                status: 400,
                message: 'Missing required fields',
                function_name: 'Update_ai_generation_log',
            });
        }

        const { data, error } = await supabase
            .from('ai_generation_logs')
            .update({
                prompt,
                model,
                tokens_used,
                result,
                status,
            })
            .eq('id', id)
            .eq('user_id', decoded.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({
                status: 500,
                message: 'Error updating AI generation log',
                error,
                function_name: 'Update_ai_generation_log',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'AI generation log updated successfully',
            log: data,
            function_name: 'Update_ai_generation_log',
        });
    } catch (err) {
        return NextResponse.json({
            status: 401,
            message: 'Invalid token',
            function_name: 'Update_ai_generation_log',
        });
    }
}