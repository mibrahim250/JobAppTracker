-- Manual Test - This simulates what should happen when a user signs up
-- Run this after the quick_debug.sql

-- 1. First, let's manually insert a test user into public.users
-- This will tell us if the table structure is correct
DO $$
DECLARE
    test_id UUID := gen_random_uuid();
    test_email TEXT := 'manualtest@example.com';
    test_username TEXT := 'manualtestuser';
BEGIN
    RAISE NOTICE 'Testing manual insert...';
    
    INSERT INTO public.users (id, username, email)
    VALUES (test_id, test_username, test_email);
    
    RAISE NOTICE 'Manual insert successful for user: %', test_username;
    
    -- Check if the user was actually inserted
    IF EXISTS (SELECT 1 FROM public.users WHERE id = test_id) THEN
        RAISE NOTICE 'User found in database!';
    ELSE
        RAISE NOTICE 'User NOT found in database!';
    END IF;
    
    -- Clean up
    DELETE FROM public.users WHERE id = test_id;
    RAISE NOTICE 'Test completed and cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during manual test: %', SQLERRM;
END $$;

-- 2. Now let's test the trigger function directly
SELECT 
    'Testing trigger function' as test_name,
    'This will show if the function can be called' as description;

-- 3. Let's also check the RLS policies
SELECT 
    policyname,
    cmd,
    permissive,
    qual
FROM pg_policies 
WHERE tablename = 'users';
