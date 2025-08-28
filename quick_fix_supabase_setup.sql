-- =====================================================
-- QUICK FIX: SUPABASE SETUP FOR JOB APPLICATION SAVES
-- =====================================================
-- Run this in your Supabase SQL editor to fix job application save issues

-- 1. Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create job_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.job_applications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Create RLS policies for job_applications table
DROP POLICY IF EXISTS "Users can view own applications" ON public.job_applications;
CREATE POLICY "Users can view own applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own applications" ON public.job_applications;
CREATE POLICY "Users can insert own applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own applications" ON public.job_applications;
CREATE POLICY "Users can update own applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own applications" ON public.job_applications;
CREATE POLICY "Users can delete own applications" ON public.job_applications
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Create function to get user by email
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    email_verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.username, u.email_verified, u.created_at
    FROM public.users u
    WHERE u.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to get applications by email
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

-- 8. Create function to add job application
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
    
    -- If user doesn't exist, create them
    IF user_id_val IS NULL THEN
        INSERT INTO public.users (email, username, email_verified)
        VALUES (user_email, split_part(user_email, '@', 1), FALSE)
        RETURNING id INTO user_id_val;
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

-- 9. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.job_applications TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.job_applications_id_seq TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_applications_by_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_job_application(TEXT, VARCHAR(200), VARCHAR(200), VARCHAR(50), DATE, TEXT) TO anon, authenticated;

-- 10. Create trigger to automatically create user profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, username, email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Verification queries
DO $$
BEGIN
    -- Check if tables exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ users table exists';
    ELSE
        RAISE NOTICE '❌ users table missing';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'job_applications' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ job_applications table exists';
    ELSE
        RAISE NOTICE '❌ job_applications table missing';
    END IF;
    
    -- Check if functions exist
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'add_job_application') THEN
        RAISE NOTICE '✅ add_job_application function exists';
    ELSE
        RAISE NOTICE '❌ add_job_application function missing';
    END IF;
    
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'get_applications_by_email') THEN
        RAISE NOTICE '✅ get_applications_by_email function exists';
    ELSE
        RAISE NOTICE '❌ get_applications_by_email function missing';
    END IF;
    
    -- Check RLS
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'job_applications' AND rowsecurity = true) THEN
        RAISE NOTICE '✅ RLS enabled on job_applications';
    ELSE
        RAISE NOTICE '❌ RLS not enabled on job_applications';
    END IF;
    
END $$;

-- 12. Test the setup
SELECT 'Setup complete! Test with:' as message;
SELECT 'SELECT public.add_job_application(''test@example.com'', ''Test Company'', ''Test Role'', ''Applied'', NULL, ''Test notes'');' as test_query;
