import { createClient } from '@supabase/supabase-js';

// Use CRA environment variables
const url = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug: Log what we're getting
console.log('Environment variables:', {
  REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? '***SET***' : 'NOT SET'
});

// Fallback values (using the correct URL you provided)
const fallbackUrl = 'https://vigsbugdoluldgwcqkac.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ3NidWdkb2x1bGRnd2Nxa2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzcwMTEsImV4cCI6MjA3MTMxMzAxMX0.A_j3X2kLCVOjuj1yKgXojXtNKLD8-cmMJvYZpt7_ciI';

// Use fallback if env vars are not set
const finalUrl = url || fallbackUrl;
const finalKey = anonKey || fallbackKey;

if (!url || !anonKey) {
  console.warn('Using fallback Supabase credentials. Create a .env file with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY for production.');
}

export const supabase = createClient(finalUrl, finalKey);
