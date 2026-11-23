-- ========================================================
-- CampusFind Supabase Database Setup & Schema (Idempotent)
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Items Table (Lost & Found Listings with Contact & Verification Information)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Lost', 'Found')),
  category TEXT NOT NULL,
  custom_category TEXT,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  reported DATE NOT NULL DEFAULT CURRENT_DATE,
  photo_url TEXT,
  whatsapp_number TEXT,
  contact_number TEXT,
  email_address TEXT,
  contact_preference TEXT DEFAULT 'Share my contact details only with interested students.',
  verification_question TEXT,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  dismiss_reason TEXT,
  user_id UUID,
  reporter_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Idempotent column additions for existing installations
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS email_address TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS contact_preference TEXT DEFAULT 'Share my contact details only with interested students.';
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS verification_question TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS is_dismissed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS is_resolved BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS dismiss_reason TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS reporter_name TEXT;

-- 3. Reports Table (Staff Moderation & Dashboard)
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT ('CF-' || floor(random() * 9000 + 1000)::text),
  item_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Lost', 'Found')),
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  date_reported DATE NOT NULL DEFAULT CURRENT_DATE,
  review_status TEXT NOT NULL DEFAULT 'Pending review' CHECK (review_status IN ('Pending review', 'Approved', 'Dismissed')),
  description TEXT NOT NULL,
  reporter_whatsapp TEXT,
  reporter_contact TEXT,
  reporter_email TEXT,
  reporter_preference TEXT,
  dismiss_reason TEXT,
  dismissed_at TIMESTAMPTZ,
  warning_issued BOOLEAN NOT NULL DEFAULT false,
  warning_reason TEXT,
  warned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Idempotent column additions for existing reports table
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS reporter_whatsapp TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS reporter_contact TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS reporter_email TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS reporter_preference TEXT;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Public items read access" ON public.items;
DROP POLICY IF EXISTS "Public items insert access" ON public.items;
DROP POLICY IF EXISTS "Public items update access" ON public.items;
DROP POLICY IF EXISTS "Public items delete access" ON public.items;
DROP POLICY IF EXISTS "Authenticated items update access" ON public.items;
DROP POLICY IF EXISTS "Authenticated items delete access" ON public.items;
DROP POLICY IF EXISTS "Public reports insert access" ON public.reports;
DROP POLICY IF EXISTS "Staff reports read access" ON public.reports;
DROP POLICY IF EXISTS "Staff reports update access" ON public.reports;

-- 6. Create Clean RLS Policies
CREATE POLICY "Public items read access" ON public.items FOR SELECT USING (true);
CREATE POLICY "Public items insert access" ON public.items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public items update access" ON public.items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public items delete access" ON public.items FOR DELETE USING (true);
CREATE POLICY "Public reports insert access" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff reports read access" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Staff reports update access" ON public.reports FOR UPDATE USING (true) WITH CHECK (true);

-- 7. Storage Bucket setup for photo uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'item-photos');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'item-photos');

-- 8. Data Cleanup: Remove duplicates and normalize test entries
-- Remove duplicate Vivo phone charger posts (keeping original ef76e84f-f0f0-43c0-ab92-ce80b84a717f)
DELETE FROM public.items
WHERE id IN (
  '01f9d607-7aa9-4b82-a83a-7ab92475af59',
  '6e5c8751-5b01-4012-afc5-477a5593657b',
  '6c418563-8805-4c8e-b363-6e7f2932f288'
);

-- Fix item name mistakenly filled with user's name
UPDATE public.items
SET name = 'Casio Watch',
    reporter_name = 'Ashish kumar'
WHERE id = 'ebe681a7-a01c-47bc-a316-04de6cb1edff'
   OR name = 'Ashish kumar';

UPDATE public.reports
SET item_name = 'Casio Watch'
WHERE item_name = 'Ashish kumar';

