import { createClient } from '@supabase/supabase-js';

// Use placeholder values during build if env vars are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Client-side Supabase client (with anon key)
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Server-side Supabase client (with service role key) - for API routes only
export function getServiceSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY - required for API routes');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
