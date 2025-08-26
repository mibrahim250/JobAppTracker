-- Check Supabase Auth Settings
-- This will help identify if auth is properly configured

-- Check if email confirmations are enabled (this might prevent signups)
-- Note: This is a system setting, not a database query
-- Go to Authentication > Settings in your Supabase dashboard

-- Check if there are any recent auth events
SELECT 
    id,
    event_type,
    created_at,
    user_id,
    ip_address
FROM auth.audit_log_entries 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if there are any failed signup attempts
SELECT 
    id,
    event_type,
    created_at,
    user_id,
    ip_address,
    raw_user_meta_data
FROM auth.audit_log_entries 
WHERE event_type IN ('signup', 'signup_failed')
ORDER BY created_at DESC 
LIMIT 10;

-- Check if the trigger is actually firing
-- Look for any errors in the logs
SELECT 
    'Check Supabase Logs' as instruction,
    'Go to Dashboard > Logs to see if there are any trigger errors' as details;
