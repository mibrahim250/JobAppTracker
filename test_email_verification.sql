-- Test Email Verification System
-- Run this in your Supabase SQL editor to test the email verification setup

-- 1. Check current state of email storage
SELECT 
    '=== EMAIL STORAGE STATUS ===' as section;

-- Check auth.users (Supabase built-in)
SELECT 
    'Auth Users Table:' as table_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as verified_emails,
    COUNT(CASE WHEN email_confirmed_at IS NULL AND email IS NOT NULL THEN 1 END) as unverified_emails
FROM auth.users;

-- Check public.users (our custom table)
SELECT 
    'Public Users Table:' as table_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_emails,
    COUNT(CASE WHEN email_verified = false THEN 1 END) as unverified_emails
FROM public.users;

-- 2. Show sample data
SELECT 
    '=== SAMPLE USER DATA ===' as section;

SELECT 
    'Auth Users Sample:' as source,
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
ORDER BY created_at DESC 
LIMIT 5;

SELECT 
    'Public Users Sample:' as source,
    id,
    email,
    email_verified,
    email_verification_token,
    created_at,
    CASE 
        WHEN email_verified = true THEN 'VERIFIED'
        WHEN email IS NOT NULL THEN 'UNVERIFIED'
        ELSE 'NO EMAIL'
    END as status
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Test email verification function
SELECT 
    '=== EMAIL VERIFICATION FUNCTION TEST ===' as section;

-- Check if the function exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = 'verify_user_email'
        ) THEN 'Function EXISTS'
        ELSE 'Function MISSING'
    END as function_status;

-- 4. Check for any verification tokens
SELECT 
    '=== VERIFICATION TOKENS ===' as section,
    COUNT(*) as total_tokens,
    COUNT(CASE WHEN email_verification_expires > NOW() THEN 1 END) as valid_tokens,
    COUNT(CASE WHEN email_verification_expires <= NOW() THEN 1 END) as expired_tokens
FROM public.users 
WHERE email_verification_token IS NOT NULL;

-- 5. Show verification token details (if any exist)
SELECT 
    '=== VERIFICATION TOKEN DETAILS ===' as section;

SELECT 
    id,
    email,
    email_verification_token,
    email_verification_expires,
    CASE 
        WHEN email_verification_expires > NOW() THEN 'VALID'
        ELSE 'EXPIRED'
    END as token_status
FROM public.users 
WHERE email_verification_token IS NOT NULL
ORDER BY email_verification_expires DESC;

-- 6. Test the verification process
DO $$
DECLARE
    test_user_id UUID;
    test_token TEXT;
BEGIN
    -- Find a user with an unverified email
    SELECT id INTO test_user_id 
    FROM public.users 
    WHERE email_verified = false 
    AND email IS NOT NULL 
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Found test user with ID: %', test_user_id;
        
        -- Generate a test verification token
        test_token := encode(gen_random_bytes(32), 'hex');
        
        -- Update user with test token
        UPDATE public.users 
        SET 
            email_verification_token = test_token,
            email_verification_expires = NOW() + INTERVAL '1 hour'
        WHERE id = test_user_id;
        
        RAISE NOTICE 'Test verification token generated: %', test_token;
        RAISE NOTICE 'You can test the verification function with this token';
    ELSE
        RAISE NOTICE 'No unverified users found for testing';
    END IF;
END $$;

-- 7. Summary and recommendations
SELECT 
    '=== SUMMARY AND RECOMMENDATIONS ===' as section;

SELECT 
    'Email Verification System Status:' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email_confirmed_at IS NOT NULL) 
        THEN 'WORKING - Verified users found'
        ELSE 'NEEDS TESTING - No verified users found'
    END as auth_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE email_verified = true) 
        THEN 'WORKING - Verified users found'
        ELSE 'NEEDS TESTING - No verified users found'
    END as custom_status;

SELECT 
    'How to test email verification:' as instruction,
    '1. Sign up a new user with email' as step1,
    '2. Check email for verification link' as step2,
    '3. Click verification link' as step3,
    '4. Run this script again to see verification status' as step4;

SELECT 
    'Supabase Auth handles email verification automatically' as note1,
    'Custom verification tokens are stored in public.users table' as note2,
    'Frontend should use Supabase Auth verification flow' as note3;
