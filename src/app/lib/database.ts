import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export function createSupabaseClient() {
  return createRouteHandlerClient<Database>({ cookies });
}

export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export async function handleDatabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await operation();
    
    if (error) {
      console.error('Database error:', error);
      throw new DatabaseError(error.message, error.code);
    }
    
    if (!data) {
      throw new DatabaseError('No data returned');
    }
    
    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    console.error('Unexpected database error:', error);
    throw new DatabaseError('Database operation failed');
  }
}