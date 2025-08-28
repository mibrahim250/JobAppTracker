-- =====================================================
-- COMPLETE SUPABASE SETUP FOR JOB APPLICATION TRACKER
-- =====================================================
-- This is the ONLY SQL script you need - run this in Supabase SQL Editor

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing objects to start fresh
DROP VIEW IF EXISTS public.user_applications_view;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_email_verification();
DROP FUNCTION IF EXISTS public.verify_user_email(TEXT);
DROP FUNCTION IF EXISTS public.get_user_by_email(TEXT);
DROP FUNCTION IF EXISTS public.get_applications_by_email(TEXT);
DROP FUNCTION IF EXISTS public.add_job_application(TEXT, VARCHAR(200), VARCHAR(200), VARCHAR(50), DATE, TEXT);
DROP FUNCTION IF EXISTS public.update_job_application(BIGINT, TEXT, VARCHAR(200), VARCHAR(200), VARCHAR(50), DATE, TEXT);
DROP FUNCTION IF EXISTS public.delete_job_application(BIGINT, TEXT);
DROP FUNCTION IF EXISTS public.sync_local_storage_data(TEXT, JSONB);
DROP FUNCTION IF EXISTS public.get_user_stats(TEXT);

-- 3. Drop existing tables
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 4. Create users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create job_applications table
CREATE TABLE public.job_applications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_job_applications_company ON public.job_applications(company);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 9. Create RLS policies for job_applications table
CREATE POLICY "Users can view own applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON public.job_applications
    FOR DELETE USING (auth.uid() = user_id);

-- 10. Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username, email, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Function to update email verification status
CREATE OR REPLACE FUNCTION public.update_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.users 
        SET email_verified = TRUE, updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.update_email_verification();

