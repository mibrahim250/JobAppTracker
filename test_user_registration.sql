-- Test User Registration Process
-- This script helps you test if user registration is working

-- 1. First, let's check the current state
SELECT 
    '=== CURRENT STATE ===' as section,
    (SELECT COUNT(*) FROM auth.users) as auth_users,
    (SELECT COUNT(*) FROM public.users) as public_users;

-- 2. Check if setup is complete
SELECT 
    '=== SETUP CHECK ===' as section;

SELECT 
    'Tables:' as check_type,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN '✓ users table exists' ELSE '✗ users table missing' END as status
UNION ALL
SELECT 
    'Triggers:' as check_type,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_schema = 'public' AND trigger_name = 'on_auth_user_created') THEN '✓ trigger exists' ELSE '✗ trigger missing' END as status
UNION ALL
SELECT 
    'Functions:' as check_type,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'handle_new_user') THEN '✓ function exists' ELSE '✗ function missing' END as status;

-- 3. Manual test: Create a test user in auth.users (simulates signup)
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT := 'test@example.com';
BEGIN
    -- Check if test user already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = test_email) THEN
        RAISE NOTICE 'Test user already exists: %', test_email;
    ELSE
        -- Create a test user in auth.users (this simulates what happens during signup)
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_user_meta_data
        ) VALUES (
            gen_random_uuid(),
            test_email,
            crypt('testpassword123', gen_salt('bf')),
            NULL, -- Not verified yet
            NOW(),
            NOW(),
            '{"username": "testuser"}'::jsonb
        ) RETURNING id INTO test_user_id;
        
        RAISE NOTICE 'Created test user: % (ID: %)', test_email, test_user_id;
    END IF;
END $$;

-- 4. Check if the trigger worked
SELECT 
    '=== TRIGGER TEST ===' as section;

SELECT 
    'Auth users after test:' as check_type,
    COUNT(*) as count
FROM auth.users
WHERE email = 'test@example.com';

SELECT 
    'Public users after test:' as check_type,
    COUNT(*) as count
FROM public.users
WHERE email = 'test@example.com';

-- 5. If trigger didn't work, manually create the public user
DO $$
DECLARE
    auth_user RECORD;
BEGIN
    -- Find auth users without corresponding public users
    FOR auth_user IN 
        SELECT au.id, au.email, au.email_confirmed_at, au.created_at, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN public.users pu ON au.id = pu.id
        WHERE pu.id IS NULL
    LOOP
        RAISE NOTICE 'Creating public user for: %', auth_user.email;
        
        INSERT INTO public.users (
            id,
            username,
            email,
            email_verified,
            created_at,
            updated_at
        ) VALUES (
            auth_user.id,
            COALESCE(auth_user.raw_user_meta_data->>'username', split_part(auth_user.email, '@', 1)),
            auth_user.email,
            auth_user.email_confirmed_at IS NOT NULL,
            auth_user.created_at,
            NOW()
        );
    END LOOP;
END $$;

-- 6. Final verification
SELECT 
    '=== FINAL VERIFICATION ===' as section;

SELECT 
    'Auth users:' as table_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email
FROM auth.users

UNION ALL

SELECT 
    'Public users:' as table_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email
FROM public.users;

-- 7. Show test user details
SELECT 
    '=== TEST USER DETAILS ===' as section;

-- Show auth user details
SELECT 
    'Auth user:' as source,
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE email = 'test@example.com';

-- Show public user details  
SELECT 
    'Public user:' as source,
    id,
    email,
    email_verified,
    created_at
FROM public.users 
WHERE email = 'test@example.com';

-- 8. Test the verification process
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get the test user ID
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com';
    
    IF test_user_id IS NOT NULL THEN
        -- Simulate email verification by updating email_confirmed_at
        UPDATE auth.users 
        SET email_confirmed_at = NOW()
        WHERE id = test_user_id;
        
        -- Update the public users table to match
        UPDATE public.users 
        SET email_verified = true, updated_at = NOW()
        WHERE id = test_user_id;
        
        RAISE NOTICE 'Test user verified successfully!';
    ELSE
        RAISE NOTICE 'No test user found to verify';
    END IF;
END $$;

-- 9. Show verification status
SELECT 
    '=== VERIFICATION STATUS ===' as section;

-- Show auth verification status
SELECT 
    'Auth verification:' as check_type,
    email,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'VERIFIED'
        ELSE 'UNVERIFIED'
    END as status
FROM auth.users 
WHERE email = 'test@example.com';

-- Show public verification status
SELECT 
    'Public verification:' as check_type,
    email,
    CASE 
        WHEN email_verified = true THEN 'VERIFIED'
        ELSE 'UNVERIFIED'
    END as status
FROM public.users 
WHERE email = 'test@example.com';

-- 10. Cleanup (optional - uncomment if you want to remove test user)
-- DELETE FROM public.users WHERE email = 'test@example.com';
-- DELETE FROM auth.users WHERE email = 'test@example.com';
