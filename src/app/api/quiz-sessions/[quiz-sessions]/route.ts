import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '@/app/lib/dbConnect';
const secretKey = process.env.SECRET_KEY as string;

export async function GET(req: Request, { params }: { params: { quizId: string } }) {
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
      .eq('quiz_id', params.quizId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error fetching quiz sessions', error });
    }

    return NextResponse.json({ status: 200, sessions: data });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

export async function DELETE(req: Request, { params }: { params: { sessionId: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ status: 401, message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: number };

    const { error } = await supabase
      .from('quiz_sessions')
      .delete()
      .eq('uuid', params.sessionId)
      .eq('user_id', decoded.id);

    if (error) {
      return NextResponse.json({ status: 500, message: 'Error deleting quiz session', error });
    }

    return NextResponse.json({ status: 200, message: 'Session deleted successfully' });
  } catch (err) {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}

