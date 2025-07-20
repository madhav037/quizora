import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// console.log('Supabase URL:', supabaseUrl);
// console.log('Supabase Anon Key:', supabaseAnonKey);
// console.log('Supabase Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side client for API routes
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey! 
);