-- Add user_id column to job_applications table to link applications to specific users
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing records (if any) to have a default user (you may want to handle this differently)
-- For now, we'll set existing records to NULL so they don't show up for any user
UPDATE public.job_applications SET user_id = NULL WHERE user_id IS NULL;

-- Make user_id NOT NULL for new records
ALTER TABLE public.job_applications ALTER COLUMN user_id SET NOT NULL;

-- Enable Row Level Security on job_applications table
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for job_applications table
-- Users can only see their own job applications
CREATE POLICY "Users can view own job applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own job applications
CREATE POLICY "Users can insert own job applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own job applications
CREATE POLICY "Users can update own job applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own job applications
CREATE POLICY "Users can delete own job applications" ON public.job_applications
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
