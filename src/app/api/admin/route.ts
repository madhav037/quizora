import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '@/app/lib/dbConnect';

const secretKey = process.env.SECRET_KEY as string;

export async function GET() {
  console.log("HEllo");
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const { data, error } = await supabase
      .from('users')
      .select(
        `id, uuid, email, phone_number, name, avatar_url, bio, role, email_verified, last_login, privacy, created_at, updated_at`
      )
      .eq('id', decoded.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: 404, message: 'User not found', error });
    }

    // console.log(data);

    return NextResponse.json({ status: 200, user: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

// PUT /api/profile
export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  console.log(cookieStore);
  console.log(token);
  
  

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };
    const body = await req.json();
    console.log(body);
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', decoded.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: 400, message: 'Update failed', error });
    }

    return NextResponse.json({ status: 200, message: 'Profile updated', user: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', decoded.id);

    if (error) {
      return NextResponse.json({ status: 500, message: 'Failed to delete user', error });
    }

    // Clear token cookie
    cookieStore.set('token', '', {
      maxAge: 0,
      path: '/',
    });

    return NextResponse.json({ status: 200, message: 'User deleted successfully' });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}
