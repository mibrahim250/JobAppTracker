-- =====================================================
-- BASIC SUPABASE SETUP FOR JOB APPLICATION TRACKER
-- =====================================================
-- Run this in your Supabase SQL editor

-- 1. Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Users can view own applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON public.job_applications
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Grant permissions
GRANT ALL ON public.job_applications TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.job_applications_id_seq TO authenticated;

-- 5. Verification
SELECT 'Setup complete! Your job application tracker is ready.' as status;
