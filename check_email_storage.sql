-- Check Email Storage and Verification Status in Supabase
-- Run this script in your Supabase SQL editor to verify the current state

-- 1. Check if tables exist
SELECT 
    'Table Status' as check_type,
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM (
    SELECT 'users' as table_name
    UNION SELECT 'job_applications'
) t
WHERE EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = t.table_name
);

-- 2. Check auth.users table (Supabase built-in)
SELECT 
    'Auth Users' as check_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as verified_emails,
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unverified_emails
FROM auth.users;

-- 3. Check public.users table (our custom table)
SELECT 
    'Public Users' as check_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_emails,
    COUNT(CASE WHEN email_verified = false THEN 1 END) as unverified_emails
FROM public.users;

-- 4. Show sample users from both tables
SELECT 
    'Auth Users Sample' as source,
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

SELECT 
    'Public Users Sample' as source,
    id,
    email,
    email_verified,
    email_verification_token,
    created_at
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Check if functions exist
SELECT 
    'Function Status' as check_type,
    routine_name,
    CASE 
        WHEN routine_name IS NOT NULL THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM (
    SELECT 'verify_user_email' as routine_name
    UNION SELECT 'get_user_by_email'
    UNION SELECT 'get_applications_by_email'
    UNION SELECT 'add_job_application'
) f
WHERE EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name = f.routine_name
);

-- 6. Check RLS policies
SELECT 
    'RLS Policies' as check_type,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'job_applications')
ORDER BY tablename, policyname;

-- 7. Test email verification function (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'verify_user_email') THEN
        RAISE NOTICE 'Email verification function exists and can be tested';
    ELSE
        RAISE NOTICE 'Email verification function is missing';
    END IF;
END $$;

-- 8. Check for any verification tokens
SELECT 
    'Verification Tokens' as check_type,
    COUNT(*) as total_tokens,
    COUNT(CASE WHEN email_verification_expires > NOW() THEN 1 END) as valid_tokens,
    COUNT(CASE WHEN email_verification_expires <= NOW() THEN 1 END) as expired_tokens
FROM public.users 
WHERE email_verification_token IS NOT NULL;

-- 9. Summary of email verification system
SELECT 
    'Email Verification Summary' as info,
    'Supabase Auth handles email verification automatically' as auth_note,
    'Custom verification tokens are stored in public.users table' as custom_note,
    'Frontend should use Supabase Auth verification flow' as recommendation;
