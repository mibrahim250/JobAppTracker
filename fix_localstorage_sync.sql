-- Fix localStorage Sync Issue
-- This script helps identify and fix the localStorage vs database sync problem

-- 1. Check current database state
SELECT 
    '=== CURRENT DATABASE STATE ===' as section,
    (SELECT COUNT(*) FROM auth.users) as auth_users,
    (SELECT COUNT(*) FROM public.users) as public_users,
    (SELECT COUNT(*) FROM public.job_applications) as job_applications;

-- 2. Check if there are any job applications in the database
SELECT 
    '=== JOB APPLICATIONS IN DATABASE ===' as section;

SELECT 
    id,
    user_id,
    user_email,
    company,
    role,
    status,
    applied_date,
    created_at
FROM public.job_applications
ORDER BY created_at DESC;

-- 3. Check if users exist but no applications
SELECT 
    '=== USERS WITHOUT APPLICATIONS ===' as section;

SELECT 
    u.id,
    u.email,
    u.email_verified,
    u.created_at,
    CASE 
        WHEN ja.id IS NULL THEN 'NO APPLICATIONS'
        ELSE 'HAS APPLICATIONS'
    END as application_status
FROM public.users u
LEFT JOIN public.job_applications ja ON u.id = ja.user_id
ORDER BY u.created_at DESC;

-- 4. Manual fix: Create test job application if needed
DO $$
DECLARE
    test_user_id UUID;
    test_user_email TEXT;
BEGIN
    -- Find a user to create a test application for
    SELECT id, email INTO test_user_id, test_user_email 
    FROM public.users 
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Check if this user already has applications
        IF NOT EXISTS (SELECT 1 FROM public.job_applications WHERE user_id = test_user_id) THEN
            -- Create a test job application
            INSERT INTO public.job_applications (
                user_id,
                user_email,
                company,
                role,
                status,
                applied_date,
                notes,
                created_at,
                updated_at
            ) VALUES (
                test_user_id,
                test_user_email,
                'Test Company',
                'Software Engineer',
                'Applied',
                CURRENT_DATE,
                'Test application created by script',
                NOW(),
                NOW()
            );
            
            RAISE NOTICE 'Created test job application for user: %', test_user_email;
        ELSE
            RAISE NOTICE 'User already has applications, skipping test creation';
        END IF;
    ELSE
        RAISE NOTICE 'No users found to create test application for';
    END IF;
END $$;

-- 5. Show final state
SELECT 
    '=== FINAL STATE ===' as section,
    (SELECT COUNT(*) FROM auth.users) as auth_users,
    (SELECT COUNT(*) FROM public.users) as public_users,
    (SELECT COUNT(*) FROM public.job_applications) as job_applications;

-- 6. Recommendations for fixing the frontend
SELECT 
    '=== FRONTEND FIX RECOMMENDATIONS ===' as section;

SELECT 
    '1. Check browser localStorage for jobApplications' as step1,
    '2. If data exists in localStorage, manually add it to database' as step2,
    '3. Update frontend to prioritize database over localStorage' as step3,
    '4. Remove localStorage fallback for job applications' as step4;

-- 7. Check localStorage data (this will show what the user should check)
SELECT 
    '=== CHECK THESE IN BROWSER ===' as section;

SELECT 
    'Open browser DevTools (F12)' as step1,
    'Go to Application/Storage tab' as step2,
    'Look for localStorage > jobApplications' as step3,
    'If data exists there, it needs to be synced to database' as step4;
