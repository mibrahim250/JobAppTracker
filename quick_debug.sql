-- Quick Debug - Run this first
-- This will tell us exactly what's happening

-- 1. Check if users table exists and has data
SELECT 
    'Users table exists' as check_name,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) as result;

-- 2. Count users in both tables
SELECT 
    'Auth users count' as table_name,
    COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
    'Public users count' as table_name,
    COUNT(*) as count
FROM public.users;

-- 3. Check if trigger exists
SELECT 
    'Trigger exists' as check_name,
    EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) as result;

-- 4. Check if function exists
SELECT 
    'Function exists' as check_name,
    EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'handle_new_user'
    ) as result;

-- 5. Show recent auth users (if any)
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 3;
