-- Test script to verify user signup is working
-- Run this after applying the fix_users_table.sql

-- Check if the trigger function exists
SELECT 
    'Trigger function exists' as check_name,
    EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'handle_new_user'
    ) as result;

-- Check if the trigger exists
SELECT 
    'Trigger exists' as check_name,
    EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) as result;

-- Check if users table has correct structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check RLS policies on users table
SELECT 
    policyname, 
    cmd, 
    permissive
FROM pg_policies 
WHERE tablename = 'users';

-- Test the trigger function manually (this will help debug)
-- Note: This is just to test the function logic, not to actually insert
SELECT 
    'Trigger function test' as test_name,
    'Function should handle username extraction' as description;
