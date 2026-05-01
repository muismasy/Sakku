import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl.includes('placeholder')) {
  console.warn("⚠️ Using Supabase Placeholder URL. Database features will not work.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
