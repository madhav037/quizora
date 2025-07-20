import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { supabase } from '@/app/lib/dbConnect';

export const POST = async (req: NextRequest) => {
  const { email, password, name, role, phone } = await req.json();

  if (!email || !password || !name || !role || !phone) {
    return NextResponse.json({
      status: 400,
      message: 'Missing required fields',
      function_name: 'Signup_user',
    });
  }

  const passwordHash = await hash(password, 10);

  const { data, error } = await supabase.from('users').insert([
    {
      email : email,
      password_hash: passwordHash,
      name : name,
      role : role,
      phone_number: phone,
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({
      status: 500,
      message: 'Error inserting user',
      error,
      function_name: 'Signup_user',
    });
  }

  return NextResponse.json({
    status: 200,
    message: 'Signup successful',
    user: data,
    function_name: 'Signup_user',
  });
};
