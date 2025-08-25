import { createClient } from '@supabase/supabase-js';

// You'll need to replace these with your actual Supabase URL and anon key
// Get these from your Supabase project settings
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
