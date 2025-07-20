import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { supabase } from '@/app/lib/dbConnect';

export const GET = async (req: Request) => {
  const cookieStore = await cookies();

  try {

    const { data, error } = await supabase
      .from('quizzes')
      .select('*');

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