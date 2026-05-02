import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!rawUrl || rawUrl.includes('your_supabase')) {
  console.warn("⚠️ Supabase URL is not configured. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
