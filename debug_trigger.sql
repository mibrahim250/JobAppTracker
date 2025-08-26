-- Debug script to check why users aren't being added
-- Run this in Supabase SQL Editor

-- 1. Check if the trigger function exists and is correct
SELECT 
    proname as function_name,
    prosrc as function_source
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 2. Check if the trigger exists
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgtype,
    tgenabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 3. Check if there are any users in auth.users table
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check if the users table structure is correct
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 5. Check RLS policies
SELECT 
    policyname, 
    cmd, 
    permissive,
    qual
FROM pg_policies 
WHERE tablename = 'users';

-- 6. Test the trigger function manually with sample data
-- This will help us see if the function works
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test@example.com';
    test_username TEXT := 'testuser';
BEGIN
    -- Simulate what the trigger should do
    INSERT INTO public.users (id, username, email)
    VALUES (test_user_id, test_username, test_email);
    
    RAISE NOTICE 'Test insert successful for user: %', test_username;
    
    -- Clean up test data
    DELETE FROM public.users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test completed successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during test: %', SQLERRM;
END $$;
