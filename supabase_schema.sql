-- ========================================================
-- CampusFind Supabase Database Setup & Schema (Idempotent)
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Items Table (Lost & Found Listings with Contact Information)
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Idempotent column additions for existing installations
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS email_address TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS contact_preference TEXT DEFAULT 'Share my contact details only with interested students.';

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
DROP POLICY IF EXISTS "Authenticated items update access" ON public.items;
DROP POLICY IF EXISTS "Authenticated items delete access" ON public.items;
DROP POLICY IF EXISTS "Public reports insert access" ON public.reports;
DROP POLICY IF EXISTS "Staff reports read access" ON public.reports;
DROP POLICY IF EXISTS "Staff reports update access" ON public.reports;

-- 6. Create RLS Policies
CREATE POLICY "Public items read access" ON public.items FOR SELECT USING (true);
CREATE POLICY "Public items insert access" ON public.items FOR INSERT WITH CHECK (true);
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
