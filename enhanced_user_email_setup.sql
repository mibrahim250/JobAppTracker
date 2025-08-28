-- Enhanced User Email Setup for Job Application Tracker
-- This script enhances the database to properly handle email-based user associations

-- 1. Drop existing views, triggers and functions
DROP VIEW IF EXISTS public.user_applications_view;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.verify_user_email();
DROP FUNCTION IF EXISTS public.get_user_by_email(TEXT);
DROP FUNCTION IF EXISTS public.get_applications_by_email(TEXT);
DROP FUNCTION IF EXISTS public.add_job_application(TEXT, VARCHAR(200), VARCHAR(200), VARCHAR(50), DATE, TEXT);

-- 2. Drop existing tables (this will also drop job_applications due to foreign key)
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 3. Recreate users table with enhanced email handling
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    email_verification_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Recreate job_applications table with email-based user association
CREATE TABLE public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL, -- Store email for easier querying
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_job_applications_user_email ON public.job_applications(user_email);
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);

-- 6. Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. Enable RLS on job_applications table
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for job_applications table
CREATE POLICY "Users can view own applications" ON public.job_applications
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = user_email
    );

CREATE POLICY "Users can insert own applications" ON public.job_applications
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = user_email
    );

CREATE POLICY "Users can update own applications" ON public.job_applications
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = user_email
    );

CREATE POLICY "Users can delete own applications" ON public.job_applications
    FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = user_email
    );

-- 10. Create enhanced trigger function for new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username, email, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Create function to verify user email
CREATE OR REPLACE FUNCTION public.verify_user_email(verification_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Find user with matching verification token
    SELECT * INTO user_record 
    FROM public.users 
    WHERE email_verification_token = verification_token 
    AND email_verification_expires > NOW();
    
    IF user_record IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Update user as verified
    UPDATE public.users 
    SET 
        email_verified = TRUE,
        email_verification_token = NULL,
        email_verification_expires = NULL,
        updated_at = NOW()
    WHERE id = user_record.id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create function to get user by email
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email TEXT)
RETURNS TABLE(
    id UUID,
    username TEXT,
    email TEXT,
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

-- 14. Create function to get job applications by email
CREATE OR REPLACE FUNCTION public.get_applications_by_email(user_email TEXT)
RETURNS TABLE(
    id UUID,
    company VARCHAR(200),
    role VARCHAR(200),
    status VARCHAR(50),
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ja.id,
        ja.company,
        ja.role,
        ja.status,
        ja.applied_date,
        ja.notes,
        ja.created_at
    FROM public.job_applications ja
    WHERE ja.user_email = user_email
    ORDER BY ja.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create function to add job application with email
CREATE OR REPLACE FUNCTION public.add_job_application(
    user_email TEXT,
    company_name VARCHAR(200),
    role_name VARCHAR(200),
    status_name VARCHAR(50),
    applied_date_val DATE,
    notes_text TEXT
)
RETURNS UUID AS $$
DECLARE
    user_record RECORD;
    application_id UUID;
BEGIN
    -- Get user by email
    SELECT * INTO user_record FROM public.users WHERE email = user_email;
    
    -- If user doesn't exist, create a placeholder (or handle as needed)
    IF user_record IS NULL THEN
        -- For now, we'll create a placeholder user
        INSERT INTO public.users (id, username, email, email_verified)
        VALUES (
            gen_random_uuid(),
            split_part(user_email, '@', 1),
            user_email,
            FALSE
        ) RETURNING * INTO user_record;
    END IF;
    
    -- Insert job application
    INSERT INTO public.job_applications (
        user_id,
        user_email,
        company,
        role,
        status,
        applied_date,
        notes
    ) VALUES (
        user_record.id,
        user_email,
        company_name,
        role_name,
        status_name,
        applied_date_val,
        notes_text
    ) RETURNING id INTO application_id;
    
    RETURN application_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.job_applications TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_user_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_applications_by_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_job_application(TEXT, VARCHAR(200), VARCHAR(200), VARCHAR(50), DATE, TEXT) TO anon, authenticated;

-- 17. Create a view for easy user-application joins
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

-- 18. Grant permissions on view
GRANT SELECT ON public.user_applications_view TO anon, authenticated;

-- 19. Verify the setup
SELECT 
    'Enhanced setup complete' as status,
    (SELECT COUNT(*) FROM public.users) as users_count,
    (SELECT COUNT(*) FROM public.job_applications) as applications_count;

-- 20. Show available functions
SELECT 
    'Available Functions:' as info,
    'public.verify_user_email(token)' as function_1,
    'public.get_user_by_email(email)' as function_2,
    'public.get_applications_by_email(email)' as function_3,
    'public.add_job_application(email, company, role, status, date, notes)' as function_4;