-- 13. Function to get user by email
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email TEXT)
RETURNS TABLE (
    id UUID,
    username VARCHAR(50),
    email VARCHAR(255),
    email_verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.username, u.email, u.email_verified, u.created_at
    FROM public.users u
    WHERE u.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Function to get applications by user email
CREATE OR REPLACE FUNCTION public.get_applications_by_email(user_email TEXT)
RETURNS TABLE (
    id BIGINT,
    company VARCHAR(200),
    role VARCHAR(200),
    status VARCHAR(50),
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT ja.id, ja.company, ja.role, ja.status, ja.applied_date, ja.notes, ja.created_at
    FROM public.job_applications ja
    JOIN public.users u ON ja.user_id = u.id
    WHERE u.email = user_email
    ORDER BY ja.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Function to add job application
CREATE OR REPLACE FUNCTION public.add_job_application(
    user_email TEXT,
    company_name VARCHAR(200),
    role_name VARCHAR(200),
    status_name VARCHAR(50),
    applied_date_val DATE DEFAULT NULL,
    notes_text TEXT DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    user_id_val UUID;
    app_id BIGINT;
BEGIN
    -- Get user ID from email
    SELECT u.id INTO user_id_val
    FROM public.users u
    WHERE u.email = user_email;
    
    IF user_id_val IS NULL THEN
        RAISE EXCEPTION 'User not found for email: %', user_email;
    END IF;
    
    -- Insert the application
    INSERT INTO public.job_applications (
        user_id, company, role, status, applied_date, notes
    ) VALUES (
        user_id_val, company_name, role_name, status_name, applied_date_val, notes_text
    ) RETURNING id INTO app_id;
    
    RETURN app_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Function to update job application
CREATE OR REPLACE FUNCTION public.update_job_application(
    app_id BIGINT,
    user_email TEXT,
    company_name VARCHAR(200),
    role_name VARCHAR(200),
    status_name VARCHAR(50),
    applied_date_val DATE DEFAULT NULL,
    notes_text TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_id_val UUID;
    updated_count INTEGER;
BEGIN
    -- Get user ID from email
    SELECT u.id INTO user_id_val
    FROM public.users u
    WHERE u.email = user_email;
    
    IF user_id_val IS NULL THEN
        RAISE EXCEPTION 'User not found for email: %', user_email;
    END IF;
    
    -- Update the application
    UPDATE public.job_applications
    SET 
        company = company_name,
        role = role_name,
        status = status_name,
        applied_date = applied_date_val,
        notes = notes_text,
        updated_at = NOW()
    WHERE id = app_id AND user_id = user_id_val;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Function to delete job application
CREATE OR REPLACE FUNCTION public.delete_job_application(
    app_id BIGINT,
    user_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    user_id_val UUID;
    deleted_count INTEGER;
BEGIN
    -- Get user ID from email
    SELECT u.id INTO user_id_val
    FROM public.users u
    WHERE u.email = user_email;
    
    IF user_id_val IS NULL THEN
        RAISE EXCEPTION 'User not found for email: %', user_email;
    END IF;
    
    -- Delete the application
    DELETE FROM public.job_applications
    WHERE id = app_id AND user_id = user_id_val;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(user_email TEXT)
RETURNS TABLE (
    total_applications BIGINT,
    pending_applications BIGINT,
    interview_applications BIGINT,
    offer_applications BIGINT,
    rejected_applications BIGINT
) AS $$
DECLARE
    user_id_val UUID;
BEGIN
    -- Get user ID from email
    SELECT u.id INTO user_id_val
    FROM public.users u
    WHERE u.email = user_email;
    
    IF user_id_val IS NULL THEN
        RAISE EXCEPTION 'User not found for email: %', user_email;
    END IF;
    
    RETURN QUERY
    SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status IN ('Applied', 'Under Review')) as pending_applications,
        COUNT(*) FILTER (WHERE status IN ('Phone Screen', 'Interview', 'Technical Interview', 'Final Interview')) as interview_applications,
        COUNT(*) FILTER (WHERE status IN ('Offer', 'Accepted')) as offer_applications,
        COUNT(*) FILTER (WHERE status = 'Rejected') as rejected_applications
    FROM public.job_applications
    WHERE user_id = user_id_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 19. Function to verify user email (for manual verification)
CREATE OR REPLACE FUNCTION public.verify_user_email(verification_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_id_val UUID;
BEGIN
    -- This is a placeholder for manual email verification
    -- In a real implementation, you would verify the token
    -- For now, we'll just return true if the token exists
    IF verification_token IS NOT NULL AND length(verification_token) > 0 THEN
        -- Update the user's email verification status
        UPDATE public.users 
        SET email_verified = TRUE, updated_at = NOW()
        WHERE id = auth.uid();
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 20. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.job_applications TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_user_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_applications_by_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_job_application(TEXT, VARCHAR(200), VARCHAR(200), VARCHAR(50), DATE, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_job_application(BIGINT, TEXT, VARCHAR(200), VARCHAR(200), VARCHAR(50), DATE, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_job_application(BIGINT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_stats(TEXT) TO anon, authenticated;

-- 21. Create a view for easy user-application joins
CREATE VIEW public.user_applications_view AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.email_verified,
    ja.id as application_id,
    ja.company,
    ja.role,
    ja.status,
    ja.applied_date,
    ja.notes,
    ja.created_at as application_created_at
FROM public.users u
LEFT JOIN public.job_applications ja ON u.id = ja.user_id
ORDER BY ja.created_at DESC;

GRANT SELECT ON public.user_applications_view TO anon, authenticated;

-- 22. Verify the setup
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE '✅ Users table created successfully';
    ELSE
        RAISE NOTICE '❌ Users table creation failed';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'job_applications') THEN
        RAISE NOTICE '✅ Job applications table created successfully';
    ELSE
        RAISE NOTICE '❌ Job applications table creation failed';
    END IF;
    
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') THEN
        RAISE NOTICE '✅ handle_new_user function created successfully';
    ELSE
        RAISE NOTICE '❌ handle_new_user function creation failed';
    END IF;
    
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'get_applications_by_email') THEN
        RAISE NOTICE '✅ get_applications_by_email function created successfully';
    ELSE
        RAISE NOTICE '❌ get_applications_by_email function creation failed';
    END IF;
    
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'add_job_application') THEN
        RAISE NOTICE '✅ add_job_application function created successfully';
    ELSE
        RAISE NOTICE '❌ add_job_application function creation failed';
    END IF;
END $$;

-- 23. Show final status
SELECT 
    '=== SETUP COMPLETE ===' as status,
    (SELECT COUNT(*) FROM public.users) as users_count,
    (SELECT COUNT(*) FROM public.job_applications) as applications_count;

-- =====================================================
-- SETUP COMPLETE - YOUR APP IS READY!
-- =====================================================

-- This script sets up:
-- ✅ User authentication with email verification
-- ✅ Job application storage with user relationships
-- ✅ Row Level Security for data protection
-- ✅ Automatic user profile creation on signup
-- ✅ Email verification tracking
-- ✅ Database functions for CRUD operations
-- ✅ Application statistics
-- ✅ Proper indexing for performance

-- Next steps:
-- 1. Enable "Confirm email" in Supabase Auth settings
-- 2. Clear localStorage in your browser
-- 3. Test user registration and email verification
-- 4. Verify that applications are saved to the database

