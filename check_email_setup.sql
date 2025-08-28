-- =====================================================
-- CHECK EMAIL SETUP AND VERIFY CONFIGURATION
-- =====================================================
-- Run this in your Supabase SQL Editor to diagnose email issues

-- 1. Check if users table exists and has data
SELECT 
    'Users Table Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') 
        THEN '✅ Users table exists'
        ELSE '❌ Users table missing'
    END as status;

-- 2. Check if job_applications table exists
SELECT 
    'Job Applications Table Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'job_applications') 
        THEN '✅ Job applications table exists'
        ELSE '❌ Job applications table missing'
    END as status;

-- 3. Check auth.users table for email verification status
SELECT 
    'Auth Users Email Verification' as check_type,
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as verified_users,
    COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unverified_users
FROM auth.users;

-- 4. Check public.users table for email verification status
SELECT 
    'Public Users Email Verification' as check_type,
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
    COUNT(*) FILTER (WHERE email_verified = false) as unverified_users
FROM public.users;

-- 5. Check if triggers exist
SELECT 
    'Trigger Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT FROM pg_trigger WHERE tgname = 'on_auth_user_created') 
        THEN '✅ User creation trigger exists'
        ELSE '❌ User creation trigger missing'
    END as status;

SELECT 
    'Email Verification Trigger' as check_type,
    CASE 
        WHEN EXISTS (SELECT FROM pg_trigger WHERE tgname = 'on_auth_user_email_confirmed') 
        THEN '✅ Email verification trigger exists'
        ELSE '❌ Email verification trigger missing'
    END as status;

-- 6. Check if functions exist
SELECT 
    'Function Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') 
        THEN '✅ handle_new_user function exists'
        ELSE '❌ handle_new_user function missing'
    END as status;

SELECT 
    'Email Verification Function' as check_type,
    CASE 
        WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'update_email_verification') 
        THEN '✅ update_email_verification function exists'
        ELSE '❌ update_email_verification function missing'
    END as status;

-- 7. Check RLS policies
SELECT 
    'RLS Policy Status' as check_type,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('users', 'job_applications');

-- 8. Show recent users and their verification status
SELECT 
    'Recent Users (Last 5)' as check_type,
    u.email,
    u.email_verified as public_verified,
    au.email_confirmed_at IS NOT NULL as auth_verified,
    u.created_at
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC
LIMIT 5;

-- 9. Check for any orphaned records
SELECT 
    'Orphaned Records Check' as check_type,
    COUNT(*) as orphaned_auth_users
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;

-- 10. Check email verification sync
SELECT 
    'Email Verification Sync Status' as check_type,
    COUNT(*) as mismatched_verification
FROM auth.users au
JOIN public.users u ON au.id = u.id
WHERE (au.email_confirmed_at IS NOT NULL AND u.email_verified = false)
   OR (au.email_confirmed_at IS NULL AND u.email_verified = true);

-- =====================================================
-- SUMMARY AND RECOMMENDATIONS
-- =====================================================

-- If you see issues above, run the COMPLETE_SUPABASE_SETUP.sql script
-- to fix the database structure and triggers.

-- For email sending issues:
-- 1. Go to Supabase Dashboard > Authentication > Settings
-- 2. Enable "Confirm email"
-- 3. Set your Site URL (e.g., http://localhost:3000)
-- 4. Check Authentication > Logs for email errors
