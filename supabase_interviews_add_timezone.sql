-- =====================================================
-- ADD TIMEZONE COLUMN TO INTERVIEWS TABLE
-- =====================================================
-- Run this in your Supabase SQL editor to add timezone support

-- Add timezone column to interviews table
ALTER TABLE public.interviews 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC';

-- Update existing rows to have a default timezone (optional, only if you have existing data)
-- UPDATE public.interviews SET timezone = 'UTC' WHERE timezone IS NULL;

-- Verification
SELECT 'Timezone column added successfully!' as status;

