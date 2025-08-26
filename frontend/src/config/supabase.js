import { createClient } from '@supabase/supabase-js';

// Your actual Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vigsbugdoluldgwcqkac.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ3NidWdkb2x1bGRnd2Nxa2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzcwMTEsImV4cCI6MjA3MTMxMzAxMX0.A_j3X2kLCVOjuj1yKgXojXtNKL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
