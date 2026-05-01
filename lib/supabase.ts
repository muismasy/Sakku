import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create a real client if URL starts with https://
const isValidConfig = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;

if (!isValidConfig) {
  console.warn("⚠️ Supabase credentials missing or invalid. Database features will not work.");
}

// Use a real-looking dummy URL for build safety when credentials are missing
export const supabase: SupabaseClient = createClient(
  isValidConfig ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isValidConfig ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.dummykey',
  isValidConfig ? undefined : { auth: { persistSession: false, autoRefreshToken: false } }
);
