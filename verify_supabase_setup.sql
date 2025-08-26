-- Verify Supabase Setup for Job Application Tracker
-- Run this in your Supabase SQL Editor to check if everything is configured correctly

-- Check if users table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
) as users_table_exists;

-- Check if job_applications table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'job_applications'
) as job_applications_table_exists;

-- Check if RLS is enabled on users table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Check if RLS is enabled on job_applications table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'job_applications';

-- Check RLS policies on users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- Check RLS policies on job_applications table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'job_applications';

-- Check if the trigger function exists
SELECT EXISTS (
    SELECT FROM pg_proc 
    WHERE proname = 'handle_new_user'
) as trigger_function_exists;

-- Check if the trigger exists
SELECT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
) as trigger_exists;

-- Check auth.users table structure (this should exist by default)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;
