import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export interface AuthUser {
  id: string;
  email: string;
  role: 'participant' | 'creator' | 'admin';
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return null;
    }

    // Get user profile with role
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', session.user.id)
      .single();

    if (profileError || !userProfile) {
      return null;
    }

    return {
      id: userProfile.id,
      email: userProfile.email,
      role: userProfile.role as 'participant' | 'creator' | 'admin'
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function requireAuth(allowedRoles?: ('participant' | 'creator' | 'admin')[]) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request);
    
    if (!user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return Response.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return user;
  };
}