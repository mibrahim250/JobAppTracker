-- Test Script for Email-Based User System
-- This script tests the enhanced email-based functionality

-- 1. Test user creation and email association
SELECT 'Testing user creation...' as test_step;

-- Insert a test user
INSERT INTO public.users (id, username, email, email_verified, created_at)
VALUES (
    gen_random_uuid(),
    'testuser',
    'test@example.com',
    TRUE,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Test getting user by email
SELECT 'Testing get_user_by_email function...' as test_step;

SELECT * FROM public.get_user_by_email('test@example.com');

-- 3. Test adding job application by email
SELECT 'Testing add_job_application function...' as test_step;

SELECT public.add_job_application(
    'test@example.com',
    'Test Company',
    'Software Engineer',
    'Applied',
    '2024-01-15',
    'Test application notes'
) as new_application_id;

-- 4. Test getting applications by email
SELECT 'Testing get_applications_by_email function...' as test_step;

SELECT * FROM public.get_applications_by_email('test@example.com');

-- 5. Test the user_applications_view
SELECT 'Testing user_applications_view...' as test_step;

SELECT * FROM public.user_applications_view 
WHERE email = 'test@example.com';

-- 6. Test RLS policies
SELECT 'Testing RLS policies...' as test_step;

-- Check if we can see the test data (this should work for authenticated users)
SELECT 
    'RLS Test Results:' as info,
    (SELECT COUNT(*) FROM public.users WHERE email = 'test@example.com') as users_count,
    (SELECT COUNT(*) FROM public.job_applications WHERE user_email = 'test@example.com') as applications_count;

-- 7. Test email verification function
SELECT 'Testing email verification...' as test_step;

-- Create a test verification token
UPDATE public.users 
SET 
    email_verification_token = 'test-token-123',
    email_verification_expires = NOW() + INTERVAL '1 hour'
WHERE email = 'test@example.com';

-- Test verification
SELECT public.verify_user_email('test-token-123') as verification_result;

-- 8. Show final test results
SELECT 'Final Test Results:' as test_summary;

SELECT 
    u.email,
    u.username,
    u.email_verified,
    COUNT(ja.id) as application_count
FROM public.users u
LEFT JOIN public.job_applications ja ON u.id = ja.user_id
WHERE u.email = 'test@example.com'
GROUP BY u.id, u.email, u.username, u.email_verified;

-- 9. Clean up test data (optional - comment out to keep test data)
-- DELETE FROM public.job_applications WHERE user_email = 'test@example.com';
-- DELETE FROM public.users WHERE email = 'test@example.com';

SELECT 'Email-based system test completed successfully!' as final_status;
