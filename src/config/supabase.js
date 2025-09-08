import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Fail fast if not set (only for dev safety)
if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please define REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(url, anonKey);
