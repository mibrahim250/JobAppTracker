-- =====================================================
-- INTERVIEWS TABLE SETUP FOR SUPABASE
-- =====================================================
-- Run this in your Supabase SQL editor

-- 1. Create interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    time TIME NOT NULL,
    place VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in-progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Users can view own interviews" ON public.interviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews" ON public.interviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews" ON public.interviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interviews" ON public.interviews
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Grant permissions
GRANT ALL ON public.interviews TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.interviews_id_seq TO authenticated;

-- 5. Verification
SELECT 'Interviews table setup complete!' as status;

