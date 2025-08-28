-- Debug Empty Tables Issue
-- Run this to figure out why your tables are empty

-- 1. Check if the setup script was run
SELECT 
    '=== DATABASE SETUP STATUS ===' as section;

-- Check if tables exist
SELECT 
    'Table Existence Check:' as check_type,
    table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = t.table_name
        ) THEN 'EXISTS'
        ELSE 'MISSING - Run enhanced_user_email_setup.sql'
    END as status
FROM (
    SELECT 'users' as table_name
    UNION SELECT 'job_applications'
) t;

-- 2. Check if triggers exist
SELECT 
    'Trigger Status:' as check_type,
    trigger_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_schema = 'public' 
            AND trigger_name = t.trigger_name
        ) THEN 'EXISTS'
        ELSE 'MISSING - Setup incomplete'
    END as status
FROM (
    SELECT 'on_auth_user_created' as trigger_name
) t;

-- 3. Check if functions exist
SELECT 
    'Function Status:' as check_type,
    routine_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = f.routine_name
        ) THEN 'EXISTS'
        ELSE 'MISSING - Setup incomplete'
    END as status
FROM (
    SELECT 'handle_new_user' as routine_name
    UNION SELECT 'get_user_by_email'
    UNION SELECT 'add_job_application'
) f;

-- 4. Check auth.users (Supabase built-in)
SELECT 
    '=== AUTH USERS STATUS ===' as section,
    COUNT(*) as total_auth_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as verified_users
FROM auth.users;

-- 5. Check public.users (your custom table)
SELECT 
    '=== PUBLIC USERS STATUS ===' as section,
    COUNT(*) as total_public_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users
FROM public.users;

-- 6. Show any existing auth users
SELECT 
    '=== EXISTING AUTH USERS ===' as section;

SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'VERIFIED'
        WHEN email IS NOT NULL THEN 'UNVERIFIED'
        ELSE 'NO EMAIL'
    END as status
FROM auth.users 
ORDER BY created_at DESC;

-- 7. Check if trigger is working
DO $$
DECLARE
    auth_user_count INTEGER;
    public_user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO auth_user_count FROM auth.users;
    SELECT COUNT(*) INTO public_user_count FROM public.users;
    
    RAISE NOTICE 'Auth users: %, Public users: %', auth_user_count, public_user_count;
    
    IF auth_user_count > 0 AND public_user_count = 0 THEN
        RAISE NOTICE 'ISSUE FOUND: Auth users exist but public users table is empty';
        RAISE NOTICE 'This means the trigger is not working or was not created';
        RAISE NOTICE 'SOLUTION: Run the enhanced_user_email_setup.sql script';
    ELSIF auth_user_count = 0 THEN
        RAISE NOTICE 'No users have signed up yet - this is normal';
        RAISE NOTICE 'Try signing up a new user to test the system';
    ELSIF auth_user_count = public_user_count THEN
        RAISE NOTICE 'Tables are in sync - everything looks good!';
    ELSE
        RAISE NOTICE 'Partial sync issue - some users may not have been created in public.users';
    END IF;
END $$;

-- 8. Manual fix for existing auth users (if needed)
DO $$
DECLARE
    auth_user RECORD;
BEGIN
    -- Check if there are auth users without corresponding public users
    FOR auth_user IN 
        SELECT au.id, au.email, au.email_confirmed_at, au.created_at
        FROM auth.users au
        LEFT JOIN public.users pu ON au.id = pu.id
        WHERE pu.id IS NULL
    LOOP
        RAISE NOTICE 'Found auth user without public user: % (%)', auth_user.email, auth_user.id;
        
        -- Insert missing public user
        INSERT INTO public.users (id, username, email, email_verified, created_at)
        VALUES (
            auth_user.id,
            COALESCE(split_part(auth_user.email, '@', 1), 'user'),
            auth_user.email,
            auth_user.email_confirmed_at IS NOT NULL,
            auth_user.created_at
        );
        
        RAISE NOTICE 'Created public user for: %', auth_user.email;
    END LOOP;
END $$;

-- 9. Final status check
SELECT 
    '=== FINAL STATUS ===' as section,
    (SELECT COUNT(*) FROM auth.users) as auth_users,
    (SELECT COUNT(*) FROM public.users) as public_users,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users) 
        THEN 'SYNCED'
        ELSE 'OUT OF SYNC'
    END as sync_status;

-- 10. Recommendations
SELECT 
    '=== RECOMMENDATIONS ===' as section;

SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')
        THEN '1. Run enhanced_user_email_setup.sql to create tables'
        ELSE '1. Tables exist ✓'
    END as step1,
    
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_schema = 'public' AND trigger_name = 'on_auth_user_created')
        THEN '2. Run enhanced_user_email_setup.sql to create triggers'
        ELSE '2. Triggers exist ✓'
    END as step2,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = 0
        THEN '3. Sign up a new user to test the system'
        ELSE '3. Users exist ✓'
    END as step3,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) != (SELECT COUNT(*) FROM public.users)
        THEN '4. Run this script again to sync existing users'
        ELSE '4. Users are synced ✓'
    END as step4;
