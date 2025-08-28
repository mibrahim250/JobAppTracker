-- Verification Script: Check if Email-Based System is Implemented
-- Run this in your Supabase SQL editor to verify the implementation

-- 1. Check if tables exist
SELECT 
    'Table Check:' as check_type,
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'job_applications');

-- 2. Check if functions exist
SELECT 
    'Function Check:' as check_type,
    routine_name,
    CASE 
        WHEN routine_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'get_user_by_email',
    'get_applications_by_email', 
    'add_job_application',
    'verify_user_email'
);

-- 3. Check if RLS is enabled
SELECT 
    'RLS Check:' as check_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'job_applications');

-- 4. Check if RLS policies exist
SELECT 
    'RLS Policies:' as check_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'job_applications');

-- 5. Check if indexes exist
SELECT 
    'Index Check:' as check_type,
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'job_applications');

-- 6. Check if view exists
SELECT 
    'View Check:' as check_type,
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'user_applications_view';

-- 7. Check table structure
SELECT 
    'Users Table Structure:' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

SELECT 
    'Job Applications Table Structure:' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'job_applications'
ORDER BY ordinal_position;

-- 8. Test function calls (if they exist)
DO $$
BEGIN
    -- Test get_user_by_email function
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_user_by_email') THEN
        RAISE NOTICE '✅ get_user_by_email function exists';
    ELSE
        RAISE NOTICE '❌ get_user_by_email function missing';
    END IF;
    
    -- Test get_applications_by_email function
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_applications_by_email') THEN
        RAISE NOTICE '✅ get_applications_by_email function exists';
    ELSE
        RAISE NOTICE '❌ get_applications_by_email function missing';
    END IF;
    
    -- Test add_job_application function
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'add_job_application') THEN
        RAISE NOTICE '✅ add_job_application function exists';
    ELSE
        RAISE NOTICE '❌ add_job_application function missing';
    END IF;
    
    -- Test verify_user_email function
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'verify_user_email') THEN
        RAISE NOTICE '✅ verify_user_email function exists';
    ELSE
        RAISE NOTICE '❌ verify_user_email function missing';
    END IF;
END $$;

-- 9. Summary
SELECT 
    'IMPLEMENTATION SUMMARY:' as summary,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'job_applications')) = 2 
        THEN '✅ Tables: IMPLEMENTED'
        ELSE '❌ Tables: MISSING'
    END as tables_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('get_user_by_email', 'get_applications_by_email', 'add_job_application', 'verify_user_email')) = 4 
        THEN '✅ Functions: IMPLEMENTED'
        ELSE '❌ Functions: MISSING'
    END as functions_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('users', 'job_applications')) >= 6 
        THEN '✅ RLS Policies: IMPLEMENTED'
        ELSE '❌ RLS Policies: MISSING'
    END as rls_status;
