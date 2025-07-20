import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import { cookies } from 'next/headers';
import { supabase } from '@/app/lib/dbConnect';
import { Database } from '../../../../../types/database';

export const POST = async (req: Request) => {
    
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({
      status: 400,
      message: 'Missing required fields',
      function_name: 'Login_user',
    });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return NextResponse.json({
      status: 400,
      message: 'User not found',
      function_name: 'Login_user',
    });
  }

  const passwordMatch = await compare(password, user.password_hash);

  if (!passwordMatch) {
    return NextResponse.json({
      status: 400,
      message: 'Incorrect password',
      function_name: 'Login_user',
    });
  }

  const secretKey = process.env.SECRET_KEY!;
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secretKey,
    { expiresIn: '1d' }
  );

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    maxAge: 24 * 60 * 60,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  return NextResponse.json({
    status: 200,
    message: 'Login successful',
    function_name: 'Login_user',
  });
};
